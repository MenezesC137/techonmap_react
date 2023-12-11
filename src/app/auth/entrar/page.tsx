"use client";
import Image from "next/image";
import React, { useState } from "react";

import mapa from "../../../assets/mapa.png";
import Input from "../../../components/Input";

import { useRouter } from "next/navigation";

export default function PageSingIn() {
  const { push } = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

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
          Entre no seu GPS simplificado!
        </h2>
        <div className="flex flex-col w-full 6 gap-2">
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
        </div>
        <button
          onClick={() => push("/auth/cadastrar")}
          className="w-full text-white bg-[#97A276] rounded-md h-12"
        >
          Entrar
        </button>
        <div>
          <p className="text-sm">
            Não tem conta?{" "}
            <span
              onClick={() => push("/auth/cadastrar")}
              className="text-[#97A276] cursor-pointer"
            >
              Cadastre-se
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
