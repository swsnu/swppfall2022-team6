import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const [email, setEmail] = useState<string>("");
    const [userName, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const onClickSignUpButton = () => {
        navigate("/");
    };
    const onClickSignInButton = () => {
        navigate("/signin");
    };

    return (
        <div className="SignUp">
            <div id="input-container">
                <label>
                    Email :{" "}
                    <input
                        id="email-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    Username :{" "}
                    <input
                        id="username-input"
                        value={userName}
                        onChange={(e) => setUsername(e.target.value)}
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
            <button
                id="signup-button"
                onClick={onClickSignUpButton}
                //disabled={!(email && userName && password)}
            >
                Sign Up
            </button>
            <button id="signin-button" onClick={onClickSignInButton}>
                Sign In
            </button>
        </div>
    );
}

export default SignUp;
