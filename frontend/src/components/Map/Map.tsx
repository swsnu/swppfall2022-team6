import React, { useEffect, useState } from "react";
import { Map, MapMarker, Circle } from "react-kakao-maps-sdk";

type IProps = {
    initPosition: PositionType;
    radius?: number;
}

export type PositionType = {
    lat: number;
    lng: number;
};

function MapComponent(props: IProps) {
    const {initPosition, radius} = props;
    const [markerPosition, setMarkerPosition] = useState<PositionType>(initPosition);
    const [centerPosition, setCenterPosition] = useState<PositionType>(initPosition);
    useEffect(()=>{
        setMarkerPosition(initPosition);
        setCenterPosition(initPosition);
    }, [initPosition]);
    return (
        <Map
            id="map"
            center={centerPosition}
            style={{ width: "100%", height: "500px" }}
            level={5}
            onClick={(_t, mouseEvent) => setMarkerPosition({
                lat: mouseEvent.latLng.getLat(),
                lng: mouseEvent.latLng.getLng(),
            })}>
            {markerPosition && <MapMarker position={markerPosition} />}
            {radius&&
            <Circle
                center={markerPosition}
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
