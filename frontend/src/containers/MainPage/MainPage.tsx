import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
    setFindPosition,
    setCurrPosition as setCurrPostionState,
    PositionType,
    selectPosition,
} from "../../store/slices/position";
import { selectUser, setRadius, UserType } from "../../store/slices/user";
import { AppDispatch } from "../../store";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { Layout, Slider } from 'antd';

import Map from "./../../components/Map/Map";
import ReportModal from "../../components/ReportModal/ReportModal";
import MapSearch from "../../components/MapSearch/MapSearch";

import "./MainPage.scss";
// @ts-ignore
import Logo from "./Logo.svg";
const { Header, Content } = Layout;

const sliderMarks = {
    0: "0km",
    25: "1km",
    50: "2km",
    75: "3km",
    100: "4km",
};

const MainPage: React.FC = ()=>{
    const userState = useSelector(selectUser);
    const positionState = useSelector(selectPosition);

    const currUser = userState.currUser as UserType;
    const [currRadius, setCurrRadius] = useState<number>(currUser.radius * 25);
    const [openReport, setOpenReport] = useState<boolean>(false);
    const [markerPosition, setMarkerPosition] = useState<PositionType>(
        positionState.findPosition
    );
    // const [currPosition, setCurrPosition] = useState<PositionType>(
    //     positionState.findPosition
    // );
    const [address, setAddress] = useState<string>("");
    const [showResults, setShowResults] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const geocoder = new kakao.maps.services.Geocoder();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                setMarkerPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                dispatch(setCurrPostionState({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }));
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);

    useEffect(() => {
        geocoder.coord2RegionCode(
            positionState.currPosition.lng,
            positionState.currPosition.lat,
            (result, status) => {
                if (
                    status === kakao.maps.services.Status.OK &&
                    !!result[0].address_name
                ) {
                    setAddress(result[0].address_name);
                }
            }
        );
    }, [positionState.currPosition]);

    const onClickMyPageIcon = () => {
        navigate("/mypage");
    };
    const onClickFindOutButton = async () => {
        const radiusKm = currRadius / 25;
        await dispatch(setRadius({ user: currUser, radius: radiusKm })); //! type mismatch error,, why?
        await dispatch(setFindPosition(markerPosition));
        localStorage.setItem("position", JSON.stringify(markerPosition));
        navigate("/areafeed");
    };
    const onClickReportButton = () => {
        setOpenReport(true);
    };
    
    return (
        <Layout className="MainPage">
            <Header className="Header" style={{backgroundColor: "white"}}>
                <img src={Logo} className="nowsee-logo"/>
                <button className="mypage-button" onClick={onClickMyPageIcon} aria-label="mypage-button">
                    <img src="/mypage-icon.svg"/>
                </button>
            </Header>
            <Content className="Content">
                <Row id="main-map-search-container">
                    <MapSearch
                        markerPosition={markerPosition}
                        setMarkerPosition={setMarkerPosition}
                        showResults={showResults}
                        setShowResults={setShowResults}
                        setIsOpen={setIsOpen}
                    />
                </Row>
                <Row className="content-lower">
                    <div className="main-top-map-container">
                        <Row
                            id="main-map-container"
                            aria-label="background"
                            onClick={() => setShowResults(false)}
                        >
                            <Map
                                markerPosition={markerPosition}
                                setMarkerPosition={setMarkerPosition}
                                radius={currRadius}
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                            />
                        </Row>
                    </div>
                    <div className="right-button-container">
                        <div
                            className="main-description"
                            aria-label="background"
                            onClick={() => setShowResults(false)}
                        >
                            <span className="main-description-span">
                                Select a location and find out real-time statistics!
                            </span>
                        </div>
                        <div className="current-location">
                            <span>Current location:</span>
                            <span>{address}</span>
                        </div>
                        <Button
                            className="findout-button"
                            onClick={onClickFindOutButton}
                            type="button"
                            style={{
                                backgroundColor: "#3185e7",
                                borderRadius: "10px",
                                fontWeight: "900",
                                fontSize: "15px",
                                display: "flex",
                                gap: "10px",
                                placeContent: "center",
                            }}
                        >
                            <span aria-label="findout-button">
                                Find out
                            </span>
                            <span>{">"}</span>
                        </Button>
                        <Button
                            className="report-button"
                            onClick={onClickReportButton}
                            type="button"
                            style={{
                                backgroundColor: "white",
                                borderRadius: "10px",
                                fontWeight: "900",
                                fontSize: "15px",
                                color: "#3185e7",
                                border: "2px solid #3185e7"
                            }}
                        >
                            Report!
                        </Button>
                        <div className="slider-description">
                            Change radius
                        </div>
                        <Slider 
                            // @ts-ignore
                            tooltip={{formatter:(value: number)=>`${value/25}km`}}
                            marks={sliderMarks}
                            included
                            value={currRadius}
                            onChange={(value)=>setCurrRadius(value)}
                            className="radius-slider"
                        />
                    </div>
                </Row>
            </Content>
            <ReportModal
                openReport={openReport}
                setOpenReport={setOpenReport}
                isNavbarReport={false}
                navReportCallback={() => {}}
            />
        </Layout>
    );
}

export default MainPage;
