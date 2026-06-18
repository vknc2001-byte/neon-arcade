import fs from 'fs';
import https from 'https';

const url = process.argv[2];

if (!url || !url.includes('gamemonetize.com')) {
    console.error('❌ Error: Please provide a valid GameMonetize JSON feed URL.');
    console.log('Usage: node scripts/import.js "YOUR_GAMEMONETIZE_URL"');
    process.exit(1);
}

console.log(`⏳ Fetching games from: ${url}...`);

https.get(url, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        try {
            const data = JSON.parse(body);
            if (!Array.isArray(data) || data.length === 0) {
                console.error('❌ Error: GameMonetize returned an empty list. Make sure you used the JSON format link from your dashboard.');
                process.exit(1);
            }

            console.log(`✅ Found ${data.length} games! Generating data.ts...`);
            
            let output = `import type { Game } from './types';\n\n`;
            output += `export const CATEGORIES = ['ALL', 'ACTION', 'ARCADE', 'PUZZLE', 'RACING', 'SHOOTING', 'FUN'] as const;\n`;
            output += `export type Category = typeof CATEGORIES[number];\n\n`;
            output += `export const gamesData: Game[] = [\n`;

            data.forEach((game, index) => {
                // Map GameMonetize category to our categories
                let cat = 'ARCADE';
                const gc = game.category.toLowerCase();
                if (gc.includes('action') || gc.includes('fight')) cat = 'ACTION';
                else if (gc.includes('puzzle') || gc.includes('logic')) cat = 'PUZZLE';
                else if (gc.includes('racing') || gc.includes('car') || gc.includes('drive')) cat = 'RACING';
                else if (gc.includes('shoot') || gc.includes('gun') || gc.includes('fps')) cat = 'SHOOTING';
                else if (gc.includes('fun') || gc.includes('casual')) cat = 'FUN';

                // Extract game ID from URL
                const gameId = game.url.split('/').filter(Boolean).pop();
                const title = game.title.replace(/'/g, "\\'");
                const desc = (game.description || '').replace(/'/g, "\\'").replace(/\n/g, " ");
                const instructions = (game.instructions || 'Click or tap to play').replace(/'/g, "\\'").replace(/\n/g, " ");

                output += `  {
    id: '${gameId}',
    title: '${title}',
    description: '${desc}',
    instructions: '${instructions}',
    category: '${cat}',
    image: '${game.thumb}',
    banner: ${index < 3 ? `'${game.thumb}'` : 'undefined'},
    iframeUrl: '${game.url}',
    publisher: '${game.company || 'GameMonetize'}',
    isNew: ${index < 4},
    isHot: ${index > 2 && index < 8},
    gameTags: ['${cat}', 'WEBGL', 'HTML5'],
    controls: 'Mouse/Touch',
  },\n`;
            });

            output += `];\n`;
            
            fs.writeFileSync('./src/data.ts', output);
            console.log(`🎉 SUCCESS! Wrote ${data.length} games directly into src/data.ts!`);
            console.log(`👉 Run 'npm run dev' to see your new games live!`);

        } catch (e) {
            console.error('❌ Error parsing GameMonetize response:', e.message);
        }
    });
}).on('error', (e) => {
    console.error('❌ Error fetching data:', e.message);
});
