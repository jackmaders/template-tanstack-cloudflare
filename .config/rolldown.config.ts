import type { RolldownOptions } from "rolldown";

export const rolldownOptions: RolldownOptions = {
	onwarn(warning) {
		throw new Error(warning.message);
	},
	output: {
		codeSplitting: {
			groups: [{ name: "zod", test: /node_modules\/zod/ }],
		},
	},
};
