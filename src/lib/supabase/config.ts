/**
 * Las dos claves viven solo en .env.local (y en Vercel). Si faltan, mejor
 * un error claro en español que un fallo raro más adelante.
 */
function obligatoria(nombre: string, valor: string | undefined) {
  if (!valor) {
    throw new Error(
      `Falta ${nombre}. Cópiala de Supabase (Project Settings → API) a tu archivo .env.local.`,
    );
  }
  return valor;
}

export function credenciales() {
  return {
    url: obligatoria("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    clave: obligatoria("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  };
}
