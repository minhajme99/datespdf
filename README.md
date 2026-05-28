# DatesPDF - Free Online PDF Tools

A comprehensive, browser-based PDF toolkit similar to PDF24. All processing happens locally in the browser — no files are uploaded to any server.

## Working Tools

- **Merge PDF** — Combine multiple PDF files into one
- **Split PDF** — Extract specific pages from a PDF
- **Compress PDF** — Reduce PDF file size
- **Rotate PDF** — Rotate pages by 90°, 180°, or 270°
- **Images to PDF** — Create PDF from JPG/PNG images

## Coming Soon

- PDF Converter, PDF to Images, Word/Excel/PPT to PDF
- Webpage to PDF, Remove/Extract/Rearrange Pages
- Protect, Unlock, Sign, Watermark, Redact, OCR

## Tech Stack

- **HTML5 / CSS3 / Vanilla JavaScript** — No frameworks
- **[pdf-lib](https://pdf-lib.js.org/)** — Client-side PDF processing
- **Font Awesome 6** — Icons
- **Google Fonts (Inter)** — Typography

## Project Structure

```
datespdf/
├── index.html          # Main landing page with all tool cards
├── css/style.css       # Shared styles
├── js/
│   ├── main.js         # Navigation, search, mobile menu
│   └── pdf-tools.js    # Shared PDF tool utilities
├── tools/
│   ├── merge.html      # Merge PDF (working)
│   ├── split.html      # Split PDF (working)
│   ├── compress.html   # Compress PDF (working)
│   ├── rotate.html     # Rotate PDF (working)
│   ├── images-to-pdf.html  # Images to PDF (working)
│   └── ...             # Other tools (coming soon)
└── README.md
```

## Getting Started

```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

## License

MIT
