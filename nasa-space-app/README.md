# Nasa Space App: Figma web export

A clickable web build of the Figma prototype, plus the exported assets.

## Run it

```bash
python -m http.server 8765
```

Open http://127.0.0.1:8765. Serving it over HTTP is more reliable than opening `index.html` directly.

## Folder layout

| Path | Contents |
|---|---|
| `index.html` | The app page |
| `css/styles.css` | Styles, including hover and focus states |
| `js/app.js` | Screen flow, clickable areas and routing (`#/screen`) |
| `js/manifest.js` | File list used by the asset gallery |
| `assets/screens/` | 41 full-frame screens, including `credit-page.png` |
| `assets/components/` | 29 UI pieces (buttons, mood chips, popups) |
| `assets/sprites/` | 17 transparent character sprites (eagles, otters, question bubble) and `_sheet-assets.png`, the full sheet |

## Notes

- Click "Asset gallery" in the toolbar to see every exported image.
- Stats Month/Year tabs are not linked, matching the Figma prototype.
- The "You Died" screen is not linked from any other screen in Figma.
- Sprite file names describe the picture, so match them by hand to the layer names in the app.
