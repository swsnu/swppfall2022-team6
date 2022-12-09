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

import PostList from "../../components/PostList/PostList";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import "./HashFeed.scss";

import { selectUser, UserType } from "../../store/slices/user";
import { CustomSearchBar } from "../AreaFeed/AreaFeed";

import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import { selectPosition } from "../../store/slices/position";
import Loading from "../../components/Loading/Loading";

const CustomToggleButtonGroup = styled(ToggleButtonGroup)({
    display: "flex",
    fontFamily: '"NanumGothic", sans-serif',
    fontSize: "10px",
    gap: "10px",
    height: "25px",
    borderRadius: "0px",
});

function HashFeed() {
    const { id } = useParams();
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

    const fetchData = async () => {
        setRefresh(false);
        const queryPostPromise = await dispatch(fetchHashPosts(Number(id)));
        if (queryPostPromise.payload === undefined) navigate("/");
        const postData = queryPostPromise.payload as PostType[];
        setQueryPosts(postData);
        //await dispatch(fetchHashfeedTop3Hashtags(Number(id)));
        setIsLoading(true);
    };

    useEffect(() => {
        // TODO: loading
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
        return (
            <Map
                id="map-hashfeed"
                center={positionState.position}
                style={{
                    width: "80%",
                    height: "30vh",
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
            <div>
                <Row id="search-box-container">
                    <Row className="hash-label">Posts</Row>
                    <Row id="search-container">
                        <Col md={6}>
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
                        </Col>
                        <Col md={3} id="only-photos-button-container">
                            <div id="only-photos-button">
                                <Switch
                                    onChange={onSelectOnlyPhotos}
                                    onColor="#3185e7"
                                    boxShadow="0 0 2px 2px #999"
                                    width={40}
                                    height={20}
                                    checked={onlyPhoto}
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                />
                                <span> Only Photos</span>
                            </div>
                        </Col>
                    </Row>
                </Row>
                <Row id="postlist-container">
                    <PostList
                        currPosition={positionState.position}
                        allPosts={queryPosts}
                        type={"Post"}
                        replyTo={0}
                        postListCallback={postListCallback}
                    />
                </Row>
                ;
            </div>
        );
    };

    return (
        <Container className="HashFeed">
            {isLoading ? (
                <div>
                    <Row id="hashfeed-upper-container">
                        <Col id="button-container">
                            <button
                                id="back-button"
                                onClick={onClickBackButton}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <button
                                id="refresh-button"
                                onClick={onClickRefreshButton}
                            >
                                <FontAwesomeIcon icon={faRotateLeft} />
                            </button>
                        </Col>
                        <Col
                            className="fw-bolder fs-5 mb-1"
                            style={{
                                justifyContent: "center",
                                paddingTop: "10px",
                            }}
                        >
                            #{hashtagState.top3[0].content}
                        </Col>
                        <Col></Col>
                    </Row>

                    <Row
                        id="cluster-map"
                        style={{
                            justifyContent: "center",
                            paddingTop: "1vh",
                        }}
                    >
                        {showClusterMap()}
                    </Row>
                    <Row id="recommended-hashtag-container">
                        <Row className="hash-label">Recommended Hashtags</Row>
                        <Row id="hashtag-buttons" xs="auto">
                            {
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
                                </CustomToggleButtonGroup>
                            }
                        </Row>
                    </Row>
                    <HashFeedPosts></HashFeedPosts>
                    <NavigationBar navReportCallback={navReportCallback} />
                </div>
            ) : (
                <Loading />
            )}
        </Container>
    );
}

export default HashFeed;
