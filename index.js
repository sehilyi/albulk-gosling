import { _compile, _GoslingTemplates } from 'gosling.js/utils';
import { getAlt } from 'altgosling';
import * as fs from "node:fs/promises";

const inDir = process.argv[2];
const outDir = `${inDir}/../alt/`;

const failedFiles = [];

const files = await fs.readdir(inDir);
files.forEach(async (input, i) => {
	if (!input.endsWith('.json')) return;
	const specStr = await fs.readFile(`${inDir}/${input}`, "utf8");
	const spec = JSON.parse(specStr);
	const output = `${outDir}${input.split('.json')[0]}.txt`;
	_compile(spec, async (h, s, ps) => {
		try {
			const alt = getAlt(ps);
			await fs.writeFile(output, alt.fullDescription, err => console.log(err));
		} catch {
			failedFiles.push(input);
		}
		if (i === files.length - 1) {
			await fs.writeFile(`${outDir}failedlist.txt`, failedFiles.join('\n'));
		}
	}, _GoslingTemplates);
});

