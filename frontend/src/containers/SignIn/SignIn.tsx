import axios from "axios";
import { dispatch } from "d3";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { setLogin, fetchUserBadges } from "../../store/slices/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { selectUser } from "../../store/slices/user";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./SignIn.scss"
import { selectApiError, setDefaultApiError } from "../../store/slices/apierror";

function SignIn() {
    const authenticated = window.sessionStorage.getItem('isLoggedIn') === "true"

    //debug
    const userState = useSelector(selectUser);
    const errorState = useSelector(selectApiError);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [emailFocus, setEmailFocus] = useState<boolean>(false);
    const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
    const focusList = [setEmailFocus, setPasswordFocus];

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    // const isEmailWarning = (email: string) => {
    //     const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{1,})$/i;
    //     if (!emailRegex.test(email))
    //         return false
    //     return true;
    // };
    useEffect(()=>{
        dispatch(setDefaultApiError())
    }, []);

    const login = async() => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        // if (!isEmailWarning(email)) {
        //     alert("알맞은 이메일을 입력해주세요");
        // } else await dispatch(setLogin(formData));
        await dispatch(setLogin(formData));
    };

    const onClickInput = (from: string) => {
        focusList.forEach((func) => func(false));
        switch (from) {
            case "email":
                setEmailFocus(true);
                break;
            case "password":
                setPasswordFocus(true);
                break;
        }
    }
    const onClickSignUpButton = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        navigate("/signup");
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login();
    };

    if(authenticated){
        return <Navigate to="/" />;
    }
    return (
        <Container className="SignIn">
            <Row id="header-container">
                <Row id="nowsee-logo-container">
                    <img src="https://nowsee.today/Logo.svg" className="nowsee-logo-image"/>
                </Row>
                <Row id="page-info-container">
                    <Row id="signin-title">Login to your Account</Row>
                    <Row className="api-error-message">
                        {errorState.apiError.msg}
                    </Row>
                </Row>
            </Row>
            <form className="login-form" onSubmit={onSubmit}>
                <span>
                    <div className="icon">
                        <img src="/email-icon.svg" className="email-icon"/>
                    </div>
                    <div className={(emailFocus? "focused-": "")+"input-container"}>
                        <input
                            required
                            autoComplete="email"
                            autoFocus
                            type="text"
                            id="email-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.trim())}
                            onFocus={() => onClickInput("email")}
                            onBlur={() => onClickInput("")}
                            placeholder="Email"
                        />
                    </div>
                </span>
                <span>
                    <div className="icon">
                        <img src="/password-icon.svg" className="password-icon"/>
                    </div>
                    <div className={(passwordFocus? "focused-": "")+"input-container"}>
                        <input
                            required
                            autoComplete="current-password"
                            type="password"
                            id="password-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value.trim())}
                            onFocus={() => onClickInput("password")}
                            onBlur={() => onClickInput("")}
                            placeholder="Password"
                        />
                    </div>
                </span>
                <div className="button-container">
                    <button type="submit">Sign In</button>
                    <button
                        id="signup-button"
                        onClick={onClickSignUpButton}
                        //disabled={!(email && password)}
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </Container>
    );
}

export default SignIn;
