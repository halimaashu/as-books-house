import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import "animate.css";
import "./globals.css";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/components/shared/theme-provider";
import WhatsAppContactButton from "@/components/shared/WhatsAppContactButton";

export const metadata = {
  title: {
    default: "AS Books House | A home for every reader",
    template: "%s | AS Books House",
  },
  description:
    "Discover books, explore book details, and find your next favorite read.",
  applicationName: "AS Books House",
  openGraph: {
    title: "AS Books House | A home for every reader",
    description: "Discover books, explore book details, and find your next favorite read.",
    siteName: "AS Books House",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    // <html lang="en" className={` h-full antialiased`}>
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
         <NavBar />
            <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="bg-white text-gray-900 dark:bg-zinc-900 dark:text-gray-100">{children}</main>
            <WhatsAppContactButton />

          </ThemeProvider>
       
        
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
