INSERT INTO posts (name)
SELECT 'Welcome to your new TanStack Start + Cloudflare project!'
WHERE NOT EXISTS (
	SELECT 1 FROM posts
	WHERE name = 'Welcome to your new TanStack Start + Cloudflare project!'
);

INSERT INTO posts (name)
SELECT 'This sample post demonstrates Drizzle ORM + D1 integration.'
WHERE NOT EXISTS (
	SELECT 1 FROM posts
	WHERE name = 'This sample post demonstrates Drizzle ORM + D1 integration.'
);

INSERT INTO user (id, name, email, email_verified, role, created_at, updated_at)
VALUES (
	'seed-admin-user-id',
	'Admin Operator',
	'admin@example.com',
	1,
	'admin',
	cast(unixepoch('subsecond') * 1000 as integer),
	cast(unixepoch('subsecond') * 1000 as integer)
)
ON CONFLICT(email) DO UPDATE SET
	name = excluded.name,
	email_verified = excluded.email_verified,
	role = excluded.role,
	updated_at = excluded.updated_at;

INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
SELECT
	'seed-admin-account-id',
	user.id,
	'credential',
	user.id,
	'4cab2d8d7dcdb06a67bafcb263e4caef:b37f0de3d95938407b724b7e8ba7cd717dd29da15ea2c59cecde422df7ae0ae1d39e1601430cd7ea2de98d9fa78cd632513247b0b7c1203ebac3de587ed1c8ea',
	cast(unixepoch('subsecond') * 1000 as integer),
	cast(unixepoch('subsecond') * 1000 as integer)
FROM user
WHERE user.email = 'admin@example.com'
	AND NOT EXISTS (
		SELECT 1 FROM account
		WHERE account.user_id = user.id AND account.provider_id = 'credential'
	);
