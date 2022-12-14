import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { AppDispatch } from "../../store";
import { selectHashtag } from "../../store/slices/hashtag";
import { fetchHashPosts, PostType, selectPost } from "../../store/slices/post";

import { Button, Checkbox, Layout, Space } from "antd";
import { ArrowLeftOutlined, SyncOutlined } from "@ant-design/icons";
import SearchBar from "material-ui-search-bar";
import { styled } from "@material-ui/core/styles";

import PostList from "../../components/PostList/PostList";
import NavigationBar from "../../components/NavigationBar/NavigationBar";

// import { CustomSearchBar } from "../AreaFeed/AreaFeed";

import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import { selectPosition } from "../../store/slices/position";
import Loading from "../../components/Loading/Loading";
import { selectApiError, setDefaultApiError } from "../../store/slices/apierror";

import "./HashFeed.scss";

const { Header, Content } = Layout;

export const CustomSearchBar = styled(SearchBar)({
  backgroundColor: "#F5F5F5",
  borderRadius: "10px",
  fontFamily: '"NanumGothic", sans-serif',
  fontSize: "10px",
  // width: "500px"
});

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

function HashFeed() {
  const { id } = useParams();
  const hashtagState = useSelector(selectHashtag);
  const postState = useSelector(selectPost);
  const positionState = useSelector(selectPosition);
  const errorState = useSelector(selectApiError);

  const [onlyPhoto, setOnlyPhoto] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<Boolean>(false);
  const [queryPosts, setQueryPosts] = useState<PostType[]>(postState.posts);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(()=>{
    dispatch(setDefaultApiError())
  }, []);

  useEffect(() => {
    setQueryPosts(postState.posts)
  }, [postState.posts]);

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const fetchData = async () => {
    // const user = userState.currUser as UserType;
    await dispatch(fetchHashPosts(Number(id)));
    setRefresh(false);

    // const queryPostPromise = await dispatch(fetchHashPosts(Number(id)));
    // if (queryPostPromise.payload === undefined) navigate("/");
    // const postData = queryPostPromise.payload as PostType[];
    // setQueryPosts(postData);
    //await dispatch(fetchHashfeedTop3Hashtags(Number(id)));
    setIsLoading(true);
  };

  useEffect(() => {
    if (refresh) {
      fetchData();
    }
  }, [refresh]);

  useEffect(() => {
    fetchData()
  }, [id])

  useEffect(() => {
    let resultPosts = postState.posts;
    if (onlyPhoto) {
      resultPosts = resultPosts.filter((post: PostType) => post.image);
    }
    setQueryPosts(resultPosts);
  }, [onlyPhoto]);

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
  const onClickBackButton = () => {
    navigate("/areafeed");
  };

  const showClusterMap = () => {
    const mapHeight = windowSize.innerWidth > 1000 ? "80vh" : "30vh";
    return (
      <Map
        id="map-hashfeed"
        center={positionState.findPosition}
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
        <h2 className="hash-label post-title title">Posts</h2>
        <div id="search-box-container" style={{ display: "flex" }}>
            <CustomSearchBar
              className="search-box"
              placeholder=""
              value={searchQuery}
              onRequestSearch={() => onSubmitSearchBox()}
              onCancelSearch={() => onClickClose()}
              onChange={(searchVal) => setSearchQuery(searchVal)}
            />
          <div id="only-photos-button">
            <Checkbox
              className="checkbox"
              checked={onlyPhoto}
              onChange={onSelectOnlyPhotos}
            />
            <span> Only Photos</span>
          </div>
        </div>
        <div id="postlist-container">
          <PostList
            allPosts={queryPosts}
            type={"Post"}
            replyTo={0}
            postListCallback={postListCallback}
          />
        </div>
      </div>
    );
  };

  return (
    <Layout className="HashFeed">
      <Header
        id="hashfeed-upper-container"
        className="Header"
        style={{ backgroundColor: "white" }}
      >
        <div id="button-container">
          <ArrowLeftOutlined
            id="back-button"
            className="button"
            onClick={onClickBackButton}
          />
          <SyncOutlined
            id="refresh-button"
            className="button"
            onClick={onClickRefreshButton}
          />
        </div>
        <div className="title hashfeed-title">
          #{hashtagState.top3[0].content}
        </div>
      </Header>
      {isLoading ? (
        <Content className="Content" style={{ backgroundColor: "white" }}>
          <div id="cluster-map">{showClusterMap()}</div>
          <div className="right-container">

            <div id="recommended-hashtag-container">
              <div className="hash-label title hashtag-title">
                Recommended Hashtags
              </div>
              <div id="hashtag-buttons">
                {hashtagState.top3.slice(1).length > 0 ? (
                  <Space>
                    {hashtagState.top3.slice(1).map((item, i) => {
                      return (
                        <Button
                          key={i}
                          className="hashtag"
                          onClick={() => {
                            navigate(`/hashfeed/${item.id}`);
                          }}
                        >
                          {"#" + item.content}
                        </Button>
                      );
                    })}
                  </Space>
                ) : (
                  <div className="no-hashtag">
                    No recommended hashtag! ????
                  </div>
                )}
              </div>
            </div>
            <HashFeedPosts></HashFeedPosts>
          </div>
        </Content>
      ) : (
        <Loading />
      )}
      <div className="navigation-bar">
        <NavigationBar navReportCallback={navReportCallback} />
      </div>
    </Layout>
  );
}

export default HashFeed;
