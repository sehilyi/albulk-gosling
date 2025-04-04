import { _compile } from 'gosling.js/compiler';
import { getAlt } from 'altgosling/utils';
import * as fs from "node:fs/promises";

const inDir = process.argv[2];
const outDirAltGosling = `${inDir}/../alt/altgosling/`;
const outDirProcessed = `${inDir}/../alt/processedspec/`;

const failedFiles = [];

const files = await fs.readdir(inDir);
files.forEach(async (input, i) => {
	if (!input.endsWith('.json')) return;
	const specStr = await fs.readFile(`${inDir}/${input}`, "utf8");
	const spec = JSON.parse(specStr);
	const outputProcessed = `${outDirProcessed}${input}`;
	const outputAltGosling = `${outDirAltGosling}${input.split('.json')[0]}.txt`;
	_compile(spec, async (h, s, ps) => {
		try {
			await fs.writeFile(outputProcessed, JSON.stringify(ps), err => console.log(err));
			const alt = getAlt(ps, true);
			await fs.writeFile(outputAltGosling, alt.fullDescription, err => console.log(err));
		} catch {
			failedFiles.push(input);
		}
		if (i === files.length - 1) {
			console.log("Failed files: ", failedFiles);
		}
	});
});

