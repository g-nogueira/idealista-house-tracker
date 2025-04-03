![Idealista House Tracker](src/assets/icon128.png)

# Idealista House Tracker

A Chrome extension for tracking and managing house listings from Idealista.pt. Built with Svelte, TypeScript, and Tailwind CSS.

## Features

- Save house listings directly from Idealista pages
- View saved properties with key details (price, area, energy certificate, etc.)
- Export/Import listings to/from CSV format
- Quick access to saved properties through the extension popup
- Visual thumbnails and direct links to property pages

## Development

### Prerequisites

- Node.js 18+
- npm/pnpm/yarn
- Chrome browser

### Setup

```bash
# Clone the repository
git clone [repository-url]
cd idealista-house-tracker

# Install dependencies
npm install
```

### Development Commands

```bash
# Build extension
npm run build

# Build extension in development mode
npm run build:dev

# Run tests
npm run test

# Run unit tests in watch mode
npm run test:unit

# Run e2e tests
npm run test:e2e

# Format code
npm run format

# Lint code
npm run lint
```

### Project Structure

```
src/
├── background/       # Chrome extension background scripts
├── content-script/   # Content scripts injected into web pages
├── lib/             # Shared utilities and types
├── popup/           # Extension popup UI components
└── routes/          # SvelteKit routes (for development)
```

### Loading the Extension

1. Build the extension: `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist` directory

### Key Files

- [manifest.json](manifest.json) - Extension configuration
- [src/lib/service.ts](src/lib/service.ts) - House data extraction logic
- [src/lib/storage.ts](src/lib/storage.ts) - Chrome storage management
- [src/popup/Popup.svelte](src/popup/Popup.svelte) - Main popup UI

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.