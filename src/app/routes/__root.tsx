import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { NotFoundPage } from "@/pages/not-found";
import appCss from "../styles/index.css?inline";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		head: () => ({
			meta: [
				{
					charSet: "utf-8",
				},
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
				{
					name: "description",
					content: "A minimal TanStack Start and Cloudflare template.",
				},
				{
					title: "TanStack Start + Cloudflare Starter",
				},
			],
			links: [
				{
					rel: "icon",
					href: "/favicon.svg",
					type: "image/svg+xml",
				},
			],
		}),
		shellComponent: RootDocument,
		notFoundComponent: NotFoundPage,
	},
);

function RootDocument({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		document.documentElement.dataset.hydrated = "true";
	}, []);

	return (
		<html lang="en">
			<head>
				<HeadContent />
				<style>{appCss}</style>
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
