import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body-var",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-headline-var",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sondage Jeux Éducatifs",
  description: "Sondage pour mieux comprendre les besoins dans l'éducation et comment les jeux éducatifs peuvent y répondre.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-on-background font-body">
        {children}
      </body>
    </html>
  );
}
