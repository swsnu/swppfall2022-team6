import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Map, MapMarker, Circle, CustomOverlayMap } from "react-kakao-maps-sdk";
import SkimStatistics from "../SkimStatistics/SkimStatistics";

import { PositionType, selectPosition } from "../../store/slices/position";

interface IProps {
    markerPosition: PositionType;
    setMarkerPosition: React.Dispatch<React.SetStateAction<PositionType>>;
    radius: number;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
}

function MapComponent(props: IProps) {
    const { markerPosition, setMarkerPosition, radius, isOpen, setIsOpen } =
        props;
    const [centerPosition, setCenterPosition] =
        useState<PositionType>(markerPosition);

    const [windowSize, setWindowSize] = useState(getWindowSize());

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    useEffect(() => {
        setCenterPosition(markerPosition);
    }, [markerPosition]);
    const mapWidth = windowSize.innerWidth>1300? "80%": "100%";
    const mapHeight = windowSize.innerWidth>1300? "80vh": "60vh";
    return (
        <Map
            id="map"
            center={centerPosition}
            style={{ width: mapWidth, height: mapHeight, borderRadius: "12px" }}
            level={5}
            onClick={(_t, mouseEvent) => {
                setMarkerPosition({
                    lat: mouseEvent.latLng.getLat(),
                    lng: mouseEvent.latLng.getLng(),
                });
                setIsOpen(false);
            }}
        >
            {markerPosition && (
                <MapMarker
                    position={markerPosition}
                    onClick={() => {
                        setIsOpen(true);
                        setCenterPosition(markerPosition);
                    }}
                />
            )}
            {isOpen && (
                <CustomOverlayMap
                    position={markerPosition}
                    xAnchor={0.587}
                    yAnchor={1.075}
                >
                    <SkimStatistics
                        position={markerPosition}
                        radius={radius / 25}
                    />
                    ;
                </CustomOverlayMap>
            )}
            {radius > 0 ? (
                <Circle
                    center={markerPosition}
                    radius={(radius / 25) * 1000}
                    strokeWeight={5} // ?????? ???????????????
                    strokeColor={"#75B8FA"} // ?????? ???????????????
                    strokeOpacity={0} // ?????? ???????????? ????????? 1?????? 0 ????????? ????????? 0??? ??????????????? ???????????????
                    strokeStyle={"dash"} // ?????? ????????? ?????????
                    fillColor={"#0000FF"} // ????????? ???????????????
                    fillOpacity={0.1} // ????????? ???????????? ?????????
                />
            ) : null}
        </Map>
    );
}

export default MapComponent;
