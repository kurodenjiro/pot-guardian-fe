import { Fira_Code as FontMono, Inter as FontSans  } from "next/font/google"
import localFont from 'next/font/local'

const pixelMix = localFont({ src: './pixelmix.ttf' })

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const pixelMixFont = pixelMix