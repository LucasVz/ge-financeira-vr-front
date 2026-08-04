/** @format */

import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
});

export const metadata: Metadata = {
	title: "Clínica Rebeca Vaz | Gestão Financeira",
	description:
		"Painel de controle financeiro para gestão de entradas, saídas e relatórios da clínica.",
	generator: "v0.app",
};

export const viewport: Viewport = {
	colorScheme: "light",
	themeColor: "#ffffff",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="pt-BR"
			className={`light bg-background ${geistSans.variable} ${geistMono.variable}`}
		>
			<body className="font-sans antialiased">
				<Providers>
					<AppShell>{children}</AppShell>
				</Providers>
				{process.env.NODE_ENV === "production" && <Analytics />}
			</body>
		</html>
	);
}
