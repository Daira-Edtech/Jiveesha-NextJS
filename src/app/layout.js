import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata = {
  title: "Jiveesha",
  description:
    "Jiveesha is an intelligent educational platform for children's learning and assessments.",
  keywords: [
    "Jiveesha",
    "education",
    "learning",
    "child development",
    "AI assessment",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <QueryProvider>
          <LanguageProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
