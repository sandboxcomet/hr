import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "../globals.css";
import { Shell } from "@/components/Shell";
import { Toaster } from "@/components/ui/sonner";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "HR System - Employee Management",
  description: "Comprehensive HR management system for modern businesses",
};

const locales = ['en', 'th'];

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
  
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${notoSansThai.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Shell>{children}</Shell>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
