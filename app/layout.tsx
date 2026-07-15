import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/components/shared/providers";
import "@/styles/globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });

export const metadata: Metadata = {
  title: { default: "فلورا ستور", template: "%s | فلورا ستور" },
  description: "متجر فلورا — إكسسوارات، ورود، هدايا، وعطور فاخرة. YOUR STYLE, YOUR STORY",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans`}>
        <Providers>
          {children}
          <Toaster position="top-center" richColors toastOptions={{ style: { fontFamily: "Cairo, sans-serif", direction: "rtl" } }} />
        </Providers>
      </body>
    </html>
  );
}
