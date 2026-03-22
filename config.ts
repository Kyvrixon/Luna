export const config = {
	utils: {
		shuffle,
	},
	colours: {
		parse,
		pastel: {
			red: "FFADAD",
			orange: "FFD6A5",
			yellow: "FDFFB6",
			green: "CAFFBF",
			blue: "9BF6FF",
			indigo: "A0C4FF",
			purple: "BDB2FF",
			pink: "FCC6FF",
			white: "FFFFFC",
		},
	},
};

function parse(input: string, format: "string"): string;
function parse(input: string, format: "number"): number;
function parse(input: string, format: "tuple"): [number, number, number];
function parse(input: string, format: "string" | "number" | "tuple") {
	const r = parseInt(input.slice(0, 2), 16);
	const g = parseInt(input.slice(2, 4), 16);
	const b = parseInt(input.slice(4, 6), 16);

	if (format === "number") return Number(`0x${input}`);
	if (format === "tuple") return [r, g, b] as [number, number, number];
	return input;
}

function shuffle<T = unknown>(array: T[]): T[] {
	const result = [...array];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		// biome-ignore lint/style/noNonNullAssertion: Index is within bounds
		[result[i], result[j]] = [result[j]!, result[i]!];
	}
	return result;
}
