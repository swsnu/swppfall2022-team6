import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const onClickSignUpButton = () => {
        //navigate("/");
    };
    const onClickSignInButton = () => {};

    return (
        <div className="SignIn">
            <div id="InputContainer">
                <label>
                    Email :{" "}
                    <input
                        id="email-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    Password :{" "}
                    <input
                        id="password-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
            </div>
            <button id="signin-button" onClick={() => onClickSignInButton()}>
                Sign In
            </button>
            <button
                id="signup-button"
                onClick={() => onClickSignUpButton()}
                //disabled={!(email && password)}
            >
                Sign Up
            </button>
        </div>
    );
}

export default SignIn;
