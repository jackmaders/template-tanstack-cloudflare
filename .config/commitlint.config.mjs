export default {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"header-match-team-pattern": [2, "always"],
	},
	plugins: [
		{
			rules: {
				"header-match-team-pattern": (parsed) => {
					const hasEmoji = /\p{Extended_Pictographic}/u.test(
						parsed.header || "",
					);
					return [
						hasEmoji,
						"commit message must contain an emoji (e.g. feat: ✨ add feature or fix(auth): 🐛 resolve session issue)",
					];
				},
			},
		},
	],
};
