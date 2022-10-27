import React, { useState } from "react";
import Map from "./../../components/Map/Map";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useNavigate } from "react-router-dom";

const marks = [
    {value: 0, label: '1km',},
    {value: 25, label: '2km',},
    {value: 50, label: '3km',},
    {value: 75, label: '4km',},
    {value: 100, label: '5km',},
  ];

function MainPage() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [radius, setRadius] = useState<number>(25);
    const navigate = useNavigate();

    const onClickMyPageIcon = () => {
        navigate("/mypage");
    };
    const onChangeMapRadius = (event: Event, newValue: number | number[]) => {
        setRadius(newValue as number);

    };
    const onSubmitSearchBox = (e: React.KeyboardEvent<HTMLInputElement>) => {
        //if (e.key === "Enter") {}
    };
    const onClickFindOutButton = () => {};
    const onClickReportButton = () => {};

    return (
        <div className="MainPage">
            <div id="upper-container">
                NowSee
                <button id="mypage-button" onClick={onClickMyPageIcon}>
                    MyPage
                </button>
            </div>
            <div id="search-box-container">
                <input
                    id="search-box"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => onSubmitSearchBox(e)}
                />
            </div>
            <Map radius={radius}/>
            <div id="lower-map-container">
                <Box sx={{ width: 300 }} id="radius-slider">
                    <Slider
                        aria-label="Custom marks"
                        defaultValue={radius}
                        getAriaValueText={
                            (value: number): string=>{return `${value}km`}
                        }
                        valueLabelDisplay="auto"
                        valueLabelFormat={
                            (value: number): string=>{return `${value/25+1}km`}
                        }
                        onChange={onChangeMapRadius}
                        marks={marks}
                    />
                </Box>
                <button id="findout-button" onClick={onClickFindOutButton}>
                    Find out
                </button>
            </div>
            <div id="bottom-container">
                <span>Current location: </span>
                <button id="report-button" onClick={onClickReportButton}>
                    Report
                </button>
            </div>
        </div>
    );
}

export default MainPage;
