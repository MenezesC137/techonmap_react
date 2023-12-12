"use client";
import React from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

interface IAutoComplete {
  destiny?: {
    lat: number;
    lng: number;
    address: string;
  };
  setDestiny: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
      address: string;
    }>
  >;
  map?: boolean;
}

export default function AutoComplete({
  destiny,
  setDestiny,
  map,
}: IAutoComplete) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: string) => {
    setValue(address);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setDestiny({
        lat,
        lng,
        address,
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div>
      {map ? (
        <input
          className="appearance-none border rounded w-[400px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline shadow-xl"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          placeholder="Digite o endereço de chegada!"
        />
      ) : (
        <div className="flex flex-col w-full ">
          <p>Endereço</p>
          <input
            className="h-12 w-full border rounded-lg px-4"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!ready}
          />
        </div>
      )}
      {status === "OK" && (
        <ul className="flex flex-col bg-white w-[400px] rounded-b-md line-clamp-1 cursor-pointer ">
          {data.map(({ description }, id) => (
            <li
              className="p-1 pl-2 hover:bg-gray-100"
              key={id}
              onClick={() => handleSelect(description)}
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
