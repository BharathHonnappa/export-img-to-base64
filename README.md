Export the active note as a single, self-contained markdown file with every
image embed inlined as a base64 data URI one command, one native save
dialog, done.

## Features

- Resolves every image embed in the note (`![[image.png]]` and
  `![alt](image.png)` syntax) via Obsidian's metadata cache
- Inlines each one as a `data:image/<type>;base64,...` URI in place of the
  embed
- Native OS "Save As" dialog, defaults filename to the note's title
- Vault note is never modified only the exported copy is written
- Default hotkey `Ctrl+Alt+B` / `Cmd+Alt+B` (rebindable in Settings → Hotkeys)
- Supports png, jpg/jpeg, gif, webp, bmp, svg

## Why I built this

I use **Obsidian** mostly to prepare writeups for the machines and challenges I solve. I publish these writeups on my website, which uses a 𝗠𝗼𝗻𝗴𝗼𝗗𝗕-𝗯𝗮𝗰𝗸𝗲𝗱 𝗖𝗠𝗦 for storage. Storing images directly in 𝗠𝗼𝗻𝗴𝗼𝗗𝗕 requires a lot of space, and a few images are enough to blow past a 500MB tier.

Therefore, I designed my website to intercept base64 data URIs in uploaded markdown in a public GitHub repo and rewrite the links to a 𝗷𝘀𝗗𝗲𝗹𝗶𝘃𝗿 𝗖𝗗𝗡 𝗨𝗥𝗟 before the markdown ever touches the database.

The missing piece was getting from "writeup with normal image embeds in Obsidian" to "one flat markdown file with base64 inlined" without doing it by hand. So I built a plugin for it.
Hope its useful for y'all.

## Installation

### From Community Plugins 
Settings → Community Plugins → Browse → search "Export as Base64 MD" → Install → Enable.

### Manual / BRAT 
1. Install the [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin.
2. Command palette → `BRAT: Add a beta plugin for testing`.
3. Paste this repo's URL.
4. Enable "Export as Base64 MD" under Installed Plugins.

## Usage

1. Open the writeup you want to export.
2. Run **Export as base64 MD** from the command palette, or press
   `Ctrl+Alt+E`.
3. Pick a destination in the native save dialog.
4. Done a flat `.md` file with all images inlined lands where you chose.

## Notes

- Desktop only uses `@electron/remote` and Node's `fs`, unavailable on mobile.
- Broken/unresolvable embeds are left as-is rather than failing the whole export.

## License

MIT
