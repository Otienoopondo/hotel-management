import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // ✅ Import toaster

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hotel Management System",
  description: "Manage hotels efficiently with Admin, Staff, and Client interfaces",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Font Awesome CDN for social media icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-papErUqA38D3uE8cmz/CvNShKeKXQ1DkP1vylzHsb+SLsy3ewwEK5A2XeE2kJX0OvYcNSKjI8v+bZGzyX28Uyw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-800`}
      >
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} /> {/* ✅ Toast container */}
        {children}
      </body>
    </html>
  );
}
