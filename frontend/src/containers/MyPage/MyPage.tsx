import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Switch from "react-switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

import PostList from "../../components/PostList/PostList";
import { fetchPosts, PostType, selectPost } from "../../store/slices/post";
import { fetchUserPosts, selectUser, UserType } from "../../store/slices/user";
import { AppDispatch } from "../../store";

import "./MyPage.scss"

function MyPage() {
    const userState = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [onlyPhoto, setOnlyPhoto] = useState<boolean>(false);
    const [posts, setPosts] = useState<PostType[]>([]);

    const currUser = userState.currUser as UserType;
    useEffect(()=>{
        dispatch(fetchUserPosts(currUser.id))
        .then(unwrapResult)
        .then((result: PostType[])=>{
            setPosts(result);
        })
    }, [])

    useEffect(()=>{
        if(onlyPhoto){
            setPosts(posts.filter(post => post.image))
        } else {
            setPosts(userState.userPosts);
        }
    }, [onlyPhoto])

    const onClickBackButton = () => {
        navigate(-1);
    };
    const onClickSeeBadgesButton = () => {
        navigate("/mypage/badges")
    };
    const onClickLogOutButton = () => {};
    return (
        <Container id="MyPage">
            <Row id="header-container">
                <Col id="back-button-container" md={1}>
                    <button id="back-button" onClick={onClickBackButton}>
                        <FontAwesomeIcon size="xs" icon={faChevronLeft} />
                    </button>
                </Col>
                <Col id="mypage-title">My Page</Col>
                <Col md={1} ></Col>
            </Row>
            <Row id="profile-container">
                <Col md={{ span: 2, offset: 3 }} id="main-badge-container">
                    <div id="main-badge">
                        <span>
                            {/* Main<br/>Badge */}
                        </span>
                    </div>
                </Col>
                <Col md={4} id="profile-col">
                    <Row id="user-name">
                        {currUser.username}
                    </Row>
                    <Row id="profile-butons">
                        <button id="see-badges-button" onClick={onClickSeeBadgesButton}>
                            See Badges
                        </button>
                        <button id="logout-button" onClick={onClickLogOutButton}>
                            Log Out
                        </button>
                    </Row>
                </Col>
            </Row>
            <Row id="posts-header-container">
                <Col className="area-label">
                    <span>My Posts</span>
                </Col>
                <Col md={6}></Col>

                <Col id="only-photos-button">
                    <div>
                        <Switch
                            onChange={()=>{setOnlyPhoto(!onlyPhoto)}}
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
            <Row id="postlist-container">
                <PostList
                    type={"Mypage"}
                    postListCallback={() => {}}
                    replyTo={0}
                    allPosts={posts}
                />
            </Row>
        </Container>
    );
}

export default MyPage;
