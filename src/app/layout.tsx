import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/shared/provider";

const montseratt = Montserrat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body className={montseratt.className}>
          <main>
            {children}
            <Toaster expand={true} richColors />
          </main>
        </body>
      </html>
    </Providers>
  );
}
