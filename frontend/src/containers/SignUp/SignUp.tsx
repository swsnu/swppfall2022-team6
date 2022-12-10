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
                    <embed src="/logo.svg" className="nowsee-logo-image"/>
                </Row>
                <Row id="signup-title">Create new Account</Row>
            </Row>
            <form className="sign-up-form" onSubmit={onSubmit}>
                <span>
                    <div className="icon">
                        <embed src="/email-icon.svg" className="email-icon"/>
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
                        <embed src="/username-icon.svg" className="username-icon"/>
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
                        <embed src="/password-icon.svg" className="password-icon"/>
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
                        <embed src="/password-icon.svg" className="password-icon"/>
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
