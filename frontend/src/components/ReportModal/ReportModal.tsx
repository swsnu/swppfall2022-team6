import axios from "axios";
import React, { useState } from "react";
import "./ReportModal.scss";
import { useNavigate } from "react-router-dom";
import { Slider, TextField } from "@mui/material";

interface IProps {
    openReport: boolean;
    setOpenReport: React.Dispatch<React.SetStateAction<boolean>>;
}

function ReportModal({ openReport, setOpenReport }: IProps) {
    const [content, setContent] = useState<string>("");
    const [image, setImage] = useState<File>();
    const [weather, setWeather] = useState<number>(0);
    const [weatherDegree, setWeatherDegree] = useState<number>(0);
    const [windDegree, setWindDegree] = useState<number>(0);
    const [happyDegree, setHappyDegree] = useState<number>(0);
    const [humidityDegree, setHumidityDegree] = useState<number>(0);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            weather: ["Sunny", "Cloudy", "Rain", "Snow"][weather],
            weather_degree: weatherDegree,
            wind_degree: windDegree,
            happy_degree: happyDegree,
            humidity_degree: humidityDegree,
        };
        axios
            .post("/report/", data)
            .then(() => {
                if (image || content) {
                    const formData = new FormData();
                    if (image) formData.append("image", image);
                    formData.append("content", content);
                    formData.append("hashtags", "");

                    axios.post("/post/", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                }
            })
            .then(() => navigate("/areafeed/"));
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
                            <p id="photo-container">
                                <span id="photo-label">📷 Add Photo</span>
                                <input
                                    id="photo-input image"
                                    type="file"
                                    accept="image/png, image/jpeg/"
                                    onChange={handleImageChange}
                                    style={{
                                        paddingLeft: "75px",
                                        fontSize: "9px",
                                    }}
                                    data-testid="fileUploader"
                                />
                            </p>
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
