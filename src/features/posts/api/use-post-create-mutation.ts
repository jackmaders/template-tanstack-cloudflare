import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { PostInsert } from "../types/post-types";
import { postCreateServerFn } from "./post-create.functions";
import { postListQueryOptions } from "./post-query-options";

export function usePostCreateMutation() {
	const queryClient = useQueryClient();
	const postCreate = useServerFn(postCreateServerFn);

	return useMutation({
		mutationFn: (data: PostInsert) => postCreate({ data }),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: postListQueryOptions.queryKey,
			}),
	});
}
