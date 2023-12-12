"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import mapa from "../../../assets/mapa.png";
import Input from "../../../components/Input";
import api_client from "@/config/api_client";
import { setCookie } from "nookies";
import { useRouter } from "next/navigation";
import { useJsApiLoader } from "@react-google-maps/api";
import AutoComplete from "@/components/AutoComplete";

export default function AuthPage() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_GOOGLE_GEOLOCATION_API_KEY as string,
    libraries: ["places"],
  });
  const { push } = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState({ address: "", lng: 0, lat: 0 });
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const res = fetch(`/api/google-places-autocomplete?q=${address.address}`);

    console.log(res);
  }, [address]);

  async function handleRegister() {
    if (user.password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    if (!user.name || !user.email || !user.password) {
      alert("Preencha todos os campos!");
      return;
    }

    api_client
      .post("/user/register", {
        name: user.name,
        email: user.email,
        password: user.password,
        fullAddress: address.address,
        lat: address.lat,
        lng: address.lng,
        street: "",
        city: "",
        state: "",
        country: "",
      })
      .then(({ data }) => {
        setCookie(null, "token", data.token, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
        push("/");
      });
  }

  return (
    <main className="flex flex-row overflow-hidden w-screen h-screen">
      <Image
        className="w-4/6 object-cover"
        src={mapa}
        alt="mapa Logo"
        width={1000}
        height={1000}
      />
      <div className="flex flex-col items-center justify-center gap-2 h-full px-6 w-2/6">
        <h1 className="text-xl font-semibold">TECH ON MAP 🌎</h1>
        <h2 className="text-base font-semibold">
          Cadastrar no seu GPS simplificado!
        </h2>
        <div className="flex flex-col w-full 6 gap-2">
          <Input
            type="text"
            label="Nome"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
          <Input
            type="text"
            label="Email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <Input
            type="password"
            label="Senha"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <Input
            type="password"
            label="Confirmação de senha"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {isLoaded && <AutoComplete setDestiny={setAddress} />}
        </div>
        <button
          onClick={() => handleRegister()}
          className="w-full text-white bg-[#97A276] rounded-md h-12"
        >
          Cadastrar
        </button>
        <div>
          <p className="text-sm">
            Já tem conta?{" "}
            <span
              onClick={() => push("/auth/entrar")}
              className="text-[#97A276] cursor-pointer"
            >
              Entrar
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
