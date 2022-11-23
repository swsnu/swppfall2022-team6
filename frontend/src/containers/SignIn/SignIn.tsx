import axios from "axios";
import { dispatch } from "d3";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { setLogin } from "../../store/slices/user";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";

function SignIn() {
    const authenticated = window.sessionStorage.getItem('isLoggedIn') === "true"

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const login = async() => {
        console.log("login")
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        console.log(email, password)
        console.log(formData)
        await dispatch(setLogin(formData));
    };

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
        <div className="SignIn">
            <form className="login-form" onSubmit={onSubmit}>
                <input
                    required
                    autoComplete="username"
                    autoFocus
                    type="text"
                    id="email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    placeholder="Email"
                />
                <input
                    required
                    autoComplete="current-password"
                    type="password"
                    id="password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value.trim())}
                    placeholder="Password"
                />
                <button type="submit">Sign In</button>
                <button
                    id="signup-button"
                    onClick={onClickSignUpButton}
                    //disabled={!(email && password)}
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default SignIn;
