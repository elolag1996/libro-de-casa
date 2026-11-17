import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { clienteServidor } from "@/lib/supabase/servidor";

/**
 * Aquí aterriza el clic del enlace del correo. Supabase puede mandar dos
 * formas distintas según la plantilla del email, así que se aceptan las dos.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const tipo = searchParams.get("type") as EmailOtpType | null;

  const supabase = await clienteServidor();

  let fallo: string | null = null;
  // Supabase puede rechazar el enlace antes de llegar aquí y avisar en la
  // dirección. El motivo se traduce a una palabra nuestra; el texto en
  // inglés de Supabase no se le enseña a nadie.
  const rechazo = searchParams.get("error_code");
  if (rechazo) {
    const destinoError = request.nextUrl.clone();
    destinoError.search = "";
    destinoError.pathname = "/entrar";
    destinoError.searchParams.set("fallo", rechazo === "otp_expired" ? "caducado" : "invalido");
    return NextResponse.redirect(destinoError);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    fallo = error?.message ?? null;
  } else if (tokenHash && tipo) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: tipo });
    fallo = error?.message ?? null;
  } else {
    fallo = "El enlace no traía los datos necesarios.";
  }

  if (fallo && process.env.NODE_ENV !== "production") {
    // Solo en desarrollo, y solo a la consola del servidor: ayuda a ver por
    // qué falla la entrada sin enseñarle nada de esto a quien usa la app.
    const galletas = (await import("next/headers")).cookies;
    const nombres = (await galletas()).getAll().map((c) => c.name);
    console.error("[entrar] no se pudo canjear:", fallo);
    console.error("[entrar] cookies que llegaron:", nombres.join(", ") || "(ninguna)");
  }

  const destino = request.nextUrl.clone();
  destino.search = "";

  if (fallo) {
    destino.pathname = "/entrar";
    // El motivo no se pone en la URL: solo una marca para enseñar un aviso.
    destino.searchParams.set("fallo", "invalido");
    return NextResponse.redirect(destino);
  }

  destino.pathname = "/";
  return NextResponse.redirect(destino);
}
