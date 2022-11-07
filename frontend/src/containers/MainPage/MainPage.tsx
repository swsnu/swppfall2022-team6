import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Map, { PositionType } from "./../../components/Map/Map";
import ReportModal from "../../components/ReportModal/ReportModal";
import MapSearch from "../../components/MapSearch/MapSearch";
import "./MainPage.scss";
// @ts-ignore
import Logo from "./Logo.svg"

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
    const [showResults, setShowResults] = useState<boolean>(false);
    const navigate = useNavigate();

    const geocoder = new kakao.maps.services.Geocoder();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setMarkPosition({
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
                console.log(result);
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
        setRadius(newValue as number);
    };
    const onClickFindOutButton = () => {
        navigate("/areafeed");
    };
    const onClickReportButton = () => {
        setOpenReport(true);
    };

    return (
        <Container id="MainPage">
            <Row id="main-upper-container">
                <Col id="main-logo-container">
                    <img src={Logo}/>
                </Col>
                <Col id="main-mypage-button-container">
                    <button id="mypage-button" onClick={onClickMyPageIcon}>
                        <FontAwesomeIcon icon={faUser} size="2x"/>
                    </button>
                </Col>
            </Row>
            <Row id="main-map-search-container">
                <MapSearch markPosition={markPosition} setMarkPosition={setMarkPosition}/>
            </Row>
            <Row id="main-description">
                <span>Select a location and find out real-time statistics</span>
            </Row>
            <Row id="main-map-container">
                <Map initPosition={markPosition} radius={radius} />
            </Row>
            <Row id="main-radius-slider-container">
                <Col>
                    <Row id="main-change-radius">
                        <p>Change Radius</p>
                    </Row>
                    <Row id="main-radius-slider-content">
                        <Box sx={{ width: 200 }} id="radius-slider">
                            <Slider
                                key="radius-slider"
                                aria-label="Custom marks"
                                value={radius}
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
                <Col id="findout-container">
                    <Button id="findout-button" onClick={onClickFindOutButton} type="button">
                        <span>{"Find out  >"}</span>
                    </Button>
                </Col>
            </Row>
            <Row id="main-curr-location-container">
                <span>{`Current location: ${address}`}</span>
            </Row>
            <Row id="main-report-button-container">
                <Button id="report-button" onClick={onClickReportButton} type="button">
                    Report!
                </Button>
            </Row>
            <ReportModal
                openReport={openReport}
                setOpenReport={setOpenReport}
            />
        </Container>
    );
}

export default MainPage;
