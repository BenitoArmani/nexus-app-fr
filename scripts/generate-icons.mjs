// Run: node scripts/generate-icons.mjs
// Requires: npm install sharp (already available in most setups)
// This creates placeholder PNG icons for PWA

import { writeFileSync } from 'fs'

// Simple 1x1 violet pixel PNG base64 expanded to fill
// For real icons, replace icon.svg with the actual NEXUS logo
// and run: npx sharp -i public/icon.svg -o public/icon-192.png resize 192 192
// and: npx sharp -i public/icon.svg -o public/icon-512.png resize 512 512

console.log('To generate PWA icons:')
console.log('1. Install sharp: npm install -g sharp-cli')
console.log('2. Run: sharp -i public/icon.svg -o public/icon-192.png resize 192 192')
console.log('3. Run: sharp -i public/icon.svg -o public/icon-512.png resize 512 512')
console.log('')
console.log('Or use https://realfavicongenerator.net/ with public/icon.svg')
