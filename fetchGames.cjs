const fs = require('fs');
const https = require('https');

const url = 'https://gamemonetize.com/rssfeed.php?format=json&category=All&type=html5&popularity=popular&amount=12';

https.get(url, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        const data = JSON.parse(body);
        
        let output = `import type { Game } from './types';

export const CATEGORIES = ['ALL', 'ACTION', 'ARCADE', 'PUZZLE', 'RACING', 'SHOOTING', 'FUN'] as const;
export type Category = typeof CATEGORIES[number];

export const gamesData: Game[] = [\n`;

        data.forEach((game, index) => {
            // Map category roughly
            let cat = 'ARCADE';
            if (game.category.includes('Action') || game.category.includes('Fighting')) cat = 'ACTION';
            else if (game.category.includes('Puzzle')) cat = 'PUZZLE';
            else if (game.category.includes('Racing') || game.category.includes('Driving')) cat = 'RACING';
            else if (game.category.includes('Shooting')) cat = 'SHOOTING';

            const gameId = game.url.split('/').filter(Boolean).pop(); // Get last part of URL

            output += `  {
    id: '${gameId}',
    title: '${game.title.replace(/'/g, "\\'")}',
    category: '${cat}',
    image: '${game.thumb_2}',
    banner: ${index < 3 ? `'${game.thumb_2}'` : 'undefined'},
    url: 'https://html5.gamemonetize.com/${gameId}/',
    publisher: '${game.company || 'GameMonetize'}',
    isNew: ${index < 3},
    isHot: ${index > 2 && index < 6},
    gameTags: ['${cat}', 'WEBGL', '3D'],
    controls: 'Mouse/Touch',
  },\n`;
        });

        output += `];\n`;
        
        fs.writeFileSync('./src/data.ts', output);
        console.log('Successfully wrote data.ts with GameMonetize games!');
    });
});
