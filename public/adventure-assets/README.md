# Adventure video assets

Add 5–15 images here for the homework adventure video (same aspect ratio, e.g. 16:9).
Update `manifest.json` to map subject/topic to filenames.

- **math**: e.g. math-castle.jpg, numbers-path.jpg
- **reading**: e.g. book-forest.jpg
- **default**: used when subject does not match (sparki-default.svg is included as fallback)

All assets must be generic, non-personal (no child photos). The video worker picks images by subject/topic from this manifest.

## Squad / whole-team characters

To feature your whole teaching team in the adventure story and video:

- Add character image files to this folder (e.g. `sparki-default.svg`, `luna.svg`, `max.svg`).
- Define the squad in `squad.json` as an array of objects:

```json
[
  { "name": "Sparki", "file": "sparki-default.svg" },
  { "name": "Luna", "file": "luna.svg" }
]
```

- The homework adventure API will tell the model to weave all listed names into the story.
- The video worker will, when enabled, use squad images as slides (one character per step, cycling through the list).
