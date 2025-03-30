import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Todo App",
  description: "Supabase와 Next.js로 만든 Todo 앱",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-h-screen`}>
        <Providers>
          <Navbar className="container" />
          <main className="container">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
