// app/layout.tsx (Server Component)
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "./client-providers";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Stocky",
  icons: { icon: "/favicon.ico" },
};

export const montserrat = Montserrat({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={montserrat.className} suppressHydrationWarning>
      <body className="bg-background">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}