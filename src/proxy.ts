import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { credenciales } from "@/lib/supabase/config";

/** Rutas a las que se puede llegar sin haber entrado. */
const PUBLICAS = ["/entrar", "/auth", "/diseno"];

/**
 * En Next 16 esto se llama proxy.ts (antes era middleware.ts).
 * Corre antes de pintar nada: refresca la sesión y, si no hay, manda a /entrar.
 */
export async function proxy(request: NextRequest) {
  const { url, clave } = credenciales();
  let respuesta = NextResponse.next({ request });

  const supabase = createServerClient(url, clave, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(aGuardar, cabeceras) {
        aGuardar.forEach(({ name, value }) => request.cookies.set(name, value));
        respuesta = NextResponse.next({ request });
        aGuardar.forEach(({ name, value, options }) =>
          respuesta.cookies.set(name, value, options),
        );
        // Estas cabeceras impiden que un CDN guarde en caché la sesión
        // de una persona y se la sirva a otra.
        Object.entries(cabeceras).forEach(([clave, valor]) =>
          respuesta.headers.set(clave, valor),
        );
      },
    },
  });

  // Debe llamarse pronto: si la sesión se refresca después de enviar la
  // respuesta, la cookie nueva se pierde.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ruta = request.nextUrl.pathname;
  const esPublica = PUBLICAS.some((p) => ruta === p || ruta.startsWith(`${p}/`));

  if (!user && !esPublica) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/entrar";
    destino.search = "";
    return NextResponse.redirect(destino);
  }

  return respuesta;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
