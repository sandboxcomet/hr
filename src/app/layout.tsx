import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR System - Employee Management",
  description: "Comprehensive HR management system for modern businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
