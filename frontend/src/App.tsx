import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import MainPage from "./containers/MainPage/MainPage";
import SignUp from "./containers/SignUp/SignUp";
import SignIn from "./containers/SignIn/SignIn";
import MyPage from "./containers/MyPage/MyPage";
import MyBadges from "./containers/MyBadges/MyBadges";
import PostDetail from "./containers/PostDetail/PostDetail";
import AreaFeed from "./containers/AreaFeed/AreaFeed";
import PrivateRoute from './PrivateRoute';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/signup" element={<SignUp />}></Route>
                    <Route path="/signin" element={<SignIn />}></Route>
                    <Route
                        path="/"
                        element={<PrivateRoute/>}
                    >
                        <Route path="/areafeed" element={<AreaFeed />}></Route>
                        <Route
                            path="/areafeed/:id"
                            element={<PostDetail />}
                        ></Route>
                        <Route path="/mypage" element={<MyPage />}></Route>
                        <Route path="/mypage/badges" element={<MyBadges />}></Route>
                        <Route path="/" element={<MainPage />}></Route>
                    </Route>
                    {/* <Route path="/" element={<MainPage />}></Route> */}
                    <Route
                        path="*"
                        element={<Navigate replace to="/" />}
                    ></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
