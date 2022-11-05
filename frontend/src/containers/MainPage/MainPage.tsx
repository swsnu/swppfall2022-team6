import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullhorn, faUser } from "@fortawesome/free-solid-svg-icons";

import Map, { PositionType } from "./../../components/Map/Map";
import AreaFeed from "../AreaFeed/AreaFeed";
import ReportModal from "../../components/ReportModal/ReportModal";
import MapSearch from "../../components/MapSearch/MapSearch";
import "./MainPage.scss"

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
    const [currPosition, setCurrPosition] =
        useState<PositionType>(initMarkPosition);
    const [address, setAddress] = useState<string>("");
    const navigate = useNavigate();

    const geocoder = new kakao.maps.services.Geocoder();
    
    useEffect(()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setMarkPosition({
                    lat: position.coords.latitude, 
                    lng: position.coords.longitude
                });
                setCurrPosition({
                    lat: position.coords.latitude, 
                    lng: position.coords.longitude
                });
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);

    useEffect(()=>{
        geocoder.coord2RegionCode(
            currPosition.lng, currPosition.lat, 
          (result, status)=>{
            console.log(result)
            if(status == kakao.maps.services.Status.OK && !!result[0].address_name){
              setAddress(result[0].address_name)
            }
          } 
        ); 
      }, [currPosition])

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
                    <FontAwesomeIcon icon={faUser} size="2x"/>
                </button>
            </div>
            <div id="main-container">
                <MapSearch markPosition={markPosition} setMarkPosition={setMarkPosition}/>
                <div className="map-container">
                    <Map initPosition={markPosition} radius={radius} />
                </div>
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
                    <span>{`Current location: ${address}`}</span>
                    <button id="report-button" onClick={onClickReportButton}>
                        <span>Report!</span>
                        {/* <FontAwesomeIcon icon={faBullhorn}/> */}
                    </button>
                </div>
            </div>
            <ReportModal
                openReport={openReport}
                setOpenReport={setOpenReport}
            />
        </div>
    );
}

export default MainPage;
