import axios from "axios";
import { dispatch } from "d3";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../../store/slices/user";

function SignIn() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const login = async({ email, password }: {email: string, password: string}) => {
        axios
            .post("/user/signin/", { email, password })
            .then((res) => {
                console.log(res.data);
                sessionStorage.setItem('isLoggedIn', "true");
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const onClickSignUpButton = () => {
        navigate("/signup");
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login({email, password});
        navigate("/");
    };
    // const onClickSignInButton = () => {
    //     login({email, password})
    //     window.location.reload();
    //     navigate("/")
    // };

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
