# Export as Base64 MD

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

I write CTF/HTB writeups in Obsidian, screenshots and all, then publish them
on a self-hosted site with a MongoDB-backed CMS. Storing images directly in
MongoDB (or shipping raw base64 in the document) burns through a free-tier
database fast a handful of image-heavy writeups is enough to blow past a
500MB tier.

So the images don't stay in MongoDB at all. My publishing backend intercepts
the base64 data URIs in the uploaded markdown, content-hashes each image
(SHA-256, so the same screenshot never gets uploaded twice), pushes new ones
to a public GitHub repo, and rewrites the links to a jsDelivr CDN URL before
the (now lightweight) markdown ever touches the database.

This plugin is the missing first step in that pipeline: it turns a normal
Obsidian writeup screenshots embedded the normal way into the single
self-contained base64 markdown file my upload endpoint expects, without
manually re-encoding every image by hand. Vault stays fast to write in;
database stays lean; images live on a free CDN instead of counting against
storage quota either way.

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