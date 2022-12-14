import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { Layout } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import NavigationBar from "../../components/NavigationBar/NavigationBar";
import PostList from "../../components/PostList/PostList";
import Loading from "../../components/Loading/Loading";
import { PostType } from "../../store/slices/post";
import { selectUser } from "../../store/slices/user";
import { PositionType, selectPosition } from "../../store/slices/position";
import { selectApiError, setDefaultApiError } from "../../store/slices/apierror";
import { AppDispatch } from "../../store";

import "./PostDetail.scss";

const { Header, Content } = Layout;

function PostDetail() {
    const postListCallback = () => {
        setRefresh(true);
    }; // axios.get again
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const onClickBackButton = () => {
        navigate(-1);
    };

    const positionState = useSelector(selectPosition);
    const userState = useSelector(selectUser);
    const errorState = useSelector(selectApiError);
    let position: PositionType;
    const savedPosition = localStorage.getItem("position");
    if (savedPosition) {
        position = JSON.parse(savedPosition);
    } else {
        position = positionState.findPosition;
    }

    const [mainPost, setMainPost] = useState<PostType>({
        id: 1,
        user_name: "swpp",
        badge_id: 1,
        content: "Default Original Post...",
        latitude: 37.44877599087201,
        longitude: 126.95264777802309,
        location: "관악구 봉천동",
        created_at: new Date().toLocaleDateString(),
        image: "/media/2022/11/07/screenshot.png",
        reply_to_author: null,
        hashtags: [],
    });
    const [replyPosts, setReplyPosts] = useState<PostType[]>([]);
    const [refresh, setRefresh] = useState<Boolean>(true);
    const [isLoading, setIsLoading] = useState<Boolean>(true);

    useEffect(()=>{
        dispatch(setDefaultApiError())
    }, []);

    useEffect(() => {
        axios.get(`/post/${id}/`).then((response) => {
            setMainPost(response.data["post"]);
            setReplyPosts(response.data["replies"]);
            setIsLoading(false);
        }).catch(() => {navigate("/")});
        setRefresh(false);
    }, [refresh, id]);

    return (
        <Layout className="PostDetail">
            <Header
                id="header-container"
                className="Header"
                style={{ backgroundColor: "white" }}
            >
                <div id="button-container">
                    <ArrowLeftOutlined
                    id="back-button"
                    className="button"
                    onClick={onClickBackButton}
                    />
                </div>
            </Header>
            { isLoading
            ? <Loading />
            : <Content className="Content">
                <div id="main-post-container">
                    <div id="upper-post-container">
                        <div id="author-main-badge">
                            <img
                                alt=""
                                src={userState.userBadges.find((badge) => badge.id === mainPost.badge_id)?.image}
                            />
                        </div>
                        <div id="author-container">
                            <div id="author-info">
                                <div id="author-name">
                                    {mainPost.user_name}
                                </div>
                                <div id="time-and-location">
                                    <span id="author-location" > {mainPost.location? mainPost.location: "No location"} </span>
                                    <span style={{fontWeight: 900}}> · </span>
                                    <span
                                        id="timestamp"
                                        style={{ fontSize: "11px" }}>
                                        {new Date(mainPost.created_at).toLocaleDateString(
                                            "ko-KR",
                                            {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="main-post-content"
                        className="text-start">{mainPost.content}</div>
                    {mainPost.image === null ? null : (
                        <div id="main-post-image-div">
                            <img
                                id="main-post-image"
                                src={mainPost.image}
                                alt="sample"
                                style={{ height: "30vh", width: "auto" }} />
                        </div>
                    )}
                    <div id="lower-post-container">
                        <div id="hashtag-container">
                            {mainPost.hashtags.map((hashtag, i) => (
                                <div key={`hashtag${i}`} className="hashtag">
                                    {"#" + hashtag.content}
                                </div>
                            ))}
                        </div>
                    </div>
                </div><div id="reply-posts-container"
                    className="">
                        <div id=""
                            style={{
                                width: "100%",
                                textAlign: "start",
                                padding: "0 20px",
                            }}>
                            Replies
                        </div>
                        <PostList
                            type={"Reply"}
                            postListCallback={postListCallback}
                            replyTo={Number(id)}
                            allPosts={replyPosts} />
                    </div>
                </Content>
            }
            <div className="navbar-container">
                <NavigationBar
                    navReportCallback={() => {}}
                />
            </div>
        </Layout>
    );
}

export default PostDetail;