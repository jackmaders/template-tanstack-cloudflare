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
