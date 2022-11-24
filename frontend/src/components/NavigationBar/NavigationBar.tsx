import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PositionType, selectPosition } from "../../store/slices/position";
import { useSelector } from "react-redux";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBullhorn, faUser } from "@fortawesome/free-solid-svg-icons";
import ReportModal from "../ReportModal/ReportModal";

function NavigationBar({ navReportCallback } : {navReportCallback: () => void;}) {
    const navigate = useNavigate();
    const positionState = useSelector(selectPosition);
    const [openReport, setOpenReport] = useState<boolean>(false);
    const [currPosition, setCurrPosition] =
        useState<PositionType>(positionState.position);
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                setCurrPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);

    const handleClickHome = () => {
        navigate("/");
    }
    const handleClickMyPage = () => {
        navigate("/mypage");
    }
    const handleClickReport = () => {
        setOpenReport(true);
    }
    return (
    <div id="navbar-container">
        <div id="buttongroup-container">
            <ButtonGroup>
                <Button 
                data-testid="home-button"
                onClick={handleClickHome}>
                    <FontAwesomeIcon icon={faHouse} />
                </Button>
                <Button 
                data-testid="report-button"
                onClick={handleClickReport}>
                    <FontAwesomeIcon icon={faBullhorn}/>
                </Button>
                <Button 
                data-testid="user-button"
                onClick={handleClickMyPage}>
                    <FontAwesomeIcon icon={faUser}/>
                </Button>
            </ButtonGroup>
        </div>
        <ReportModal 
            currPosition={currPosition}
            openReport={openReport}
            setOpenReport={setOpenReport}
            isNavbarReport={true}
            navReportCallback={navReportCallback}
        />
    </div>
    )
}

export default NavigationBar;

