import type { SubmitEvent } from "react";
import { useCallback, useId, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { usePostCreateMutation } from "../api/use-post-create-mutation";

export interface PostCreateFormProps {
	isAuthenticated: boolean;
	isSessionPending: boolean;
}

export function PostCreateForm({
	isAuthenticated,
	isSessionPending,
}: PostCreateFormProps) {
	const postNameId = useId();
	const { isPending, mutateAsync } = usePostCreateMutation();
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = useCallback(
		async (event: SubmitEvent<HTMLFormElement>) => {
			event.preventDefault();
			const form = event.currentTarget;
			const name = new FormData(form).get("name");
			if (typeof name !== "string" || !name.trim()) {
				return;
			}

			if (isSessionPending) {
				return;
			}

			if (!isAuthenticated) {
				setError("Sign in to create a post.");
				return;
			}

			setError(null);
			try {
				await mutateAsync({ name });
				form.reset();
			} catch {
				setError("Sign in to create a post.");
			}
		},
		[isAuthenticated, isSessionPending, mutateAsync],
	);

	return (
		<>
			<form className="grid gap-3" onSubmit={handleSubmit}>
				<div className="grid gap-2">
					<Label htmlFor={postNameId}>Post name</Label>
					<Input id={postNameId} name="name" placeholder="Post name" required />
				</div>
				<Button disabled={isPending || isSessionPending} type="submit">
					{isPending ? "Adding..." : "Add post"}
				</Button>
			</form>
			{error ? (
				<p
					aria-live="polite"
					className="mt-2 text-destructive text-sm"
					role="alert"
				>
					{error}
				</p>
			) : null}
		</>
	);
}
