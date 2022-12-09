import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { fetchPosts, PostType, selectPost } from "../../store/slices/post";
import {selectHashtag } from "../../store/slices/hashtag";
import { fetchReports, selectReport } from "../../store/slices/report";
import { AppDispatch } from "../../store";

import axios from "axios";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SearchBar from "material-ui-search-bar";
import { styled } from "@material-ui/core/styles";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Switch from "react-switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Statistics from "../../components/Statistics/Statistics";
import PostList from "../../components/PostList/PostList";
import Loading from "../../components/Loading/Loading";

import "./AreaFeed.scss";
import { PositionType, selectPosition } from "../../store/slices/position";
import { selectUser, UserType } from "../../store/slices/user";
import { unwrapResult } from "@reduxjs/toolkit";
import { Address } from "../../components/SkimStatistics/SkimStatistics";

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
    const reportState = useSelector(selectReport);

    const [queryPosts, setQueryPosts] = useState<PostType[]>(postState.posts);
    const [refresh, setRefresh] = useState<Boolean>(true);
    const [weather, setWeather] = useState<WeatherType>({});
    const [selectTag, setSelectTag] = useState<number>(0);
    const [onlyPhoto, setOnlyPhoto] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const [queryHash, setQueryHash] = useState<string>("");

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const user = userState.currUser as UserType;
    let position: PositionType;
    const savedPosition = localStorage.getItem("position");
    if (savedPosition) {
        position = JSON.parse(savedPosition);
    } else {
        position = positionState.position;
    }

    // let statisticsJSX = JSX.Element;
    // useEffect(() => {
    //     statisticsJSX = <Statistics />;
    // }, [reportState.reports, user]);
    // const statisticsJSX = useCallback(() => {
    //     return <Statistics />;
    // }, [user, reportState.reports]);
    const statisticsJSX = useMemo(() => {
        return <Statistics />;
    }, [reportState.reports, user]);

    const renderWeatherAPI = async () => {
        const { lat, lng } = position;
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
    };

    const refreshReports = async () => {
        await dispatch(
            fetchReports({
                ...position,
                radius: user.radius,
            })
        );
    };

    const refreshPosts = async () => {
        const queryPostPromise = dispatch(
            fetchPosts({
                ...position,
                radius: user.radius,
            })
        );
        const postData = (await queryPostPromise).payload as PostType[];
        setQueryPosts(postData);
    };

    // const refreshHashtag = async () => {
    //     await dispatch(
    //         fetchTop3Hashtags({
    //             ...position,
    //             radius: user.radius,
    //         })
    //     );
    //     setQueryHash("");
    // };

    const fetchData = async () => {
        console.time("reports");
        await refreshReports();
        console.timeEnd("reports");
        console.time("posts");
        await refreshPosts();
        console.timeEnd("posts");
        // console.time("hashtags");
        // await refreshHashtag();
        // console.timeEnd("hashtags");
        setRefresh(false);
        setIsLoading(true);
    };

    useEffect(() => {
        renderWeatherAPI();
    }, []);

    useEffect(() => {
        if (refresh) {
            fetchData();
        }
    }, [refresh]);

    useEffect(() => {
        let resultPosts = postState.posts;
        if (onlyPhoto) {
            resultPosts = resultPosts.filter((post: PostType) => post.image);
        }
        // if (selectTag) {
        //     resultPosts = resultPosts.filter(
        //         (post: PostType) =>
        //             post.hashtags &&
        //             post.hashtags.map((h) => h.content).includes(selectTag)
        //     );
        // }
        setQueryPosts(resultPosts);
    }, [selectTag, onlyPhoto]);

    const onClickBackButton = () => {
        navigate("/");
    };
    const onClickRefreshButton = () => {
        setRefresh(true);
    };
    const onSelectOnlyPhotos = () => {
        setOnlyPhoto(!onlyPhoto);
    };
    const postListCallback = async () => {
        //setRefresh(true);
        console.time("Addpost");
        await refreshPosts();
        console.timeEnd("Addpost");
    }; // axios.get again

    // TODO: reportModalCallback for refreshing statistics
    const navReportCallback = () => {
        setRefresh(true);
    };

    const handleToggleTag = (
        e: React.MouseEvent<HTMLElement>,
        value: number
    ) => {
        // if (value === selectTag) setSelectTag(undefined);
        // else setSelectTag(value);
        setSelectTag(value);
        navigate(`/hashfeed/${value}`);
    };
    const AreaFeedPosts = () => {
        const [searchQuery, setSearchQuery] = useState<string>("");
        const onSubmitSearchBox = () => {
            setQueryPosts(
                postState.posts.filter((post: PostType) =>
                    post.content.includes(searchQuery)
                )
            );
            setQueryHash(searchQuery);
        };
        const onClickClose = () => {
            setSearchQuery("");
            setQueryHash("");
        };
        const onQueryHashClick = async () => {
            await axios
                .get("/hashtag/", {
                    params: { content: queryHash },
                })
                .then((response) => {
                    if (response.data) {
                        navigate(`/hashfeed/${response.data}`);
                    } else {
                        alert("Hashtag doesn't exist");
                    }
                });
        };
        return (
            <div>
                <Row id="search-box-container">
                    <Row className="area-label">Posts</Row>
                    <Row id="search-container">
                        <Col md={6}>
                            <CustomSearchBar
                                className="search-box"
                                value={searchQuery}
                                onChange={(searchVal) =>
                                    setSearchQuery(searchVal)
                                }
                                onCancelSearch={() => onClickClose()}
                                onRequestSearch={() => onSubmitSearchBox()}
                                placeholder=""
                            />
                        </Col>
                        <Col md={3} id="only-photos-button-container">
                            <div id="only-photos-button">
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
                    {queryHash ? (
                        <Row
                            className="area-label"
                            onClick={onQueryHashClick}
                            data-testid="queryHash"
                        >
                            Go to #{queryHash}
                        </Row>
                    ) : null}
                </Row>
                <Row id="postlist-container">
                    <PostList
                        currPosition={position}
                        type={"Post"}
                        postListCallback={postListCallback}
                        replyTo={0}
                        allPosts={queryPosts}
                    />
                </Row>
            </div>
        );
    };

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
                        <img
                            src={`http://openweathermap.org/img/w/${weather.icon}.png`}
                            className="weather-icon"
                        />
                    </Row>
                    <Row id="lower-weather-container">
                        <div id="weather-temp">{weather.temp}&deg;C</div>
                        <div id="weather-status">{weather.main}</div>
                    </Row>
                    <Address position={positionState.position} />
                </Col>
            </Row>
            {isLoading ? (
                <div>
                    <Row>{statisticsJSX}</Row>
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
                                    {hashtagState.top3.map((item, i) => {
                                        return (
                                            <ToggleButton
                                                key={i}
                                                value={item.id}
                                                className="hashtag"
                                                style={{
                                                    textTransform: "none",
                                                }}
                                            >
                                                {"#" + item.content}
                                            </ToggleButton>
                                        );
                                    })}
                                </CustomToggleButtonGroup>
                            }
                        </Row>
                    </Row>
                    <AreaFeedPosts></AreaFeedPosts>
                    <NavigationBar navReportCallback={navReportCallback} />
                </div>
            ) : (
                <Loading />
            )}
        </Container>
    );
}

export default AreaFeed;
