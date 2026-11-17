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

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    fallo = error?.message ?? null;
  } else if (tokenHash && tipo) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: tipo });
    fallo = error?.message ?? null;
  } else {
    fallo = "El enlace no traía los datos necesarios.";
  }

  const destino = request.nextUrl.clone();
  destino.search = "";

  if (fallo) {
    destino.pathname = "/entrar";
    // El motivo no se pone en la URL: solo una marca para enseñar un aviso.
    destino.searchParams.set("fallo", "1");
    return NextResponse.redirect(destino);
  }

  destino.pathname = "/";
  return NextResponse.redirect(destino);
}
