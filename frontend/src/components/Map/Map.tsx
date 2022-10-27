import React, { useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

// const Geocoder = kakao.maps.services.Geocoder;

type PositionType = {
    lat: number;
    lng: number;
};
const markerPosition: PositionType = {lat: 37.44877599087201, lng: 126.95264777802309}
const centerPosition: PositionType = {lat: 37.4586330265914, lng: 126.95252853624115}

function MapComponent() {
    // const geocoder = new  kakao.maps.services.Geocoder();
    // geocoder.addressSearch(initAddress, function(result, status) {
    //     // 정상적으로 검색이 완료됐으면 
    //      if (status === kakao.maps.services.Status.OK) {
    //         geoPosition = {lat: +result[0].y, lng: +result[0].x}
    //      }
    // }); 

    const [position, setPosition] = useState<PositionType>(markerPosition)
    return (
        <>
        <Map
            center={centerPosition}
            style={{ width: "100%", height: "600px" }}
            level={5}
            onClick={(_t, mouseEvent) => setPosition({
                lat: mouseEvent.latLng.getLat(),
                lng: mouseEvent.latLng.getLng(),
            })}
        >
            {position && <MapMarker position={position} />}
        </Map>
        {position && <p>{'클릭한 위치의 위도는 ' + position.lat + ' 이고, 경도는 ' + position.lng + ' 입니다'}</p>}
        </>
    );
}

export default MapComponent;
