import axios from "axios";
import React, { useEffect, useState } from "react";
import "./ReportModal.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { Slider, TextField } from "@mui/material";
import { PositionType, selectPosition } from "../../store/slices/position";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import {
    selectUser,
    Achievement,
    updateUserAchievements,
} from "../../store/slices/user";
import { addReport } from "../../store/slices/report";
import { addPost } from "../../store/slices/post";
import { ApiErrorCode, selectApiError, setDefaultApiError } from "../../store/slices/apierror";


export interface IProps {
    openReport: boolean;
    setOpenReport: React.Dispatch<React.SetStateAction<boolean>>;
    isNavbarReport: boolean;
    navReportCallback: () => void;
}

function ReportModal({
    openReport,
    setOpenReport,
    isNavbarReport,
    navReportCallback,
}: IProps) {
    const userState = useSelector(selectUser);
    const positionState = useSelector(selectPosition);
    const errorState = useSelector(selectApiError);

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

    const geocoder = new kakao.maps.services.Geocoder();
    const [address, setAddress] = useState<string>("");

    useEffect(()=>{
        dispatch(setDefaultApiError())
      }, []);

    useEffect(() => {
        geocoder.coord2RegionCode(
            positionState.currPosition.lng,
            positionState.currPosition.lat,
            (result, status) => {
                if (
                    status === kakao.maps.services.Status.OK &&
                    !!result[0].address_name
                ) {
                    setAddress(result[0].address_name);
                }
            }
        );
    }, []);

    const report_achievement_handler = async(achievement_types: Achievement[]) => {
        for (const achievement_type of achievement_types) {
            const now = new Date();
            const early_condition =
                achievement_type === Achievement.EARLY && now.getHours() > 9;
            const cloudy_condition =
                achievement_type === Achievement.CLOUDY && weather !== 1;
            if (
                !userState.userBadges[achievement_type - 1].is_fulfilled &&
                !early_condition &&
                !cloudy_condition
            ) {
                await dispatch(
                    updateUserAchievements({
                        id: Number(userState.currUser?.id),
                        type: achievement_type,
                    })
                );
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            user_id: userState.currUser?.id,
            weather: ["Sunny", "Cloudy", "Rain", "Snow"][weather],
            weather_degree: weatherDegree,
            wind_degree: windDegree,
            happy_degree: happyDegree,
            humidity_degree: humidityDegree,
            latitude: positionState.currPosition.lat,
            longitude: positionState.currPosition.lng,
        };
        //@ts-ignore
        const response = await dispatch(addReport(data)); //! 왜 0개의 인수,,,?
        if (errorState.apiError.code === ApiErrorCode.NONE){
            // update Report-Related Achievements
            const achievement_types: Achievement[] = [
                Achievement.FIRST_REPORT,
                Achievement.CLOUDY,
                Achievement.EARLY,
            ];
            report_achievement_handler(achievement_types);
        }
        if (image || content) {
            const formData = new FormData();
            if (image) formData.append("image", image);
            formData.append("content", content);
            formData.append("hashtags", "");
            formData.append("latitude", positionState.currPosition.lat.toString());
            formData.append("longitude", positionState.currPosition.lng.toString());
            formData.append("location", address);
            //@ts-ignore
            await dispatch(addPost(formData));
        }
        if (location.pathname === "/areafeed") {
            setOpenReport(false);
            navReportCallback();
        } else navigate("/areafeed");
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
                            {isNavbarReport ? (
                                <div className="navreport-margin-top"></div>
                            ) : (
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
                            {isNavbarReport ? (
                                <div className="navreport-margin-top"></div>
                            ) : null}
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
                                    <p className="slider-label">Discomfort</p>
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
                            {isNavbarReport ? (
                                <div className="navreport-margin-bottom"></div>
                            ) : (
                                <div style={{ margin: "0px 50px" }}>
                                    <TextField
                                        inputProps={{
                                            "data-testid": "textField",
                                            maxLength: 290,
                                        }}
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
                                        onChange={(e) =>
                                            setContent(e.target.value)
                                        }
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
