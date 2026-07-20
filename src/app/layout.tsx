import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import AppWrapper from "@/components/AppWrapper";

export const metadata: Metadata = {
  title: "Mariam Zaid | Full Stack Developer",
  description:
    "Personal portfolio showcasing my projects, skills, and experience.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <AppWrapper>{children}</AppWrapper>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}