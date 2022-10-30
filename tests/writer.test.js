import { writer, nameByUrl, nameByHeader } from '../esm/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import rimraf from 'rimraf';

const generatedFileContents = 'Generated by @static-pages/file-provider test runner. This file can be deleted safely.';
const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'output');

afterEach(() => {
	rimraf.sync(outDir);
});

test('it writes a simple data object to file with a renderer', async () => {
	const write = writer({
		namer: [nameByUrl, nameByHeader].map(f => f(outDir + '/')),
		renderer: data => data.body,
	});

	await write({
		header: { path: 'path/to/file1.txt' },
		body: generatedFileContents,
	});

	await write({
		header: { path: 'path/to/file2.txt' },
		url: 'file2',
		body: generatedFileContents,
	});

	const expectedPath1 = path.join(outDir, 'path/to/file1.html');
	expect(fs.existsSync(expectedPath1)).toEqual(true);
	expect(fs.readFileSync(expectedPath1, 'utf-8')).toEqual(generatedFileContents);

	const expectedPath2 = path.join(outDir, 'file2.html');
	expect(fs.existsSync(expectedPath2)).toEqual(true);
	expect(fs.readFileSync(expectedPath2, 'utf-8')).toEqual(generatedFileContents);
});