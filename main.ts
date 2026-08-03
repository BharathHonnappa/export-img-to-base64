import { App, Notice, Plugin, TFile } from "obsidian";
import * as fs from "fs";
import * as path from "path";

const MIME_BY_EXT: Record<string, string> = {
	png: "image/png",
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	gif: "image/gif",
	webp: "image/webp",
	bmp: "image/bmp",
	svg: "image/svg+xml",
};

export default class ExportBase64MdPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: "export-as-base64-md",
			name: "Export as base64 MD",
			hotkeys: [{ modifiers: ["Mod", "Alt"], key: "b" }],
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				if (!file || file.extension !== "md") return false;
				if (!checking) {
					this.exportActiveNote(file);
				}
				return true;
			},
		});
	}

	private async exportActiveNote(file: TFile) {
		try {
			const converted = await this.buildInlinedContent(file);
			const savePath = this.showNativeSaveDialog(file.basename);
			if (!savePath) return; // user cancelled

			fs.writeFileSync(savePath, converted, "utf8");
			new Notice(`Exported: ${savePath}`);
		} catch (err: any) {
			console.error("Export as base64 MD failed:", err);
			new Notice("Export failed: " + err.message);
		}
	}

	/** Reads the note, replaces every resolvable image embed with an inline base64 data URI. */
	private async buildInlinedContent(file: TFile): Promise<string> {
		const content = await this.app.vault.read(file);
		const cache = this.app.metadataCache.getFileCache(file);
		const embeds = cache?.embeds ?? [];

		if (embeds.length === 0) return content;

		// Resolve + encode all images first (async), then splice text back-to-front
		// so earlier offsets aren't invalidated by edits to later ones.
		const replacements: { start: number; end: number; text: string }[] = [];

		for (const embed of embeds) {
			const target = this.app.metadataCache.getFirstLinkpathDest(embed.link, file.path);
			if (!target || !(target instanceof TFile)) continue;

			const ext = target.extension.toLowerCase();
			const mime = MIME_BY_EXT[ext];
			if (!mime) continue; // not an image type we handle, leave embed as-is

			const binary = await this.app.vault.readBinary(target);
			const base64 = Buffer.from(binary).toString("base64");
			const alt = target.basename;
			const dataUri = `![${alt}](data:${mime};base64,${base64})`;

			replacements.push({
				start: embed.position.start.offset,
				end: embed.position.end.offset,
				text: dataUri,
			});
		}

		replacements.sort((a, b) => b.start - a.start);

		let result = content;
		for (const r of replacements) {
			result = result.slice(0, r.start) + r.text + result.slice(r.end);
		}
		return result;
	}

	/** Native OS "Save As" dialog via @electron/remote, defaulting to the note's title. */
	private showNativeSaveDialog(defaultBaseName: string): string | null {
		// Required at runtime (desktop-only plugin); keeps esbuild from bundling electron internals.
		const remote = require("@electron/remote");
		const result = remote.dialog.showSaveDialogSync({
			title: "Export as base64 MD",
			defaultPath: `${defaultBaseName}.md`,
			filters: [{ name: "Markdown", extensions: ["md"] }],
		});
		return result ?? null;
	}
}
