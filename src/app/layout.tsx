import type { Metadata } from "next";
import { Barlow_Condensed, Kalam, Literata, Young_Serif } from "next/font/google";
import "./globals.css";

const youngSerif = Young_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-young-serif",
});

const literata = Literata({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-literata",
});

const kalam = Kalam({
  weight: ["300", "400"],
  subsets: ["latin"],
  variable: "--font-kalam",
});

const barlow = Barlow_Condensed({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "A ojo",
  description: "Tu libro de recetas de casa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${youngSerif.variable} ${literata.variable} ${kalam.variable} ${barlow.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
