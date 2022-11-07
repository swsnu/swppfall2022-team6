import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Statistics from "../../components/Statistics/Statistics";
import { useNavigate } from "react-router-dom";
import PostList from "../../components/PostList/PostList";
import { ReportType } from "../../components/Statistics/Statistics";
import axios from "axios";
import "./AreaFeed.scss";

export type HashtagType = {
    id: number;
    content: string;
};

type WeatherType = {
    id?: number;
    temp?: number;
    main?: string;
};

export type PostType = {
    id: number;
    user: number;
    content: string;
    image: string; // image url
    latitude: number;
    longitude: number;
    created_at: string;
    reply_to: number | null; // id of the chained post
    hashtags: Array<HashtagType>;
};

function AreaFeed() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const navigate = useNavigate();
    const [allReports, setAllReports] = useState<ReportType[]>([]);
    const [allPosts, setAllPosts] = useState<PostType[]>([]);
    const [queryPosts, setQueryPosts] = useState<PostType[]>([]);
    const [refresh, setRefresh] = useState<Boolean>(true);
    const [top3Hashtag, setTop3Hashtag] = useState<string[]>([]);
    const [weather, setWeather] = useState<WeatherType>({});

    useEffect(() => {
        if(refresh){
            // update PostList & Hashtags
            axios
                .get("/post/", {
                    params: { latitude: 37.0, longitude: 127.0, radius: 143 }, // modify to redux
                })
                .then((response) => {
                    setAllPosts(response.data["posts"]);
                    setQueryPosts(response.data["posts"]);
                    setTop3Hashtag(response.data["top3_hashtags"]);
                });
            // update WeatherAPI
            const lat = 37.0;
            const lon = 127.0;
            const api = {
                key: "c22114b304afd9d97329b0223da5bb01",
                base: "https://api.openweathermap.org/data/2.5/",
            };
            const url = `${api.base}weather?lat=${lat}&lon=${lon}&appid=${api.key}`;
            axios.get(url).then((response) => {
                const data = response.data;
                setWeather({
                    id: data.weather[0].id,
                    temp: Math.round(data.main.temp - 273.15),
                    main: data.weather[0].main,
                });
            });
            // update Statistics
            axios
                .get("/report/", {
                    params: { latitude: 30, longitude: 30, radius: 2 }, // modify to redux
                })
                .then((response) => {
                    setAllReports(response.data);
                    setRefresh(false);
                });
            }
    }, [refresh]);

    const onClickBackButton = () => {
        navigate("/");
    };
    const onClickRefreshButton = () => {
        setRefresh(true);
    };
    const onSubmitSearchBox = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log("yes")
        if (e.key === "Enter") {
            setQueryPosts(
                allPosts.filter((post: PostType) =>
                    post.content.includes(searchQuery)
                )
            );
        }
    };
    const onClickHashtagButton = (hashtag: string) => {
        //TODO: queryPosts? allPosts?
        setQueryPosts(
            allPosts.filter(
                (post: PostType) =>
                    post.hashtags &&
                    post.hashtags.map((h) => h.content).includes(hashtag)
            )
        );
    };
    const onSelectOnlyPhotos = () => {
        setQueryPosts(allPosts.filter((post: PostType) => post.image));
    };
    const postListCallback = () => {
        setRefresh(true);
    }; // axios.get again

    return (
        <div className="AreaFeed">
            <div id="areafeed-upper-container">
                <div id="button-container">
                    <button id="back-button" onClick={onClickBackButton}>
                        ←
                    </button>
                    <button id="refresh-button" onClick={onClickRefreshButton}>
                        ↻
                    </button>
                </div>
                <div id="weather-container">
                    {" "}
                    <div id="weather-temp">{weather.temp}&deg;C</div>
                    <div id="weather-status">{weather.main}</div>
                </div>
            </div>
            <Statistics allReports={allReports} />
            <div id="recommended-hashtag-container">
                <div className="label">Recommended Hashtags</div>
                <div id="hashtag-buttons">
                    {top3Hashtag[0] && (
                        <button
                            id="hashtag1-button"
                            className="hashtag"
                            onClick={() => onClickHashtagButton(top3Hashtag[0])}
                        >
                            {"#" + top3Hashtag[0]}
                        </button>
                    )}
                    {top3Hashtag[1] && (
                        <button
                            id="hashtag2-button"
                            className="hashtag"
                            onClick={() => onClickHashtagButton(top3Hashtag[1])}
                        >
                            {"#" + top3Hashtag[1]}
                        </button>
                    )}
                    {top3Hashtag[2] && (
                        <button
                            id="hashtag3-button"
                            className="hashtag"
                            onClick={() => onClickHashtagButton(top3Hashtag[2])}
                        >
                            {"#" + top3Hashtag[2]}
                        </button>
                    )}
                </div>
            </div>
            <div id="search-box-container">
                <div className="label">Posts</div>
                <div id="search-container">
                    <input
                        id="search-box"
                        value={searchQuery}
                        placeholder={"🔍 Search"}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => onSubmitSearchBox(e)}
                    />
                    <button
                        id="only-photos-button"
                        onClick={onSelectOnlyPhotos}
                    >
                        ◯ Only Photos
                    </button>
                </div>
            </div>
            <div id="postlist-container">
                <PostList
                    type={"Post"}
                    postListCallback={postListCallback}
                    replyTo={0}
                    allPosts={queryPosts}
                />
            </div>
            <NavigationBar />
        </div>
    );
}

export default AreaFeed;
