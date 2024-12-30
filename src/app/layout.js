import { Nunito_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import ClientWrapper from "./_components/ClientWrapper";
import { Toaster } from "sonner";


const nunitoSans = Nunito_Sans({subsets: ['latin']});


export const metadata = {
  title: "NeuroPad",
  description: "Your personal AI-powered notebook that turns scattered notes into intelligent conversations.",
};


export default function RootLayout({ children }) {
  return (
    <ClerkProvider afterSignOutUrl="/">

      <html lang="en" suppressHydrationWarning>
        
        <body
          className={`${nunitoSans.className} antialiased`}
        >
          <ClientWrapper>

            {children}
            
          </ClientWrapper>

          <Toaster 
            richColors
            position='top-center'
            duration={3000}
          />

        </body>

      </html>

    </ClerkProvider>
  );
}
