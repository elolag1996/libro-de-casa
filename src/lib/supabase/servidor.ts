import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { credenciales } from "./config";

/**
 * Cliente para el servidor. Se crea uno nuevo en cada petición: nunca se
 * comparte, o la sesión de una persona podría acabar en la pantalla de otra.
 */
export async function clienteServidor() {
  const { url, clave } = credenciales();
  const almacen = await cookies();

  return createServerClient(url, clave, {
    cookies: {
      getAll() {
        return almacen.getAll();
      },
      setAll(aGuardar) {
        try {
          aGuardar.forEach(({ name, value, options }) => almacen.set(name, value, options));
        } catch {
          // Desde un Server Component no se pueden escribir cookies.
          // No pasa nada: proxy.ts ya refrescó la sesión antes de llegar aquí.
        }
      },
    },
  });
}
