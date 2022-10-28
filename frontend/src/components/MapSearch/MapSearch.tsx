import React, { useState } from "react";
import { PositionType } from "../Map/Map";

type IProps = {
  markPosition: PositionType;
  setMarkPosition: React.Dispatch<React.SetStateAction<PositionType>>
}
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

const range = (start: number, count: number)=>{
  let array = [];
  while (count--) {
      array.push(start++);
  }
  return array;
}

const MapSearch = (props: IProps)=>{
  const {markPosition, setMarkPosition} = props
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResponse, setSearchResponse] = useState<string>(
      Response.zero_result
  );
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [searchPagination, setSearchPagination] = useState<
      kakao.maps.Pagination | undefined
  >(undefined);


  const onSubmitSearchBox = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key !=="Enter") return;
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(
        searchQuery,
        (data: SearchResult[], status, pagination) => {
            if (status === kakao.maps.services.Status.OK) {
                console.log(data);
                setSearchResponse(Response.success);
                setSearchResult(data);
                setSearchPagination(pagination);
                return;
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                alert("검색 결과가 존재하지 않습니다.");
                setSearchResponse(Response.zero_result);
                setSearchResult([]);
                return;
            } else if (status === kakao.maps.services.Status.ERROR) {
                alert("검색 결과 중 오류가 발생했습니다.");
                setSearchResponse(Response.error);
                setSearchResult([]);
                return;
            }
        },
        {
          x: markPosition["lng"],
          y: markPosition["lat"],
        }
    );

  }
  const searchResultBox = () => {
      const pagination = searchPagination as kakao.maps.Pagination;
      const idxArray: number[] = range(
          1,
          pagination.totalCount / N_ITEM_PAGE
      );
      return (
          <div className="search-result-box">
              <ul className="search-result-list">
                  {searchResult.map((value, idx) => {
                      return (
                          <li 
                              key={idx} 
                              className="search-result"
                              onClick={()=>{setMarkPosition({lat: +value.y, lng: +value.x})}}>
                              {value.place_name}
                          </li>
                      );
                  })}
              </ul>
              <div className="search-result-pagination">
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
  return (
    <div id="search-box-container">
        <input
            id="search-box"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e)=>{onSubmitSearchBox(e)}}
        />
        {searchResponse === Response.success && searchResultBox()}
      </div>
  );
};


export default MapSearch;