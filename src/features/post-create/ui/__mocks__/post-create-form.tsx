export function PostCreateForm({
	isAuthenticated,
	isSessionPending,
}: {
	isAuthenticated: boolean;
	isSessionPending: boolean;
}) {
	return (
		<div
			data-authenticated={String(isAuthenticated)}
			data-session-pending={String(isSessionPending)}
			data-testid="real-post-create-form"
		>
			Loaded Post Create Form
		</div>
	);
}
