import React, { useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "material-ui-search-bar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { PositionType } from "../Map/Map";

import "./MapSearch.scss";

// import SearchIcon from "../../assets/search-svgrepo-com.svg";

type IProps = {
    markPosition: PositionType;
    setMarkPosition: React.Dispatch<React.SetStateAction<PositionType>>;
    showResults: boolean;
    setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
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

const range = (start: number, count: number) => {
    let array = [];
    while (count--) {
        array.push(start++);
    }
    return array;
};

const MapSearch = (props: IProps) => {
    const { markPosition, setMarkPosition, showResults, setShowResults } = props;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResponse, setSearchResponse] = useState<string>(
        Response.zero_result
    )
    const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
    const [searchPagination, setSearchPagination] = useState<
        kakao.maps.Pagination | undefined
    >(undefined);

    const onSubmitSearchBox = () => {
        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(
            searchQuery,
            (data, status, pagination) => {
                if (status === kakao.maps.services.Status.OK) {
                    // console.log(data);
                    setSearchResponse(Response.success);
                    setSearchResult(data);
                    setSearchPagination(pagination);
                    setShowResults(true);
                    return;
                } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                    alert("검색 결과가 존재하지 않습니다.");
                    setSearchResponse(Response.zero_result);
                    setSearchResult([]);
                    setShowResults(false);
                    return;
                } else if (status === kakao.maps.services.Status.ERROR) {
                    alert("검색 결과 중 오류가 발생했습니다.");
                    setSearchResponse(Response.error);
                    setSearchResult([]);
                    setShowResults(false);
                    return;
                }
            },
            {
                x: markPosition["lng"],
                y: markPosition["lat"],
            }
        );
    };

    const searchResultBox = () => {
        const pagination = searchPagination as kakao.maps.Pagination;
        const idxArray: number[] = range(
            1,
            pagination.totalCount / N_ITEM_PAGE
        );
        return (
            <div className="search-result-box" aria-label="Search Results">
                <ul
                    className="search-result-list"
                    aria-label="Search Result List Item"
                >
                    {searchResult.map((value, idx) => {
                        return (
                            <li
                                key={idx+1}
                                className="search-result"
                                onClick={() => {
                                    setMarkPosition({
                                        lat: +value.y,
                                        lng: +value.x,
                                    });
                                    onClickCloseBox();
                                }}
                            >
                                {value.place_name}
                            </li>
                        );
                    })}
                </ul>
                <div
                    className="search-result-pagination"
                    aria-label="Search Result Pagination"
                >
                    <a
                        href="#"
                        onClick={() => {
                            pagination.gotoFirst();
                        }}
                    >
                        {"< "}
                    </a>
                    {idxArray.map((idx) => {
                        return (
                            <a
                                href="#"
                                key={idx}
                                className={idx === 1 ? "on idx" : "idx"}
                                onClick={() => {
                                    pagination.gotoPage(idx);
                                }}
                            >{`${idx} `}</a>
                        );
                    })}
                    <a
                        href="#"
                        onClick={() => {
                            pagination.gotoLast();
                        }}
                    >
                        {">"}
                    </a>
                </div>
            </div>
        );
    };
    const onClickClose = () => {
        setSearchResponse(Response.zero_result);
        setSearchResult([]);
        setSearchQuery("");
        setSearchPagination(undefined);
        setShowResults(false);
    };
    const onClickCloseBox = () => {
        setSearchResponse(Response.zero_result);
        setSearchResult([]);
        setSearchPagination(undefined);
        setShowResults(false);
    };
    return (
        <Container id="search-box-container">
        <Row id="search-input-container">
            {/* <GlobalStyles styles={{
                ".mapsearch-searchbar": {
                    "width": 500px;
                    "height": "20px";
                    background-color: #F5F5F5;
                    border-radius: "12px";
                }
            }}/> */}
            <CssBaseline />
            <SearchBar
                className="mapsearch-searchbar"
                value={searchQuery}
                onChange={(searchVal) => setSearchQuery(searchVal)}
                onCancelSearch={() => onClickClose()}
                onRequestSearch={()=>onSubmitSearchBox()}
            />
        </Row>
        <Row>
            {searchResponse === Response.success && searchResultBox()}
        </Row>
      </Container>
    );
}

export default MapSearch;
