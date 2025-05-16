import './global.css'
import { inter } from '../utils/front/fonts'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <body className={inter.className}>
            <Toaster position="top-center" />
            {children}
         </body>
      </html>
   )
}
