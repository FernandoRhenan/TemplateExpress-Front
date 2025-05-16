import { Inter, Roboto_Mono, Open_Sans } from 'next/font/google'

export const inter = Inter({
   subsets: ['latin'],
   weight: ['400'],
})

const roboto_mono = Roboto_Mono({
   subsets: ['latin'],
   weight: ['400'],
})

const open_sans = Open_Sans({
   subsets: ['latin'],
   weight: ['400'],
})

export const fontsArray = [
   { name: 'Inter', font: inter },
   { name: 'Roboto Mono', font: roboto_mono },
   { name: 'Open Sans', font: open_sans },
]
