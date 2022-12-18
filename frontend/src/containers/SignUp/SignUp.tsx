import React, { useState, useEffect } from "react";
import { checkValidUserName, checkValidEmail, checkValidPassword, checkValidPasswordCheck } from "./SignUpUtils";
import { setSignUp } from "../../store/slices/user";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { selectUser } from "../../store/slices/user";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { selectApiError, setDefaultApiError } from "../../store/slices/apierror";
import './SignUp.scss';


export type SignUpFormType = {
    email: string;
    username: string;
    password: string;
    passwordCheck: string;
};
const initialvalues: SignUpFormType = {
    email: "",
    username: "",
    password: "",
    passwordCheck: "",
}

function SignUp() {
    const authenticated = window.sessionStorage.getItem('isLoggedIn') === "true"

    const userState = useSelector(selectUser);
    const errorState = useSelector(selectApiError);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignUpFormType>(initialvalues);

    const [usernameErrorMsg, setUsernameErrorMsg] = useState<string>("");
    const [passwordErrorMsg, setPasswordErrorMsg] = useState<string>("");
    const [passwordcheckErrorMsg, setPasswordCheckErrorMsg] = useState<string>("");
    const [emailErrorMsg, setEmailErrorMsg] = useState<string>("");
    const [usernameFocus, setUsernameFocus] = useState<boolean>(false);
    const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
    const [passwordcheckFocus, setPasswordCheckFocus] = useState<boolean>(false);
    const [emailFocus, setEmailFocus] = useState<boolean>(true); // autofocus email
    const focusList = [setUsernameFocus, setPasswordFocus, setEmailFocus, setPasswordCheckFocus];

    useEffect(()=>{
        dispatch(setDefaultApiError())
    }, []);

    const signUp = async(formData: SignUpFormType) => {
        await dispatch(setSignUp(formData));
    }

    // const signUp = (formData: SignUpFormType) => {
    //     axios
    //         .post("/user/signup/", formData)
    //         .then(() => {
    //             alert('회원가입 완료');
    //             navigate("/signin")
    //         })
    //         .catch((error) => {
    //             if (error.response.status === 400) {
    //                 alert('해당 username 또는 email로 이미 가입된 사용자입니다');
    //             }
    //         });
    // };

    const onClickInput = (from: string) => {
        focusList.forEach((func) => func(false));
        switch (from) {
            case "email":
                setEmailFocus(true);
                break;
            case "password":
                setPasswordFocus(true);
                break;
            case "passwordCheck":
                setPasswordCheckFocus(true);
                break;
            case "username":
                setUsernameFocus(true);
                break;
        }
    }
    const onChangeFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({
            ...formData,
            [name]: value.trim(),
        });
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {username, email, password, passwordCheck} = formData;
        const {isValid: isValidUsername, message: messageUsername} = checkValidUserName(username);
        const {isValid: isValidEmail, message: messageEmail} = checkValidEmail(email);
        const {isValid: isValidPassword, message: messagePassword} = checkValidPassword(password);
        const {isValid: isValidPasswordCheck, message: messagePasswordCheck} = checkValidPasswordCheck(password, passwordCheck);
        setUsernameErrorMsg(messageUsername);
        setEmailErrorMsg(messageEmail);
        setPasswordErrorMsg(messagePassword);
        setPasswordCheckErrorMsg(messagePasswordCheck);
        if(isValidUsername && isValidEmail && isValidPassword && isValidPasswordCheck){
            console.log("yes");
            signUp(formData);
        }else{
            if (!isValidPasswordCheck){
                const el = document.getElementById("passwordCheck");
                el?.focus();
            }
            if (!isValidPassword){
                const el = document.getElementById("password");
                el?.focus();
            }
            if (!isValidUsername){
                const el = document.getElementById("username");
                el?.focus();
            }
            if (!isValidEmail){
                const el = document.getElementById("email");
                el?.focus();
            }
        }
    }

    const onClickSignInButton = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        navigate("/signin");
    };

    if(authenticated){
        return <Navigate to="/" />;
    }
    return (
        <Container className="SignUp">
            <Row id="header-container">
                <Row id="nowsee-logo-container">
                    <img src="https://nowsee.today/Logo.svg" className="nowsee-logo-image"/>
                </Row>
                <Row id="page-info-container">
                    <Row id="signup-title">Create new Account</Row>
                    <Row className="api-error-message">
                        {(usernameErrorMsg === "" && emailErrorMsg === "" && passwordErrorMsg === "" && passwordcheckErrorMsg === "") && errorState.apiError.msg}
                    </Row>
                </Row>
            </Row>
            <form className="sign-up-form" onSubmit={onSubmit}>
                <span>
                    <div className="icon">
                        <img src="https://nowsee.today/email-icon.svg" className="email-icon"/>
                    </div>
                    <div className={(emailFocus? "focused-": "")+"input-container"}>
                        <input
                            required
                            autoComplete="email"
                            autoFocus
                            type="text"
                            id="email"
                            name="email"
                            value = {formData.email}
                            onChange={onChangeFormData}
                            onFocus={() => onClickInput("email")}
                            onBlur={() => onClickInput("")}
                            placeholder="email"
                        />
                    </div>
                </span>
                <div className="error-message">
                    {emailErrorMsg}
                </div>
                <span>
                    <div className="icon">
                        <svg className="username-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_179_296)">
                            <path d="M7.69925 8.74276C9.77112 8.74276 11.4492 6.95269 11.4492 4.74255C11.4492 2.53245 9.77112 0.742371 7.69925 0.742371C5.62737 0.742371 3.94925 2.53245 3.94925 4.74255C3.94925 6.95269 5.62737 8.74276 7.69925 8.74276Z" fill="black" fill-opacity="0.4"/>
                            <path d="M4.732 10.1643C4.9415 10.1098 5.15637 10.2213 5.2515 10.4277L6.94479 11.7515C7.69925 11.7513 7.69925 11.7515 8.45362 11.7513L10.147 10.4277C10.2421 10.2213 10.457 10.1098 10.6665 10.1643C12.9182 10.7502 15.1992 11.945 15.1992 13.7422V15.7424H0.199249V13.7422C0.199249 11.945 2.48029 10.7502 4.732 10.1643Z" fill="black" fill-opacity="0.4"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_179_296">
                            <rect width="15" height="15" fill="white" transform="translate(0.28714 0.628723)"/>
                            </clipPath>
                            </defs>
                        </svg>
                        {/* <img src="https://nowsee.today/username-icon.svg" className="username-icon"/> */}
                    </div>
                    <div className={(usernameFocus? "focused-": "")+"input-container"}>
                        <input
                            required
                            autoComplete="username"
                            type="text"
                            id="username"
                            name="username"
                            value = {formData.username}
                            onChange={onChangeFormData}
                            onFocus={() => onClickInput("username")}
                            onBlur={() => onClickInput("")}
                            placeholder="username"
                        />
                    </div>
                </span>
                <div className="error-message">
                    {usernameErrorMsg}
                </div>
                <span>
                    <div className="icon">
                        <img src="https://nowsee.today/password-icon.svg" className="password-icon"/>
                    </div>
                    <div className={(passwordFocus? "focused-": "")+"input-container"}>
                        <input
                            required
                            autoComplete="current-password"
                            type="password"
                            id="password"
                            name="password"
                            value = {formData.password}
                            onChange={onChangeFormData}
                            onFocus={() => onClickInput("password")}
                            onBlur={() => onClickInput("")}
                            placeholder="password"
                        />
                    </div>
                </span>
                <div className="error-message">
                    {passwordErrorMsg}
                </div>
                <span>
                    <div className="icon">
                        <img src="https://nowsee.today/password-icon.svg" className="password-icon"/>
                    </div>
                    <div className={(passwordcheckFocus? "focused-": "")+"input-container"}>
                        <input
                            required
                            autoComplete="new-password"
                            type="password"
                            id="passwordCheck"
                            name="passwordCheck"
                            value = {formData.passwordCheck}
                            onChange={onChangeFormData}
                            onFocus={() => onClickInput("passwordCheck")}
                            onBlur={() => onClickInput("")}
                            placeholder="password check"
                        />
                    </div>
                </span>
                <div className="error-message">
                    {passwordcheckErrorMsg}
                </div>
                <div className="button-container">
                    <button
                        type="submit"
                    >Sign up</button>
                    <button
                        id="signin-button"
                        onClick={onClickSignInButton}
                    >
                        Sign In
                    </button>
                </div>
            </form>
        </Container>
    );
}

export default SignUp;
