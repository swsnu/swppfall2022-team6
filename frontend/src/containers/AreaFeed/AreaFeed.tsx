import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Statistics from "../../components/Statistics/Statistics";
import { useNavigate } from "react-router-dom";
import PostList from "../../components/PostList/PostList";
import { ReportType } from "../../components/Statistics/Statistics";
import axios from "axios";

export type PostType = {
    id: number;
    user_id: number;
    content: string;
    image: string; // image url
    latitude: number;
    longitude: number;
    time: string; // date string
    reply_to: number; // id of the chained post
};

function AreaFeed() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const navigate = useNavigate();
    const [allReports, setAllReports] = useState<ReportType[]>([]);
    const [allPosts, setAllPosts] = useState<PostType[]>([
        {
            id: 2,
            user_id: 2,
            content: "학교는 많이 춥네요ㅠㅠ\n겉옷 챙기시는게 좋을 것 같아요!",
            latitude: 37.44877599087201,
            longitude: 126.95264777802309,
            time: new Date().toLocaleDateString(),
            reply_to: 1,
            image: "",
        },
        {
            id: 1,
            user_id: 1,
            content:
                "지금 설입은 맑긴 한데 바람이 많이 불어요\n겉옷을 안 챙겨 나왔는데 학교도 춥나요? 자연대 쪽에...",
            latitude: 37.44877599087201,
            longitude: 126.95264777802309,
            time: new Date().toLocaleDateString(),
            image: "",
            reply_to: 0,
        },
    ]);

    useEffect(() => {
        axios
            .get("/report/", {
                params: { latitude: 30, longitude: 30, radius: 2 }, // modify to redux
            })
            .then((response) => {
                setAllReports(response.data);
            });
    }, []);

    const onClickBackButton = () => {
        navigate("/");
    };
    const onClickRefreshButton = () => {
        // TODO: re-render weather container, Statistics, PostList
    };
    const onSubmitSearchBox = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // TODO: filter PostList by search value
    };
    const onClickHashtagButton = () => {
        // TODO: filter PostList by hashtag
    };
    // const onSelectOnlyPhotos = () => {};
    const postListCallback = () => {}; // axios.get again

    return (
        <div className="AreaFeed">
            <div id="upper-container">
                <button id="back-button" onClick={onClickBackButton}>
                    Back
                </button>
                <button id="refresh-button" onClick={onClickRefreshButton}>
                    Refresh
                </button>
                <div id="weather-container"></div>
            </div>
            <Statistics allReports={allReports}/>
            <div id="hashtag-container"></div>
            <div id="search-box-container">
                <input
                    id="search-box"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => onSubmitSearchBox(e)}
                />
                <button id="only-photos-button" onClick={onClickHashtagButton}>
                    Only Photos
                </button>
            </div>
            <PostList
                type={"Post"}
                postListCallback={postListCallback}
                replyTo={0}
                allPosts={allPosts}
            />
            <NavigationBar />
        </div>
    );
}

export default AreaFeed;
