import React from "react";
import { useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBullhorn, faUser } from "@fortawesome/free-solid-svg-icons";

function NavigationBar() {
    const navigate = useNavigate();
    const handleClickHome = () => {
        navigate("/");
    }
    const handleClickMyPage = () => {
        navigate("/mypage");
    }
    const handleClickReport = () => {
        // TODO: open report modal in postdetail & arefeed -> navigate to areafeed
    }
    return (
    <div id="navbar-container">
        <ButtonGroup>
            <Button onClick={handleClickHome}>
                <FontAwesomeIcon icon={faHouse} />
            </Button>
            <Button>
                <FontAwesomeIcon icon={faBullhorn}/>
            </Button>
            <Button onClick={handleClickMyPage}>
                <FontAwesomeIcon icon={faUser}/>
            </Button>
        </ButtonGroup>
    </div>
    )
}

export default NavigationBar;

