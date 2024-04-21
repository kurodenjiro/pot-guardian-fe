import "@/styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';


import type { Metadata } from 'next';
import { Providers } from "./providers";
import { pixelMixFont } from '@/config/fonts';
import clsx from "clsx";

export const metadata: Metadata = {
  title: 'POT GUARDIAN',
  description: 'Tree Pot RPG battle',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={clsx("antialiased", pixelMixFont.className)}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
