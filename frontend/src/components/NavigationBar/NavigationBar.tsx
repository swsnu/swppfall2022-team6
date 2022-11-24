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

    // const [navbarVertical, setNavBarVertical] = useState(
    //     window.matchMedia("(min-width: 768px)").matches
    // )

    // useEffect(() => {
    //     window
    //     .matchMedia("(min-width: 768px)")
    //     .addEventListener('change', e => setNavBarVertical( e.matches ));
    // }, []);

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
        <div>
            { // navbarVertical
                // ?
                <ButtonGroup vertical
                style={{position: "absolute", bottom: "50%", right: "2%"}}
                >
                    <Button 
                    style={{background:"#3185E7", border:0}}
                    data-testid="home-button"
                    onClick={handleClickHome}>
                        <FontAwesomeIcon icon={faHouse} />
                    </Button>
                    <Button 
                    className="navbar-button"
                    style={{background:"#3185E7", border:0}}
                    data-testid="report-button"
                    onClick={handleClickReport}>
                        <FontAwesomeIcon icon={faBullhorn}/>
                    </Button>
                    <Button 
                    className="navbar-button"
                    style={{background:"#3185E7", border:0}}
                    data-testid="user-button"
                    onClick={handleClickMyPage}>
                        <FontAwesomeIcon icon={faUser}/>
                    </Button>
                </ButtonGroup>
                // :
                // <ButtonGroup 
                // style={{position: "absolute", bottom: "4px", right: "40%"}}
                // >
                //     <Button 
                //     style={{background:"#3185E7", border:0}}
                //     data-testid="home-button"
                //     onClick={handleClickHome}>
                //         <FontAwesomeIcon icon={faHouse} />
                //     </Button>
                //     <Button 
                //     className="navbar-button"
                //     style={{background:"#3185E7", border:0}}
                //     data-testid="report-button"
                //     onClick={handleClickReport}>
                //         <FontAwesomeIcon icon={faBullhorn}/>
                //     </Button>
                //     <Button 
                //     className="navbar-button"
                //     style={{background:"#3185E7", border:0}}
                //     data-testid="user-button"
                //     onClick={handleClickMyPage}>
                //         <FontAwesomeIcon icon={faUser}/>
                //     </Button>
                // </ButtonGroup>
            }
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

