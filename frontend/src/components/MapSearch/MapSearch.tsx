import React, { useState } from "react";

import SearchBar from "material-ui-search-bar";
import ListGroup from 'react-bootstrap/ListGroup';
import Pagination from 'react-bootstrap/Pagination';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { styled } from "@material-ui/core/styles";

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

const range = (start: number, count: number) => {
    let array = [];
    while (count--) {
        array.push(start++);
    }
    return array;
};
export const CustomSearchBar = styled(SearchBar)({
    height: "38px",
    backgroundColor: "#F5F5F5",
    borderRadius: "12px",
    fontFamily: '"NanumGothic", sans-serif',
});

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

    const onSubmitSearchBox = () => {
        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(
            searchQuery,
            (data, status, pagination) => {
                if (status === kakao.maps.services.Status.OK) {
                    console.log("검색 중");
                    setSearchResponse(Response.success);
                    setSearchResult(data);
                    setSearchPagination(pagination);
                    setShowResults(true);
                    setIsOpen(false);
                    return;
                } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                    console.log("검색 결과가 존재하지 않습니다")
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
                x: markerPosition["lng"],
                y: markerPosition["lat"],
            }
        );
    };

    const SearchResultBox = () => {
        const pagination = searchPagination as kakao.maps.Pagination;
        const pageCount = pagination.totalCount / N_ITEM_PAGE >= 1?
                          pagination.totalCount / N_ITEM_PAGE: 1;
        const idxArray: number[] = range(
            1,
            pageCount
        );
        return (
            <div className="search-result-box" aria-label="Search Results">
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
                    className="search-result-pagination"
                    aria-label="Search Result Pagination"
                >
                    {idxArray.map((idx) => {
                        return (
                            <Pagination.Item
                                key={idx}
                                className={idx === 1 ? "on idx" : "idx"}
                                onClick={() => {
                                    pagination.gotoPage(idx);
                                    setActivePage(idx+1);
                                }}
                                active={idx+1===activePage}
                            >{`${idx}`}</Pagination.Item>
                        );
                    })}
                </Pagination>
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
    return (
        <Container id="search-box-container">
            <Row id="search-input-container">
                <CustomSearchBar
                    className="mapsearch-searchbar"
                    value={searchQuery}
                    onChange={(searchVal) => setSearchQuery(searchVal)}
                    onCancelSearch={() => onClickClose()}
                    onRequestSearch={()=>onSubmitSearchBox()}
                    placeholder="Search (e.g. 서울대학교, 관악로 1)"
                />
            </Row>
            <Row>
                {(showResults && searchResponse === Response.success)? <SearchResultBox />: null}
            </Row>
      </Container>
    );
}

export default MapSearch;
