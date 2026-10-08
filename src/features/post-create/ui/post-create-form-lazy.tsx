import { lazy, type ReactNode, Suspense } from "react";
import type { PostCreateFormProps as FormProps } from "./post-create-form";
import { PostCreateFormFallback } from "./post-create-form-fallback";

const LazyPostCreateForm = lazy(() =>
	import("./post-create-form").then((module) => ({
		default: module.PostCreateForm,
	})),
);

export interface PostCreateFormProps extends FormProps {
	fallback?: ReactNode;
}

export function PostCreateForm({
	fallback = <PostCreateFormFallback />,
	isAuthenticated,
	isSessionPending,
}: PostCreateFormProps) {
	return (
		<Suspense fallback={fallback}>
			<LazyPostCreateForm
				isAuthenticated={isAuthenticated}
				isSessionPending={isSessionPending}
			/>
		</Suspense>
	);
}
