import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Darija translate",
  description: "Translate from spanish to darija and Vice versa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-bg text-typography tracking-wider p-4`}
      >
        {children}
      </body>
    </html>
  );
}
