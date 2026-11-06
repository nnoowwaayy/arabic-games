import type { Metadata } from "next";
import "./platform.css";
import "./refinements.css";
import { PlayerProvider } from '@/components/player-provider';

export const metadata: Metadata = {
  title: "كتر ولا قل — Kter Wla 9el",
  description: "من المغرب، للعالم. ألعاب كتر ولا قل بالدارجة — اختبر معلوماتك وتحدى صحابك.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar-MA" dir="rtl" suppressHydrationWarning>
      <body><PlayerProvider>{children}</PlayerProvider></body>
    </html>
  );
}
