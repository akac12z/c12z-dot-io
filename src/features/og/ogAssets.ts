import fs from "node:fs";
import path from "node:path";

/**
 * Assets compartidos por los 3 templates OG (fuentes + fondo + logo).
 * Se leen una sola vez por proceso de build y se reutilizan en cada endpoint.
 */

const root = process.cwd();
const read = (relativePath: string) =>
	fs.readFileSync(path.join(root, relativePath));

export const tamagoFont = read("src/assets/fonts/Tamago.ttf");
export const cascadiaFont = read("src/assets/fonts/CascadiaCode-Medium.ttf");

const toPngDataUri = (buffer: Buffer) =>
	`data:image/png;base64,${buffer.toString("base64")}`;

export const backgroundDataUri = toPngDataUri(
	read("src/assets/images/OpenGraph/og-templates/og-bg-template.png"),
);
export const logoDataUri = toPngDataUri(
	read("src/assets/images/OpenGraph/og-templates/og-logo-template.png"),
);
