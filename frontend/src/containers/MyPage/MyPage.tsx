import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Checkbox, Layout } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons"

import { useDispatch, useSelector } from "react-redux";

import PostList from "../../components/PostList/PostList";
import { PostType } from "../../store/slices/post";
import { setLogout, updateUserMainBadge } from "../../store/slices/user";
import { selectApiError, setDefaultApiError } from "../../store/slices/apierror";
import {
  fetchUserPosts,
  updateUserBadges,
  selectUser,
  UserType,
} from "../../store/slices/user";
import { AppDispatch } from "../../store";

import "./MyPage.scss";

const { Header, Content } = Layout;

function MyPage() {
    const userState = useSelector(selectUser);
    const errorState = useSelector(selectApiError);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [onlyPhoto, setOnlyPhoto] = useState<boolean>(false);
    const [posts, setPosts] = useState<PostType[]>([]);

    const currUser = userState.currUser as UserType;

    useEffect(()=>{
        dispatch(setDefaultApiError())
    }, []);

    useEffect(()=>{
        if(currUser){
            dispatch(fetchUserPosts(currUser.id));
        }
    }, []);

    useEffect(()=>{
        setPosts(userState.userPosts);
    }, [userState.userPosts])

    useEffect(()=>{
        if(onlyPhoto){
            setPosts(posts.filter(post => post.image))
        } else {
            setPosts(userState.userPosts);
        }
    }, [onlyPhoto])

    const onClickBackButton = () => {
        navigate("/");
    };
    const onClickSeeBadgesButton = async() => {
        await dispatch(updateUserBadges(currUser.id));
        navigate("/mypage/badges")
    };
    const onClickLogOutButton = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        await dispatch(setLogout())
    };

    if (currUser === null) {
        return <Navigate to="/signin" />;
    }
    return (
        <Layout className="MyPage">
        <Header
            id="header-container"
            className="Header"
            style={{ backgroundColor: "white" }}
        >
            <div id="button-container">
                <ArrowLeftOutlined
                id="back-button"
                aria-label="back-button"
                className="button"
                onClick={onClickBackButton}
                />
            </div>
            <div id="mypage-title">My Page</div>
        </Header>
        <Content className="Content">
            <div id="profile-container">
                <div id="profile-sub-container">
                    <div id="main-badge-container">
                        <img
                        alt=""
                        src={userState.mainBadge?.image}
                        style={{ height: "14vh", width: "13vh" }}
                        />
                    </div>
                    <div id="profile-col">
                        <div id="user-name">{currUser.username}</div>
                        <div id="profile-butons">
                        <button id="see-badges-button" onClick={onClickSeeBadgesButton}>
                            See Badges
                        </button>
                        <button id="logout-button" onClick={onClickLogOutButton}>
                            Log Out
                        </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="posts-header-container">
            <div className="area-label title">
                <span>My Posts</span>
            </div>
            <div id="only-photos-button">
                <div>
                <Checkbox
                    className="checkbox"
                    checked={onlyPhoto}
                    onChange={() => {
                    setOnlyPhoto(!onlyPhoto);
                    }}
                />
                <span> Only Photos</span>
                </div>
            </div>
            </div>
            <div id="postlist-container">
                <PostList
                    type={"Mypage"}
                    postListCallback={() => {}}
                    replyTo={0}
                    allPosts={posts}
                />
            </div>
        </Content>
        </Layout>
    );
}

export default MyPage;
