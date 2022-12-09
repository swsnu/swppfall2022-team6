import { useEffect, useMemo, useState } from "react";
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
import { Layout, Checkbox, Space, Button } from "antd";
import { ArrowLeftOutlined, SyncOutlined } from "@ant-design/icons"

import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Statistics from "../../components/Statistics/Statistics";
import PostList from "../../components/PostList/PostList";

import { PositionType, selectPosition } from "../../store/slices/position";
import { selectUser, UserType } from "../../store/slices/user";
import { Address } from "../../components/SkimStatistics/SkimStatistics";

import "./AreaFeed.scss";

const { Header, Content } = Layout;

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
                <div id="search-box-container">
                    <h2 className="title post-title">Today's NowSee posts</h2>
                    <div id="search-container">
                        <div >
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
                        </div>
                        <div id="only-photos-button-container">
                            <div id="only-photos-button">
                                <Checkbox checked={onlyPhoto} onChange={onSelectOnlyPhotos}/>
                                <span> Only Photos</span>
                            </div>
                        </div>
                    </div>
                    {queryHash ? (
                        <div
                            className="go-to-hash"
                            onClick={onQueryHashClick}
                            data-testid="queryHash"
                        >
                            <span>Go to </span><span className="button">#{queryHash}</span>
                        </div>
                    ) : null}
                </div>
                <div id="postlist-container">
                    {queryPosts.length>0?
                    <PostList
                        currPosition={position}
                        type={"Post"}
                        postListCallback={postListCallback}
                        replyTo={0}
                        allPosts={queryPosts}
                    />:
                    <div className="no-post">
                        <span>😥</span><br/>
                        No Post<br/>for this location yet!
                    </div>
                    }
                </div>
            </div>
        );
    };

    return (
        <Layout className="AreaFeed">
            <Header id="areafeed-upper-container" className="Header"  style={{backgroundColor: "white"}}>
                <div id="button-container">
                    <ArrowLeftOutlined id="back-button" className="button" onClick={onClickBackButton}/>
                    <SyncOutlined id="refresh-button" className="button" onClick={onClickRefreshButton}/>
                </div>
                <Col id="weather-container">
                    {" "}
                    <Row id="upper-weather-container">
                        <div id="weather-temp-status">
                            <span id="weather-temp">{weather.temp}&deg;C,</span>
                            <span id="weather-status">{weather.main}</span>
                        </div>
                        <img
                            src={`http://openweathermap.org/img/w/${weather.icon}.png`}
                            className="weather-icon"
                        />
                        {/* <div id="weather-status">{weather.main}</div> */}
                    </Row>
                    <div id="lower-weather-container">
                        <img src="/location-svgrepo-com.svg" />
                        <Address position={positionState.position} />
                    </div>
                </Col>
            </Header>
            <Content className="Content" style={{backgroundColor: "white"}}>

                {isLoading ? (
                    <Container className="Container">
                        <div className="areafeed-statistics-container">
                            <h2 className="title">
                                Today's weather is likely... 
                            </h2>
                            <div>{statisticsJSX}</div>
                            <div id="recommended-hashtag-container">
                                <h2 className="title hashfeed-title">Go to HashFeed</h2>
                                <div id="hashtag-buttons">
                                    {hashtagState.top3.length>0? <Space >
                                        {hashtagState.top3.map((item, i) => {
                                            return (
                                                <Button
                                                    key={i}
                                                    className="hashtag"
                                                    onClick={()=>{navigate(`/hashfeed/${item.id}/`)}}
                                                >
                                                    {"#" + item.content}
                                                </Button>
                                            );
                                        })}
                                    </Space>:
                                    <div className="no-hashtag">
                                        No recommended hashtag!
                                    </div>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <AreaFeedPosts></AreaFeedPosts>
                        </div>
                    </Container>
                ) : (
                    <div style={{ fontSize: "20px", marginTop: "20px" }}>
                        Loading
                    </div>
                )}
            </Content>
            <NavigationBar navReportCallback={navReportCallback} />
        </Layout>
    );
}

export default AreaFeed;
