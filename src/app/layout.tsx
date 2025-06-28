import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import ReduxProvider from "../store/Provider";
import AppContent from "../components/AppContent";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Goal Tracker",
  description: "Track your personal goals easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <ReduxProvider>
          <AuthProvider>
            <AppContent>{children}</AppContent>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
