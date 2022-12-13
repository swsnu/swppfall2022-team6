import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBullhorn, faUser } from "@fortawesome/free-solid-svg-icons";
import ReportModal from "../ReportModal/ReportModal";

import "./NavigationBar.scss"

function NavigationBar({ navReportCallback } : {navReportCallback: () => void;}) {
    const navigate = useNavigate();
    const [openReport, setOpenReport] = useState<boolean>(false);

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
            {<ButtonGroup 
                vertical
                size="sm"
                // style={{
                //     position: "absolute", 
                //     bottom: "50%", 
                //     right: "5px",
                //     fontSize: "12px",
                //     zIndex: 100
                // }}
                >
                    <Button 
                    style={{
                        background:"#3185E7", 
                        border:0, 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center",
                        padding: "10px 5px"
                    }}
                    data-testid="home-button"
                    onClick={handleClickHome}>
                        <FontAwesomeIcon icon={faHouse} />
                        <span style={{fontSize: "12px",}}>Home</span>
                    </Button>
                    <Button 
                    className="navbar-button"
                    style={{
                        background:"#3185E7", 
                        border:0, 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center",
                        padding: "10px 5px"
                    }}
                    data-testid="report-button"
                    onClick={handleClickReport}>
                        <FontAwesomeIcon icon={faBullhorn}/>
                        <span style={{fontSize: "12px",}}>Report</span>
                    </Button>
                    <Button 
                    className="navbar-button"
                    style={{
                        background:"#3185E7",
                        border:0, 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center",
                        padding: "10px 5px"
                    }}
                    data-testid="user-button"
                    onClick={handleClickMyPage}>
                        <FontAwesomeIcon icon={faUser}/>
                        <span style={{fontSize: "12px",}}>My Page</span>
                    </Button>
                </ButtonGroup>
            }
        </div>
        <ReportModal 
            openReport={openReport}
            setOpenReport={setOpenReport}
            isNavbarReport={true}
            navReportCallback={navReportCallback}
        />
    </div>
    )
}

export default NavigationBar;

