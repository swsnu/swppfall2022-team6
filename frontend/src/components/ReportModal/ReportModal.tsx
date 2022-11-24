import axios from "axios";
import React, { useState } from "react";
import "./ReportModal.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { Slider, TextField } from "@mui/material";
import { PositionType } from "../../store/slices/position";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { selectUser } from "../../store/slices/user";
import { addReport } from "../../store/slices/report";
import { addPost } from "../../store/slices/post";

export interface IProps {
    currPosition: PositionType;
    openReport: boolean;
    setOpenReport: React.Dispatch<React.SetStateAction<boolean>>;
    isNavbarReport: boolean;
    navReportCallback: () => void;
}

function ReportModal({ currPosition, openReport, setOpenReport, isNavbarReport, navReportCallback }: IProps) {
    const userState = useSelector(selectUser);

    const [content, setContent] = useState<string>("");
    const [image, setImage] = useState<File>();
    const [weather, setWeather] = useState<number>(0);
    const [weatherDegree, setWeatherDegree] = useState<number>(0);
    const [windDegree, setWindDegree] = useState<number>(0);
    const [happyDegree, setHappyDegree] = useState<number>(0);
    const [humidityDegree, setHumidityDegree] = useState<number>(0);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            user_id: userState.currUser?.id,
            weather: ["Sunny", "Cloudy", "Rain", "Snow"][weather],
            weather_degree: weatherDegree,
            wind_degree: windDegree,
            happy_degree: happyDegree,
            humidity_degree: humidityDegree,
            latitude: currPosition.lat,
            longitude: currPosition.lng,
        };
        //@ts-ignore
        await dispatch(addReport(data)); //! 왜 0개의 인수,,,?
        if (image || content) {
            const formData = new FormData();
            if (image) formData.append("image", image);
            formData.append("content", content);
            formData.append("hashtags", "");
            //@ts-ignore
            await dispatch(addPost(formData));
        }
        if (location.pathname === "/areafeed/"){
            setOpenReport(false);
            navReportCallback();
        }
        else navigate("/areafeed/");
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files) setImage(e.target.files[0]);
    };

    return (
        <div className={openReport ? "reportModal modal" : "modal"}>
            {openReport ? (
                <section>
                    <header style={{ display: "flex", fontSize: "15px" }}>
                        Report
                        <button
                            data-testid="closeButton"
                            className="close-button"
                            onClick={() => setOpenReport(false)}
                        >
                            X
                        </button>
                    </header>
                    <main>
                        <form onSubmit={handleSubmit}>
                            {isNavbarReport? null : (
                                <p id="photo-container">
                                    <span id="photo-label">📷 Add Photo</span>
                                    <input
                                        id="photo-input image"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={handleImageChange}
                                        style={{
                                            paddingLeft: "75px",
                                            fontSize: "9px",
                                        }}
                                        data-testid="fileUploader"
                                    />
                                </p>
                            )}
                            <div id="weather-select-container">
                                <button
                                    className={
                                        weather === 0
                                            ? "weather-selected-button"
                                            : "weather-select-button"
                                    }
                                    type="button"
                                    onClick={() => setWeather(0)}
                                >
                                    ☀️ Sunny
                                </button>
                                <button
                                    className={
                                        weather === 1
                                            ? "weather-selected-button"
                                            : "weather-select-button"
                                    }
                                    type="button"
                                    onClick={() => setWeather(1)}
                                >
                                    ☁️ Cloudy
                                </button>
                                <button
                                    className={
                                        weather === 2
                                            ? "weather-selected-button"
                                            : "weather-select-button"
                                    }
                                    type="button"
                                    onClick={() => setWeather(2)}
                                >
                                    ☔ Rain
                                </button>
                                <button
                                    className={
                                        weather === 3
                                            ? "weather-selected-button"
                                            : "weather-select-button"
                                    }
                                    type="button"
                                    onClick={() => setWeather(3)}
                                >
                                    ❄️ Snow
                                </button>
                            </div>
                            <div>
                                <div className="slider-container">
                                    <p
                                        className="slider-label"
                                        data-testid="weatherP"
                                    >
                                        {
                                            ["Sunny", "Cloudy", "Rain", "Snow"][
                                                weather
                                            ]
                                        }
                                    </p>
                                    <Slider
                                        aria-label="weather_degree"
                                        value={weatherDegree}
                                        size="small"
                                        onChange={(
                                            _event: Event,
                                            value: number | number[]
                                        ) => setWeatherDegree(value as number)}
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={0}
                                        max={5}
                                    />
                                </div>
                                <div className="slider-container">
                                    <p className="slider-label">Wind</p>
                                    <Slider
                                        aria-label="wind_degree"
                                        value={windDegree}
                                        size="small"
                                        onChange={(
                                            _event: Event,
                                            value: number | number[]
                                        ) => setWindDegree(value as number)}
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={0}
                                        max={5}
                                    />
                                </div>
                                <div className="slider-container">
                                    <p className="slider-label">Happy</p>
                                    <Slider
                                        aria-label="happy_degree"
                                        value={happyDegree}
                                        size="small"
                                        onChange={(
                                            _event: Event,
                                            value: number | number[]
                                        ) => setHappyDegree(value as number)}
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={0}
                                        max={5}
                                    />
                                </div>
                                <div className="slider-container">
                                    <p className="slider-label">Humidity</p>
                                    <Slider
                                        aria-label="humidity_degree"
                                        value={humidityDegree}
                                        size="small"
                                        onChange={(
                                            _event: Event,
                                            value: number | number[]
                                        ) => setHumidityDegree(value as number)}
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={0}
                                        max={5}
                                    />
                                </div>
                            </div>
                            {isNavbarReport? null : (
                                <div style={{ margin: "0px 50px" }}>
                                    <TextField
                                        inputProps={{ "data-testid": "textField" }}
                                        id="standard-basic"
                                        variant="standard"
                                        placeholder="Add Text"
                                        size="small"
                                        multiline
                                        fullWidth
                                        margin="normal"
                                        value={content}
                                        maxRows={5}
                                        spellCheck={false}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </div>
                            )}
                            <p>
                                <input
                                    type="submit"
                                    id="submit-button"
                                    value="Submit!"
                                />
                            </p>
                        </form>
                    </main>
                </section>
            ) : null}
        </div>
    );
}

export default ReportModal;
