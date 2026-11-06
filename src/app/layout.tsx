import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";

export const metadata: Metadata = {
  title: "kwaraLGTracker | Kwara State LGA Allocation Tracker",
  description: "Explore Federal Government allocation records for all Local Government Areas in Kwara State. Access transparent financial data, monthly distributions, and historical records.",
  keywords: "Kwara State, LGA allocation, FAAC, government transparency, local government, Nigeria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
