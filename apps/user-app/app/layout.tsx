import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "../provider";
import { AppbarClient } from "../components/AppBarClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet",
  description: "Simple wallet app",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <AppbarClient />

          {children}
        </Provider>
      </body>
    </html>
  );
}
