import React, { useState } from "react";
import Map from "./../../components/Map/Map";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useNavigate } from "react-router-dom";
import DetailPage from "../DetailPage/DetailPage";

const marks = [
    {value: 0, label: '1km',},
    {value: 25, label: '2km',},
    {value: 50, label: '3km',},
    {value: 75, label: '4km',},
    {value: 100, label: '5km',},
];

const Response = {
    success: "SUCCESS",
    error: "ERROR",
    zero_result: "ZERO_RESULT",
};

type SearchResult = {
    address_name: string;
    category_group_code: string;
    category_group_name: string;
    category_name: string;
    distance: string;
    id: string;
    phone: string;
    place_name: string;
    place_url: string;
    road_address_name: string;
    x: string;
    y: string;
}

function range(start:number, count:number) {
    let array = [];
    while(count--) {
      array.push(start++);
    }
    return array;
}
const N_ITEM_PAGE = 15

function MainPage() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResponse, setSearchResponse] = useState<string>(Response.zero_result);
    const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
    const [searchPagination, setSearchPagination] = useState<kakao.maps.Pagination|undefined>(undefined);
    const [radius, setRadius] = useState<number>(25);
    const [openReport, setOpenReport] = useState<boolean>(false);
    const navigate = useNavigate();

    const searchResultBox = () => {
        const pagination = searchPagination as kakao.maps.Pagination;
        const idxArray: number[] = range(1, pagination.totalCount/N_ITEM_PAGE);
        return (
            <div className="search-result-box">
                <ul className="search-result-list">
                    {searchResult.map((value)=>{
                        return <li key={value.id} className="search-result">{value.place_name}</li>
                    })}
                </ul>
                <div className="search-result-pagination">
                    <a href="#" onClick={()=>{pagination.gotoFirst()}}>{"< "}</a>
                    {idxArray.map((idx)=>{
                        return (<a 
                                    href="#" 
                                    className={idx===1?"on idx": "idx"}
                                    onClick={()=>{pagination.gotoPage(idx)}}
                                >{`${idx} `}</a>) 
                    })}
                    <a href="#" onClick={()=>{pagination.gotoLast()}}>{">"}</a>
                </div>
            </div>
        );
    }
    const onClickMyPageIcon = () => {
        navigate("/mypage");
    };
    const onChangeMapRadius = (event: Event, newValue: number | number[]) => {
        setRadius(newValue as number);

    };
    const onClickFindOutButton = () => {
        navigate("/detail");
    };
    const onClickReportButton = () => {
        setOpenReport(true);
    };
    const onSubmitSearchBox = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key != "Enter") return;
        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(searchQuery, (data: SearchResult[], status, pagination)=>{
            if (status === kakao.maps.services.Status.OK) {
                console.log(data);
                setSearchResponse(Response.success);
                setSearchResult(data);
                setSearchPagination(pagination);
                return;
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                alert('검색 결과가 존재하지 않습니다.');
                setSearchResponse(Response.zero_result);
                setSearchResult([]);
                return;
            } else if (status === kakao.maps.services.Status.ERROR) {
                alert('검색 결과 중 오류가 발생했습니다.');
                setSearchResponse(Response.error);
                setSearchResult([]);
                return;
            }
        }); 

    };

    return (
        <div className="MainPage">
            <div id="upper-container">
                NowSee
                <button id="mypage-button" onClick={onClickMyPageIcon}>
                    MyPage
                </button>
            </div>
            <div id="search-box-container">
                <input
                    id="search-box"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => onSubmitSearchBox(e)}
                />
                {searchResponse===Response.success &&
                searchResultBox()}
            </div>
            <Map radius={radius}/>
            <div id="lower-map-container">
                <p>Change Radius</p>
                <Box sx={{ width: 300 }} id="radius-slider">
                    <Slider
                        aria-label="Custom marks"
                        defaultValue={radius}
                        step={2.5}
                        getAriaValueText={
                            (value: number): string=>{return `${value}km`}
                        }
                        valueLabelDisplay="auto"
                        valueLabelFormat={
                            (value: number): string=>{return `${value/25+1}km`}
                        }
                        onChange={onChangeMapRadius}
                        marks={marks}
                    />
                </Box>
                <button id="findout-button" onClick={onClickFindOutButton}>
                    Find out
                </button>
            </div>
            <div id="bottom-container">
                <span>Current location: </span>
                <button id="report-button" onClick={onClickReportButton}>
                    Report
                </button>
            </div>
            {openReport? <DetailPage/>: null}
        </div>
    );
}

export default MainPage;
