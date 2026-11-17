import { createBrowserClient } from "@supabase/ssr";
import { credenciales } from "./config";

/** Cliente para lo que ocurre en el navegador (pedir el enlace mágico). */
export function clienteNavegador() {
  const { url, clave } = credenciales();
  return createBrowserClient(url, clave);
}
