import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ki Pahare DigiGuide - Digital Museum Collection",
  description: "Explore historical treasures and ancient artifacts with our digital museum guide",
  other: {
    'permissions-policy': 'camera=*, microphone=*',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${lora.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
