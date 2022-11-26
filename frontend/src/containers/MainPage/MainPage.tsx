import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setPosition, PositionType, selectPosition } from "../../store/slices/position";
import { selectUser, setRadius, UserType } from "../../store/slices/user";
import { AppDispatch } from "../../store";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import Map from "./../../components/Map/Map";
import ReportModal from "../../components/ReportModal/ReportModal";
import MapSearch from "../../components/MapSearch/MapSearch";

import "./MainPage.scss";
// @ts-ignore
import Logo from "./Logo.svg";

const marks = [
    { value: 0, label: "0km" },
    { value: 25, label: "1km" },
    { value: 50, label: "2km" },
    { value: 75, label: "3km" },
    { value: 100, label: "4km" },
];

function MainPage() {
    const userState = useSelector(selectUser);
    const positionState = useSelector(selectPosition);

    const currUser = userState.currUser as UserType;
    const [currRadius, setCurrRadius] = useState<number>(currUser.radius*25);
    const [openReport, setOpenReport] = useState<boolean>(false);
    const [markerPosition, setMarkerPosition] =
        useState<PositionType>(positionState.position);
    const [currPosition, setCurrPosition] =
        useState<PositionType>(positionState.position);
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
                setCurrPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);

    useEffect(() => {
        geocoder.coord2RegionCode(
            currPosition.lng,
            currPosition.lat,
            (result, status) => {
                if (
                    status === kakao.maps.services.Status.OK &&
                    !!result[0].address_name
                ) {
                    setAddress(result[0].address_name);
                }
            }
        );
    }, [currPosition]);

    const onClickMyPageIcon = () => {
        navigate("/mypage");
    };
    const onChangeMapRadius = (event: Event, newValue: number | number[]) => {
        setCurrRadius(newValue as number);
    };
    const onClickFindOutButton = async () => {
        const radiusKm = currRadius/25;
        await dispatch(setRadius({user: currUser, radius: radiusKm})); //! type mismatch error,, why?
        await dispatch(setPosition(markerPosition));
        localStorage.setItem("position", JSON.stringify(markerPosition));
        navigate("/areafeed");
    };
    const onClickReportButton = () => {
        setOpenReport(true);
    };

    return (
        <Container id="MainPage">
            <Row
                id="main-upper-container"
                aria-label="background"
                onClick={() => setShowResults(false)}
            >
                <Col id="main-logo-container">
                    <img src={Logo} />
                </Col>
                <Col id="main-mypage-button-container">
                    <button id="mypage-button" onClick={onClickMyPageIcon}>
                        <FontAwesomeIcon
                            icon={faUser}
                            size="2x"
                            aria-label="mypage-button"
                        />
                    </button>
                </Col>
            </Row>
            <Row id="main-map-search-container">
                <MapSearch
                    markerPosition={markerPosition}
                    setMarkerPosition={setMarkerPosition}
                    showResults={showResults}
                    setShowResults={setShowResults}
                    setIsOpen={setIsOpen}
                />
            </Row>
            <Row
                id="main-description"
                aria-label="background"
                onClick={() => setShowResults(false)}
            >
                <span>Select a location and find out real-time statistics</span>
            </Row>
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
            <Row
                id="main-radius-slider-container"
                aria-label="background"
                onClick={() => setShowResults(false)}
            >
                <Col>
                    <Row id="main-change-radius">
                        <p>Change Radius</p>
                    </Row>
                    <Row id="main-radius-slider-content">
                        <Box sx={{ width: 200 }} id="radius-slider">
                            <Slider
                                key="radius-slider"
                                aria-label="Custom marks"
                                value={currRadius}
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
                    </Row>
                </Col>
                <Col
                    id="findout-container"
                    aria-label="background"
                    onClick={() => setShowResults(false)}
                >
                    <Button
                        id="findout-button"
                        onClick={onClickFindOutButton}
                        type="button"
                    >
                        <span aria-label="findout-button">{"Find out  >"}</span>
                    </Button>
                </Col>
            </Row>
            <Row
                id="main-curr-location-container"
                aria-label="background"
                onClick={() => setShowResults(false)}
            >
                <span>{`Current location: ${address}`}</span>
            </Row>
            <Row
                id="main-report-button-container"
                aria-label="background"
                onClick={() => setShowResults(false)}
            >
                <Button
                    id="report-button"
                    onClick={onClickReportButton}
                    type="button"
                >
                    Report!
                </Button>
            </Row>
            <ReportModal
                currPosition={currPosition}
                openReport={openReport}
                setOpenReport={setOpenReport}
                isNavbarReport={false}
                navReportCallback={() => {}}
            />
        </Container>
    );
}

export default MainPage;
