import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Github, Linkedin } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Mood-Fi | Cine Edition",
  description: "Find the perfect movie based on your mood. Syncs with your Letterboxd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <AppProvider>
          <div className="flex flex-col min-h-screen relative pb-16">
            <div className="flex-grow">
              {children}
            </div>
            {/* Footer */}
            <footer className="absolute bottom-4 right-6 flex items-center gap-4 text-gray-500">
              <a 
                href="https://github.com/ivxniso" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://linkedin.com/in/ivxniso" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#0077b5] transition-colors flex items-center gap-2"
              >
                <Linkedin size={20} />
              </a>
            </footer>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
