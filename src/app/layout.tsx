import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Rural STEM Opportunity Finder",
  description: "Helping students in rural communities discover STEM scholarships, internships, and programs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppProvider>
            <Navbar />
            <main>
              {children}
            </main>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
