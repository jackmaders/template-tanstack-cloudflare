import { account, rateLimit, session, user, verification } from "./schema/auth";
import { postRelations, posts } from "./schema/posts";

export { account, rateLimit, session, user, verification } from "./schema/auth";
export { postRelations, posts } from "./schema/posts";

export const schema = {
	account,
	rateLimit,
	session,
	user,
	verification,
	posts,
	...postRelations,
};
