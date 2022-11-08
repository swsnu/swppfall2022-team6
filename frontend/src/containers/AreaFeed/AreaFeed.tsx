import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SearchBar from "material-ui-search-bar";
import { styled } from "@material-ui/core/styles";
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import Switch from "react-switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Statistics from "../../components/Statistics/Statistics";
import PostList from "../../components/PostList/PostList";
import { ReportType } from "../../components/Statistics/Statistics";
import "./AreaFeed.scss";

export type HashtagType = {
    id: number;
    content: string;
};

type WeatherType = {
    id?: number;
    temp?: number;
    main?: string;
};

export type PostType = {
    id: number;
    user_name: string;
    content: string;
    image: string; // image url
    latitude: number;
    longitude: number;
    created_at: string;
    reply_to_author: string | null; // id of the chained post
    hashtags: Array<HashtagType>;
};

export const CustomSearchBar = styled(SearchBar)({
    backgroundColor: "#F5F5F5",
    borderRadius: "10px",
    fontFamily: '"NanumGothic", sans-serif',
    fontSize: "10px",
});

const CustomToggleButtonGroup = styled(ToggleButtonGroup)({
    display: "flex",
    gap: "10px",
    fontFamily: '"NanumGothic", sans-serif',
    fontSize: "10px",
    height: "25px",
    borderRadius: "0px",
});

function AreaFeed() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const navigate = useNavigate();
    const [allReports, setAllReports] = useState<ReportType[]>([]);
    const [allPosts, setAllPosts] = useState<PostType[]>([]);
    const [queryPosts, setQueryPosts] = useState<PostType[]>([]);
    const [refresh, setRefresh] = useState<Boolean>(true);
    const [top3Hashtag, setTop3Hashtag] = useState<string[]>([]);
    const [weather, setWeather] = useState<WeatherType>({});
    const [selectTag, setSelectTag] = useState<string|undefined>(undefined)
    const [onlyPhoto, setOnlyPhoto] = useState<boolean>(false)

    useEffect(() => {
        if (refresh) {
            // update PostList & Hashtags
            axios
                .get("/post/", {
                    params: { latitude: 37.0, longitude: 127.0, radius: 143 }, // modify to redux
                })
                .then((response) => {
                    setAllPosts(response.data["posts"]);
                    setQueryPosts(response.data["posts"]);
                    setTop3Hashtag(response.data["top3_hashtags"]);
                });
            // update WeatherAPI
            const lat = 37.0;
            const lon = 127.0;
            const api = {
                key: "c22114b304afd9d97329b0223da5bb01",
                base: "https://api.openweathermap.org/data/2.5/",
            };
            const url = `${api.base}weather?lat=${lat}&lon=${lon}&appid=${api.key}`;
            axios.get(url).then((response) => {
                const data = response.data;
                setWeather({
                    id: data.weather[0].id,
                    temp: Math.round(data.main.temp - 273.15),
                    main: data.weather[0].main,
                });
            });
            // update Statistics
            axios
                .get("/report/", {
                    params: { latitude: 37, longitude: 127, radius: 143 }, // modify to redux
                })
                .then((response) => {
                    setAllReports(response.data);
                    setRefresh(false);
                });
        }
    }, [refresh]);

    useEffect(()=>{
        if(selectTag){
            setQueryPosts(
                allPosts.filter(
                    (post: PostType) =>
                        post.hashtags &&
                        post.hashtags.map((h) => h.content).includes(selectTag)
                )
            );
        }
        else {
            setQueryPosts(allPosts);
        }
    }, [selectTag])

    const onClickBackButton = () => {
        navigate("/");
    };
    const onClickRefreshButton = () => {
        setRefresh(true);
    };
    const onSubmitSearchBox = () => {
        console.log("yes");
        setQueryPosts(
            allPosts.filter((post: PostType) =>
                post.content.includes(searchQuery)
            )
        );
    };
    const onClickClose = ()=>{
        setSearchQuery("");
    }
    const onClickHashtagButton = () => {
        //TODO: queryPosts? allPosts?
        if(selectTag){
            setQueryPosts(
                allPosts.filter(
                    (post: PostType) =>
                        post.hashtags &&
                        post.hashtags.map((h) => h.content).includes(selectTag)
                )
            );
        }
        else {
            setQueryPosts(allPosts);
        }
    };
    const onSelectOnlyPhotos = () => {
        if(onlyPhoto){
            setQueryPosts(allPosts);
            setOnlyPhoto(false)
        }
        else {
            setQueryPosts(queryPosts.filter((post: PostType) => post.image));
            setOnlyPhoto(true)
        }
    };
    const postListCallback = () => {
        setRefresh(true);
    }; // axios.get again

    const handleToggleTag = (e: React.MouseEvent<HTMLElement>, value: string)=>{
        if(value===selectTag) setSelectTag(undefined);
        else setSelectTag(value);
    }

    return (
        <Container className="AreaFeed">
            <Row id="areafeed-upper-container">
                <Col id="button-container">
                    <button id="back-button" onClick={onClickBackButton}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button id="refresh-button" onClick={onClickRefreshButton}>
                        <FontAwesomeIcon icon={faRotateLeft} />
                    </button>
                </Col>
                <Col id="weather-container">
                    {" "}
                    <div id="weather-temp">{weather.temp}&deg;C</div>
                    <div id="weather-status">{weather.main}</div>
                </Col>
            </Row>
            <Row>
                <Statistics allReports={allReports} />
            </Row>
            <Row id="recommended-hashtag-container">
                <Row className="area-label">Recommended Hashtags</Row>
                <Row id="hashtag-buttons" xs="auto">
                    {
                        <CustomToggleButtonGroup 
                            value={selectTag}
                            exclusive
                            onChange={handleToggleTag}
                            className="hashtag-buttons-group"
                        >
                        {top3Hashtag.map((item, i)=>{
                            return(
                                    <ToggleButton
                                        key={i}
                                        value={item}
                                        className="hashtag"
                                        // onClick={() => onClickHashtagButton()}
                                    >
                                        {"#" + item}
                                    </ToggleButton>
                            )
                        })}
                        </CustomToggleButtonGroup>
                    }
                    
                </Row>
            </Row>
            <Row id="search-box-container">
                <Row className="area-label">Posts</Row>
                <Row id="search-container">
                    <Col md={6}>
                        <CustomSearchBar
                            className="search-box"
                            value={searchQuery}
                            onChange={(searchVal) => setSearchQuery(searchVal)}
                            onCancelSearch={() => onClickClose()}
                            onRequestSearch={()=>onSubmitSearchBox()}
                            placeholder=""
                        />
                    </Col>
                    <Col md={3} id="only-photos-button-container">
                        <div
                            id="only-photos-button"
                        >
                            <Switch 
                                onChange={onSelectOnlyPhotos} 
                                checked={onlyPhoto}
                                onColor="#3185e7"
                                checkedIcon={false}
                                uncheckedIcon={false}
                                height={20}
                                width={40}
                                boxShadow="0 0 2px 2px #999"
                            /> 
                            <span> Only Photos</span>
                        </div>
                    </Col>
                </Row>
            </Row>
            <Row id="postlist-container">
                <PostList
                    type={"Post"}
                    postListCallback={postListCallback}
                    replyTo={0}
                    allPosts={queryPosts}
                />
            </Row>
            <NavigationBar />
        </Container>
    );
}

export default AreaFeed;
