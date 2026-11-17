"use client";

import { useState } from "react";
import { clienteNavegador } from "@/lib/supabase/navegador";

type Estado = { tipo: "quieto" } | { tipo: "enviando" } | { tipo: "enviado" } | { tipo: "error"; mensaje: string };

export default function Formulario() {
  const [estado, setEstado] = useState<Estado>({ tipo: "quieto" });

  async function pedirEnlace(datos: FormData) {
    const email = String(datos.get("email") ?? "").trim();
    if (!email) return;

    setEstado({ tipo: "enviando" });
    try {
      const supabase = clienteNavegador();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/confirmar` },
      });
      if (error) throw error;
      setEstado({ tipo: "enviado" });
    } catch (fallo) {
      setEstado({
        tipo: "error",
        mensaje: fallo instanceof Error ? fallo.message : "No se pudo enviar el enlace.",
      });
    }
  }

  if (estado.tipo === "enviado") {
    return (
      <p role="status" className="mt-4 text-sm">
        Mira tu correo: te hemos mandado un enlace para entrar. Se abre una sola vez.
      </p>
    );
  }

  return (
    <form action={pedirEnlace} className="mt-4 flex flex-col gap-3">
      <label className="label" htmlFor="email">
        Tu correo
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="tucorreo@ejemplo.com"
        className="w-full rounded-sm border-[1.5px] border-ink bg-paper px-3 py-2.5 text-base"
      />
      <button type="submit" className="btn" disabled={estado.tipo === "enviando"}>
        {estado.tipo === "enviando" ? "Enviando…" : "Mandarme el enlace"}
      </button>
      {estado.tipo === "error" && (
        <p role="alert" className="text-sm text-tomato">
          {estado.mensaje}
        </p>
      )}
    </form>
  );
}
