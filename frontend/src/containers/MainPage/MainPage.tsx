import React, { useState } from "react";
import Map, { PositionType } from "./../../components/Map/Map";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useNavigate } from "react-router-dom";
import AreaFeed from "../AreaFeed/AreaFeed";
<<<<<<< HEAD
import ReportModal from "../../components/ReportModal/ReportModal";
=======
>>>>>>> 446834c917355f35b0ca9881880e1f80802ffbd9
import "./MainPage.css"

const marks = [
    { value: 0, label: "0km" },
    { value: 25, label: "1km" },
    { value: 50, label: "2km" },
    { value: 75, label: "3km" },
    { value: 100, label: "4km" },
];

const initMarkPosition: PositionType = {
    lat: 37.44877599087201,
    lng: 126.95264777802309,
}; // 서울대 중심

function MainPage() {
    const [radius, setRadius] = useState<number>(50);
    const [openReport, setOpenReport] = useState<boolean>(false);
    const [markPosition, setMarkPosition] =
        useState<PositionType>(initMarkPosition);
    const navigate = useNavigate();

    const onClickMyPageIcon = () => {
        navigate("/mypage");
    };
    const onChangeMapRadius = (event: Event, newValue: number | number[]) => {
        setRadius(newValue as number);
    };
    const onClickFindOutButton = () => {
        navigate("/areafeed");
    };
    const onClickReportButton = () => {
        setOpenReport(true);
    };

    return (
        <div className="MainPage">
            <div id="upper-container">
                NowSee
                <button id="mypage-button" onClick={onClickMyPageIcon}>
                    MyPage
                </button>
            </div>
            <div id="main-container">
                <div className="search-input-container">
                    <input type="text" className="search-input" />
                </div>
                <Map initPosition={markPosition} radius={radius} />
                <div id="lower-map-container">
                    <div className="radius-slider-container">
                        <p>Change Radius</p>
                        <Box sx={{ width: 300 }} id="radius-slider">
                            <Slider
                                key="radius-slider"
                                aria-label="Custom marks"
                                defaultValue={radius}
                                step={2.5}
                                min={0.01}
                                getAriaValueText={(value: number): string => {
                                    return `${value}km`;
                                }}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value: number): string => {
                                    return `${value / 25}km`;
                                }}
                                onChange={onChangeMapRadius}
                                marks={marks}
                            />
                        </Box>
                    </div>
                    <div className="findout-container">
                        <button id="findout-button" onClick={onClickFindOutButton}>
                            {"Find out  >"}
                        </button>
                    </div>
                </div>
                <div id="bottom-container">
                    <span>Current location: </span>
                    <button id="report-button" onClick={onClickReportButton}>
                        Report
                    </button>
                </div>
            </div>
            <div id="bottom-container">
                <span>Current location: </span>
                <button id="report-button" onClick={onClickReportButton}>
                    Report
                </button>
            </div>
            <ReportModal
                openReport={openReport}
                setOpenReport={setOpenReport}
            />
            {openReport ? <AreaFeed /> : null}
        </div>
    );
}

export default MainPage;
