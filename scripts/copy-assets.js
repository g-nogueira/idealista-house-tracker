import { copyFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

async function copyAssets() {
    const assets = [
        ['manifest.json', 'dist/manifest.json'],
        ['src/assets/icon48.png', 'dist/icon48.png'],
        ['src/assets/icon128.png', 'dist/icon128.png']
    ];

    for (const [src, dest] of assets) {
        await mkdir(dirname(dest), { recursive: true });
        await copyFile(src, dest);
    }
}

copyAssets().catch(console.error);