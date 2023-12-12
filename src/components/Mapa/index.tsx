"use client";
import React, { useEffect, useState } from "react";

import {
  DirectionsRenderer,
  GoogleMap,
  LoadScriptNext,
  MarkerF,
} from "@react-google-maps/api";
import api_client from "@/config/api_client";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import AutoComplete from "../AutoComplete";

interface IDirections {
  geocoded_waypoints: google.maps.DirectionsGeocodedWaypoint[];
  routes: google.maps.DirectionsRoute[];
  request: google.maps.DirectionsRequest[];
  status: string;
}

export default function Mapa() {
  const { push } = useRouter();
  const { token } = parseCookies();
  const [map, setMap] = useState(false);
  const [directions, setDirections] = useState<IDirections>();
  const [origin, setOrigin] = useState({ lat: 0, lng: 0 });
  const [destiny, setDestiny] = useState({ address: "", lng: 0, lat: 0 });

  useEffect(() => {
    if (!token) return push("/auth/cadastrar");
    handleOrigin();
  }, []);

  async function handleOrigin() {
    api_client
      .get("/user/current", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(({ data }) => {
        setOrigin({ lat: data.lat, lng: data.lng });
      });
  }

  useEffect(() => {
    if (!map) return;
    const directionsService = new google.maps.DirectionsService();
    const destination = destiny.address;

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result) => directionsCallback(result as IDirections)
    );
  }, [map, destiny.address, origin]);

  const directionsCallback = (response: IDirections) => {
    if (response !== null) {
      if (response.status === "OK") {
        setDirections(response);
      } else {
        console.log("response: ", response);
      }
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-10 left-10 z-10">
        {destiny.address ? (
          <p className="appearance-none flex justify-between border rounded w-[400px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline shadow-xl bg-white">
            {destiny.address}{" "}
            <button onClick={() => setDestiny({ address: "", lng: 0, lat: 0 })}>
              X
            </button>
          </p>
        ) : (
          map && <AutoComplete map setDestiny={setDestiny} />
        )}
      </div>
      <LoadScriptNext
        googleMapsApiKey={process.env.NEXT_GOOGLE_GEOLOCATION_API_KEY || ""}
        libraries={["places"]}
      >
        <GoogleMap
          onLoad={() => setMap(true)}
          zoom={15}
          center={origin}
          mapContainerStyle={{
            minHeight: "100vh",
          }}
          options={{
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [
                  {
                    visibility: "off",
                  },
                ],
              },
            ],
          }}
        >
          {destiny.address ? (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#97A276",
                },
              }}
            />
          ) : (
            <MarkerF position={origin} />
          )}
        </GoogleMap>
      </LoadScriptNext>
    </div>
  );
}
