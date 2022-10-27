import React, { useState } from "react";
import { Map, MapMarker, Circle } from "react-kakao-maps-sdk";

type IProps = {
    radius?: number;
}

type PositionType = {
    lat: number;
    lng: number;
};
const markerPosition: PositionType = {lat: 37.44877599087201, lng: 126.95264777802309}; // 서울대 중심
const centerPosition: PositionType = {lat: 37.4586330265914, lng: 126.95252853624115}; // 302 건물

function MapComponent(props: IProps) {
    const {radius} = props;
    const [position, setPosition] = useState<PositionType>(markerPosition)
    return (
        <Map
            center={centerPosition}
            style={{ width: "100%", height: "600px" }}
            level={5}
            onClick={(_t, mouseEvent) => setPosition({
                lat: mouseEvent.latLng.getLat(),
                lng: mouseEvent.latLng.getLng(),
            })}>
            {position && <MapMarker position={position} />}
            {radius&&
            <Circle
                center={position}
                radius={(radius/25+1)*1000}
                strokeWeight={5} // 선의 두께입니다
                strokeColor={"#75B8FA"} // 선의 색깔입니다
                strokeOpacity={0} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                strokeStyle={"dash"} // 선의 스타일 입니다
                fillColor={"#0000FF"} // 채우기 색깔입니다
                fillOpacity={0.1} // 채우기 불투명도 입니다
            />}
        </Map>
    );
}

export default MapComponent;
