import React, { useEffect, useState } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Input, Pagination } from "antd";
import { SearchOutlined } from '@ant-design/icons';

import { PositionType } from "../../store/slices/position";

import "./MapSearch.scss"

type IProps = {
    markerPosition: PositionType;
    setMarkerPosition: React.Dispatch<React.SetStateAction<PositionType>>;
    showResults: boolean;
    setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
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
};

const N_ITEM_PAGE = 15;

const MapSearch = (props: IProps) => {
    const { markerPosition, setMarkerPosition, showResults, setShowResults, setIsOpen } = props;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResponse, setSearchResponse] = useState<string>(
        Response.zero_result
    )
    const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
    const [searchPagination, setSearchPagination] = useState<
        kakao.maps.Pagination | undefined
    >(undefined);
    const [activePage, setActivePage] = useState<number>(1);

    useEffect(() => {
        setSearchResponse(Response.zero_result);
        setSearchResult([]);
        setShowResults(false);
    }, [searchQuery])
    

    const onSubmitSearchBox = () => {
        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(
            searchQuery,
            (data, status, pagination) => {
                if (status === kakao.maps.services.Status.OK) {
                    console.log("?????? ???");
                    setSearchResponse(Response.success);
                    setSearchResult(data);
                    setSearchPagination(pagination);
                    setShowResults(true);
                    setIsOpen(false);
                    return;
                } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                    console.log("?????? ????????? ???????????? ????????????")
                    alert("?????? ????????? ???????????? ????????????.");
                    setSearchResponse(Response.zero_result);
                    setSearchResult([]);
                    setShowResults(false);
                    return;
                } else if (status === kakao.maps.services.Status.ERROR) {
                    alert("?????? ?????? ??? ????????? ??????????????????.");
                    setSearchResponse(Response.error);
                    setSearchResult([]);
                    setShowResults(false);
                    return;
                }
            },
            {
                x: markerPosition["lng"],
                y: markerPosition["lat"],
            }
        );
    };

    const SearchResultBox = () => {
        const pagination = searchPagination as kakao.maps.Pagination;
        const pageCount = pagination.totalCount / N_ITEM_PAGE >= 1?
                          pagination.totalCount / N_ITEM_PAGE: 1;
        return (
            <div className="search-result-box" aria-label="Search Results"
                style={{
                    width: "80vw",
                    left: "7vw",
                }}>
                <ListGroup
                    className="search-result-list"
                    aria-label="Search Result List Item"
                >
                    {searchResult.map((value, idx) => {
                        return (
                            <ListGroup.Item 
                                key={idx+1} 
                                className="search-result"
                                onClick={() => {
                                    setMarkerPosition({
                                        lat: +value.y,
                                        lng: +value.x,
                                    });
                                    setShowResults(false);
                                }}
                            >
                                {value.place_name}
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
                <Pagination
                    current={activePage}
                    total={pageCount*10} 
                    onChange={(page)=>{
                        setActivePage(page);
                        pagination.gotoPage(page);
                    }}
                    style={{
                        padding: "5px",
                    }}
                />
            </div>
        );
    };
    return (
        <Container id="search-box-container">
            <Row id="search-input-container">
                <Input.Search
                    className="mapsearch-searchbar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onSearch={()=>onSubmitSearchBox()}
                    placeholder="Search (e.g. ???????????????, ????????? 1)"
                    size="large"
                    enterButton={<SearchOutlined style={{fontSize: "20px"}}/>}
                    allowClear //?????? ????????? ??????,,, - ??????????????? ???????????? ???????????? ???
                />
            </Row>
            <Row>
                {(searchQuery && showResults && searchResponse === Response.success)? <SearchResultBox />: null}
            </Row>
      </Container>
    );
}

export default MapSearch;
