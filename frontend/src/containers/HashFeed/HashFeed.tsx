import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { AppDispatch } from "../../store";
import {
    //fetchHashfeedTop3Hashtags,
    selectHashtag,
} from "../../store/slices/hashtag";
import { fetchHashPosts, PostType, selectPost } from "../../store/slices/post";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Switch from "react-switch";
import { faRotateLeft, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@material-ui/core/styles";
import { Checkbox, Layout } from "antd";
import { ArrowLeftOutlined, SyncOutlined } from "@ant-design/icons"

import PostList from "../../components/PostList/PostList";
import NavigationBar from "../../components/NavigationBar/NavigationBar";

import { selectUser, UserType } from "../../store/slices/user";
import { CustomSearchBar } from "../AreaFeed/AreaFeed";

import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import { selectPosition } from "../../store/slices/position";

import "./HashFeed.scss";

const { Header, Content } = Layout;

const CustomToggleButtonGroup = styled(ToggleButtonGroup)({
    display: "flex",
    fontFamily: '"NanumGothic", sans-serif',
    fontSize: "10px",
    gap: "10px",
    height: "25px",
    borderRadius: "0px",
});

function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
}


function HashFeed() {
    const { id } = useParams();
    const userState = useSelector(selectUser);
    const hashtagState = useSelector(selectHashtag);
    const postState = useSelector(selectPost);
    const positionState = useSelector(selectPosition);

    const [onlyPhoto, setOnlyPhoto] = useState<boolean>(false);
    const [selectTag, setSelectTag] = useState<string | undefined>(undefined);
    const [refresh, setRefresh] = useState<Boolean>(true);
    const [queryPosts, setQueryPosts] = useState<PostType[]>(postState.posts);
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [windowSize, setWindowSize] = useState(getWindowSize());

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);


    const fetchData = async () => {
        // const user = userState.currUser as UserType;
        setRefresh(false);

        const queryPostPromise = await dispatch(fetchHashPosts(Number(id)));
        if (queryPostPromise.payload === undefined) navigate("/");
        const postData = queryPostPromise.payload as PostType[];
        setQueryPosts(postData);
        //await dispatch(fetchHashfeedTop3Hashtags(Number(id)));
        setIsLoading(true);
    };

    useEffect(() => {
        if (refresh) {
            fetchData();
        }
    }, [refresh]);

    useEffect(() => {
        let resultPosts = postState.posts;
        if (selectTag) {
            resultPosts = resultPosts.filter(
                (post: PostType) =>
                    post.hashtags &&
                    post.hashtags.map((h) => h.content).includes(selectTag)
            );
        }
        if (onlyPhoto) {
            resultPosts = resultPosts.filter((post: PostType) => post.image);
        }
        setQueryPosts(resultPosts);
    }, [selectTag, onlyPhoto]);

    const onSelectOnlyPhotos = () => {
        setOnlyPhoto(!onlyPhoto);
    };
    const onClickRefreshButton = () => {
        setRefresh(true);
    };
    const postListCallback = () => {
        setRefresh(true);
    }; // axios.get again
    const navReportCallback = () => {
        setRefresh(true);
    };
    const handleToggleTag = (
        e: React.MouseEvent<HTMLElement>,
        value: string
    ) => {
        if (value === selectTag) setSelectTag(undefined);
        else setSelectTag(value);
    };
    const onClickBackButton = () => {
        navigate("/areafeed");
    };

    const showClusterMap = () => {
        const mapHeight = windowSize.innerWidth>1000? "80vh": "30vh";
        return (
            <Map
                id="map-hashfeed"
                center={positionState.position}
                style={{
                    width: "100%",
                    height: mapHeight,
                    borderRadius: "12px",
                }}
                level={8}
                minLevel={5}
            >
                <MarkerClusterer averageCenter={true}>
                    {postState.posts.map((post) => (
                        <MapMarker
                            key={post.id}
                            position={{
                                lat: post.latitude,
                                lng: post.longitude,
                            }}
                        />
                    ))}
                </MarkerClusterer>
            </Map>
        );
    };

    const HashFeedPosts = () => {
        const [searchQuery, setSearchQuery] = useState<string>("");
        const onSubmitSearchBox = () => {
            setQueryPosts(
                postState.posts.filter((post: PostType) =>
                    post.content.includes(searchQuery)
                )
            );
        };
        const onClickClose = () => {
            setSearchQuery("");
        };
        return (
            <div className="hashfeed-posts-container">
                <h2 className="hash-label post-title title" >Posts</h2>
                <div id="search-box-container" style={{display: "flex"}}>
                    <div>
                        <CustomSearchBar
                            className="search-box"
                            placeholder=""
                            value={searchQuery}
                            onRequestSearch={() => onSubmitSearchBox()}
                            onCancelSearch={() => onClickClose()}
                            onChange={(searchVal) =>
                                setSearchQuery(searchVal)
                            }
                        />
                    </div>
                    <div id="only-photos-button">
                        <Checkbox className="checkbox" checked={onlyPhoto} onChange={onSelectOnlyPhotos}/>
                        <span> Only Photos</span>
                    </div>
                </div>
                <div id="postlist-container">
                    <PostList
                        currPosition={positionState.position}
                        allPosts={queryPosts}
                        type={"Post"}
                        replyTo={0}
                        postListCallback={postListCallback}
                    />
                </div>
                ;
            </div>
        );
    };

    return (
        <Layout className="HashFeed">
            <Header id="hashfeed-upper-container"  className="Header"  style={{backgroundColor: "white"}}>
                <div id="button-container">
                    <ArrowLeftOutlined id="back-button" className="button" onClick={onClickBackButton}/>
                    <SyncOutlined id="refresh-button" className="button" onClick={onClickRefreshButton}/>
                </div>
                <div className="title hashfeed-title">
                    #{hashtagState.top3[0].content}
                </div>
            </Header>
            {isLoading ? (
                <Content className="Content" style={{backgroundColor: "white"}}>
                    <div id="cluster-map">
                        {showClusterMap()}
                    </div>
                    <div id="recommended-hashtag-container">
                        <div className="hash-label title hashtag-title">Recommended Hashtags</div>
                        <div id="hashtag-buttons">
                            {hashtagState.top3.slice(1).length > 0?
                                <CustomToggleButtonGroup
                                    className="hashtag-buttons-group"
                                    onChange={handleToggleTag}
                                    exclusive
                                    value={selectTag}
                                >
                                    {hashtagState.top3
                                        .slice(1)
                                        .map((item, i) => {
                                            return (
                                                <ToggleButton
                                                    className="hashtag"
                                                    key={i}
                                                    style={{
                                                        textTransform: "none",
                                                    }}
                                                    value={item.content}
                                                >
                                                    {"#" + item.content}
                                                </ToggleButton>
                                            );
                                        })}
                                </CustomToggleButtonGroup>:
                                <div className="no-hashtag">
                                    <span>😵</span><br/>
                                    No recommended hashtag!
                                </div>
                            }
                        </div>
                        <HashFeedPosts></HashFeedPosts>
                    </div>
                </Content>

) : (
    <div style={{ fontSize: "20px", marginTop: "20px" }}>
                    Loading
                </div>
            )}
            <NavigationBar navReportCallback={navReportCallback} />
        </Layout>
    );
}

export default HashFeed;
