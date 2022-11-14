import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { fetchPosts, PostType, selectPost } from "../../store/slices/post";
import { fetchTop3Hashtags, selectHashtag } from "../../store/slices/hashtag";
import { fetchReports } from "../../store/slices/report";
import { AppDispatch } from "../../store";

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

import "./AreaFeed.scss";
import { PositionType, selectPosition } from "../../store/slices/position";
import { selectUser, UserType } from "../../store/slices/user";
import { unwrapResult } from "@reduxjs/toolkit";


type WeatherType = {
    icon?: string;
    temp?: number;
    main?: string;
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
    const postState = useSelector(selectPost);
    const hashtagState = useSelector(selectHashtag);
    const positionState = useSelector(selectPosition);
    const userState = useSelector(selectUser);

    const [queryPosts, setQueryPosts] = useState<PostType[]>(postState.posts);
    const [refresh, setRefresh] = useState<Boolean>(true);
    const [weather, setWeather] = useState<WeatherType>({});
    const [selectTag, setSelectTag] = useState<string|undefined>(undefined);
    const [onlyPhoto, setOnlyPhoto] = useState<boolean>(false);
    
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const fetchData = async () => {
        const user = userState.currUser as UserType;
        let position: PositionType;
        const savedPosition = localStorage.getItem("position")
        if(savedPosition){
            position = JSON.parse(savedPosition);
        } else {
            position = positionState.position;
        }
        const {lat, lng} = position;
        const api = {
            key: "c22114b304afd9d97329b0223da5bb01",
            base: "https://api.openweathermap.org/data/2.5/",
        };
        const url = `${api.base}weather?lat=${lat}&lon=${lng}&appid=${api.key}`;
        await axios.get(url).then((response) => {
            const data = response.data;
            setWeather({
                icon: data.weather[0].icon,
                temp: Math.round(data.main.temp - 273.15),
                main: data.weather[0].main,
            });
        });
        setRefresh(false);

        const queryPostPromise = dispatch(fetchPosts({
            ...position, radius: user.radius 
        }))
        const postData = (await queryPostPromise).payload as PostType[];
        setQueryPosts(postData);
        await dispatch(fetchTop3Hashtags({
            ...position, radius: user.radius 
        }));
        await dispatch(fetchReports({
            ...position, radius: user.radius 
        }));
    }

    useEffect(() => {   
        if (refresh) {
            fetchData();
        }
    }, [refresh]);

    useEffect(()=>{
        let resultPosts = postState.posts;
        if(onlyPhoto){
            resultPosts = resultPosts.filter((post: PostType) => post.image);
        }
        if(selectTag){
            resultPosts = resultPosts.filter(
                    (post: PostType) =>
                        post.hashtags &&
                        post.hashtags.map((h) => h.content).includes(selectTag)
            );
        }
        setQueryPosts(resultPosts);
    }, [selectTag, onlyPhoto])

    const onClickBackButton = () => {
        navigate("/");
    };
    const onClickRefreshButton = () => {
        setRefresh(true);
    };
    const onSelectOnlyPhotos = () => {
        setOnlyPhoto(!onlyPhoto)
    };
    const postListCallback = () => {
        setRefresh(true);
    }; // axios.get again

    const handleToggleTag = (e: React.MouseEvent<HTMLElement>, value: string)=>{
        if(value===selectTag) setSelectTag(undefined);
        else setSelectTag(value);
    }
    const AreaFeedPosts = () => {
        const [searchQuery, setSearchQuery] = useState<string>("");
        const onSubmitSearchBox = () => {
            setQueryPosts(
                postState.posts.filter((post: PostType) =>
                    post.content.includes(searchQuery)
                )
            );
        };   
        const onClickClose = ()=>{
            setSearchQuery("");
        }
        return(
        <div>
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
            </Row>;
        </div>
        )
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
                    <Row id="upper-weather-container">
                        <img src={`http://openweathermap.org/img/w/${weather.icon}.png`} className="weather-icon" />
                    </Row>
                    <Row id="lower-weather-container">
                        <div id="weather-temp">{weather.temp}&deg;C</div>
                        <div id="weather-status">{weather.main}</div>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Statistics />
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
                        {hashtagState.top3.map((item, i)=>{
                            return(
                                    <ToggleButton
                                        key={i}
                                        value={item}
                                        className="hashtag"
                                        style={{textTransform: 'none'}}
                                    >
                                        {"#" + item}
                                    </ToggleButton>
                            )
                        })}
                        </CustomToggleButtonGroup>
                    }

                </Row>
            </Row>
            <AreaFeedPosts></AreaFeedPosts>
            <NavigationBar />
        </Container>
    );
}

export default AreaFeed;
