import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export function PostCreateFormFallback() {
	return (
		<form
			aria-busy="true"
			aria-disabled="true"
			className="grid gap-3"
			onSubmit={(event) => event.preventDefault()}
		>
			<div className="grid gap-2">
				<Label>Post name</Label>
				<Input disabled name="name" placeholder="Post name" readOnly />
			</div>
			<Button disabled type="button">
				Add post
			</Button>
		</form>
	);
}
