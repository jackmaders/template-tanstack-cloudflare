import type { RolldownOptions } from "rolldown";

export const rolldownOptions: RolldownOptions = {
	onwarn(warning) {
		throw new Error(
			`Build warning encountered: ${warning.message}${
				warning.plugin ? ` (plugin: ${warning.plugin})` : ""
			}`,
		);
	},
	output: {
		codeSplitting: {
			groups: [{ name: "zod", test: /node_modules\/zod/ }],
		},
	},
};
