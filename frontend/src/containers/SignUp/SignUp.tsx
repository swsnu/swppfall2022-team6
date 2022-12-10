import React, { useState } from "react";
import { isValidUserName, isValidPassword } from "./SignUpUtils";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import './SignUp.scss';

type SignUpFormType = {
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

    const navigate = useNavigate();
    const [formData, setFormData] = useState<SignUpFormType>(initialvalues);

    const signUp = (formData: SignUpFormType) => {
        axios
            .post("/user/signup/", formData)
            .then(() => {
                alert('회원가입 완료');
                navigate("/signin")
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    alert('해당 username 또는 email로 이미 가입된 사용자입니다');
                }
            });
    };

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

        if(isValidUserName(username) && isValidPassword(password, passwordCheck)){
            signUp(formData);
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
                <Row id="signup-title">Create new Account</Row>
            </Row>
            <form className="sign-up-form" onSubmit={onSubmit}>
                <span>
                    <div className="icon">
                        <img src="https://nowsee.today/email-icon.svg" className="email-icon"/>
                    </div>
                    <div className="input-container">
                        <input
                            required
                            autoComplete="email"
                            autoFocus
                            type="text"
                            id="email"
                            name="email"
                            value = {formData.email}
                            onChange={onChangeFormData}
                            placeholder="email"
                        />
                    </div>
                </span>
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
                    <div className="input-container">
                        <input
                            required
                            autoComplete="username"
                            type="text"
                            id="username"
                            name="username"
                            value = {formData.username}
                            onChange={onChangeFormData}
                            placeholder="username"
                        />
                    </div>
                </span>
                <span>
                    <div className="icon">
                        <img src="https://nowsee.today/password-icon.svg" className="password-icon"/>
                    </div>
                    <div className="input-container">
                        <input
                            required
                            autoComplete="current-password"
                            type="password"
                            id="password"
                            name="password"
                            value = {formData.password}
                            onChange={onChangeFormData}
                            placeholder="password"
                        />
                    </div>
                </span>
                <span>
                    <div className="icon">
                        <img src="https://nowsee.today/password-icon.svg" className="password-icon"/>
                    </div>
                    <div className="input-container">
                        <input
                            required
                            autoComplete="new-password"
                            type="password"
                            id="passwordCheck"
                            name="passwordCheck"
                            value = {formData.passwordCheck}
                            onChange={onChangeFormData}
                            placeholder="password check"
                        />
                    </div>
                </span>
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
