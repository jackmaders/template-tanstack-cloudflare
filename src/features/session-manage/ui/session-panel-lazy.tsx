import { lazy, type ReactNode, Suspense } from "react";
import { SessionPanelFallback } from "./session-panel-fallback";

const LazySessionPanel = lazy(() =>
	import("./session-panel").then((module) => ({
		default: module.SessionPanel,
	})),
);

export interface SessionPanelProps {
	fallback?: ReactNode;
	isPending: boolean;
	user?: { email: string; name: string };
}

export function SessionPanel({
	isPending,
	fallback = <SessionPanelFallback />,
	user,
}: SessionPanelProps) {
	return (
		<Suspense fallback={fallback}>
			<LazySessionPanel isPending={isPending} user={user} />
		</Suspense>
	);
}
