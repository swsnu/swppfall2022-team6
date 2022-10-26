import React, { useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Statistics from "../../components/Statistics/Statistics";
import Posts from "../../components/PostList/PostList";
import { useNavigate } from "react-router-dom";

function DetailPage() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const navigate = useNavigate();

    const onClickBackButton = () => {
        navigate("/detail");
    };
    const onClickRefreshButton = () => {};
    const onSubmitSearchBox = (e: React.KeyboardEvent<HTMLInputElement>) => {};
    const onClickHashtagButton = () => {};
    const onSelectOnlyPhotos = () => {};

    return (
        <div className="DetailPage">
            <div id="upper-container">
                <button id="back-button" onClick={onClickBackButton}>
                    Back
                </button>
                <button id="refresh-button" onClick={onClickRefreshButton}>
                    Refresh
                </button>
                <div id="weather-container"></div>
            </div>
            <Statistics />
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
            <Posts />
            <NavigationBar />
        </div>
    );
}

export default DetailPage;
