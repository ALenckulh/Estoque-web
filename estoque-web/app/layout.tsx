import { Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./theme/providers";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Estoque Web",
  icons: {
    icon: "/favicon.ico",
  },
};

export const config = {
  matcher: ["/protected/:path*"],
};

export const montserrat = Montserrat({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="pt-BR" className={montserrat.className} suppressHydrationWarning>
      <body className="bg-background">
        <Providers>
          <main>
            <div>
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
