export interface ThemeConfig {
    '--primary': string;
    '--primary-glow': string;
    '--secondary': string;
    '--accent': string;
    '--background': string;
    '--card': string;
    '--border': string;
    '--text': string;
    '--text-muted': string;
    '--gradient-from': string;
    '--gradient-to': string;
}

export interface Theme {
    id: string;
    name: string;
    colors: ThemeConfig;
}

export const themes: Theme[] = [
    {
        id: 'default',
        name: 'Midnight Rose',
        colors: {
            '--primary': '236 72 153',
            '--primary-glow': 'rgba(236, 72, 153, 0.5)',
            '--secondary': '147 51 234',
            '--accent': '244 63 94',
            '--background': '2 2 2',
            '--card': '10 10 10',
            '--border': '255 255 255 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '156 163 175',
            '--gradient-from': '236 72 153',
            '--gradient-to': '147 51 234',
        }
    },
    {
        id: 'emerald-night',
        name: 'Emerald Night',
        colors: {
            '--primary': '16 185 129',
            '--primary-glow': 'rgba(16, 185, 129, 0.5)',
            '--secondary': '5 150 105',
            '--accent': '52 211 153',
            '--background': '2 6 5',
            '--card': '4 15 12',
            '--border': '16 185 129 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '110 231 183',
            '--gradient-from': '16 185 129',
            '--gradient-to': '5 150 105',
        }
    },
    {
        id: 'ocean-depths',
        name: 'Ocean Depths',
        colors: {
            '--primary': '14 165 233',
            '--primary-glow': 'rgba(14, 165, 233, 0.5)',
            '--secondary': '3 105 161',
            '--accent': '56 189 248',
            '--background': '2 4 12',
            '--card': '3 8 20',
            '--border': '14 165 233 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '125 211 252',
            '--gradient-from': '14 165 233',
            '--gradient-to': '3 105 161',
        }
    },
    {
        id: 'crimson-velvet',
        name: 'Crimson Velvet',
        colors: {
            '--primary': '220 38 38',
            '--primary-glow': 'rgba(220, 38, 38, 0.5)',
            '--secondary': '153 27 27',
            '--accent': '248 113 113',
            '--background': '10 0 0',
            '--card': '20 5 5',
            '--border': '220 38 38 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '252 165 165',
            '--gradient-from': '220 38 38',
            '--gradient-to': '153 27 27',
        }
    },
    {
        id: 'royal-indigo',
        name: 'Royal Indigo',
        colors: {
            '--primary': '99 102 241',
            '--primary-glow': 'rgba(99, 102, 241, 0.5)',
            '--secondary': '67 56 202',
            '--accent': '129 140 248',
            '--background': '5 5 15',
            '--card': '10 10 25',
            '--border': '99 102 241 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '165 180 252',
            '--gradient-from': '99 102 241',
            '--gradient-to': '67 56 202',
        }
    },
    {
        id: 'amber-glow',
        name: 'Amber Glow',
        colors: {
            '--primary': '245 158 11',
            '--primary-glow': 'rgba(245, 158, 11, 0.5)',
            '--secondary': '180 83 9',
            '--accent': '251 191 36',
            '--background': '10 7 0',
            '--card': '20 15 5',
            '--border': '245 158 11 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '252 211 77',
            '--gradient-from': '245 158 11',
            '--gradient-to': '180 83 9',
        }
    },
    {
        id: 'cyberpunk-neon',
        name: 'Cyberpunk Neon',
        colors: {
            '--primary': '255 0 255',
            '--primary-glow': 'rgba(255, 0, 255, 0.5)',
            '--secondary': '0 255 255',
            '--accent': '255 255 0',
            '--background': '5 0 10',
            '--card': '15 0 30',
            '--border': '255 0 255 / 0.2',
            '--text': '255 255 255',
            '--text-muted': '255 150 255',
            '--gradient-from': '255 0 255',
            '--gradient-to': '0 255 255',
        }
    },
    {
        id: 'aurora-borealis',
        name: 'Aurora Borealis',
        colors: {
            '--primary': '34 211 238',
            '--primary-glow': 'rgba(34, 211, 238, 0.5)',
            '--secondary': '168 85 247',
            '--accent': '74 222 128',
            '--background': '2 4 10',
            '--card': '5 10 20',
            '--border': '34 211 238 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '165 243 252',
            '--gradient-from': '34 211 238',
            '--gradient-to': '168 85 247',
        }
    },
    {
        id: 'golden-luxury',
        name: 'Golden Luxury',
        colors: {
            '--primary': '234 179 8',
            '--primary-glow': 'rgba(234, 179, 8, 0.5)',
            '--secondary': '161 98 7',
            '--accent': '254 240 138',
            '--background': '10 8 2',
            '--card': '18 15 5',
            '--border': '234 179 8 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '253 224 71',
            '--gradient-from': '234 179 8',
            '--gradient-to': '161 98 7',
        }
    },
    {
        id: 'deep-space',
        name: 'Deep Space',
        colors: {
            '--primary': '79 70 229',
            '--primary-glow': 'rgba(79, 70, 229, 0.5)',
            '--secondary': '49 46 129',
            '--accent': '129 140 248',
            '--background': '0 0 5',
            '--card': '5 5 15',
            '--border': '79 70 229 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '165 180 252',
            '--gradient-from': '79 70 229',
            '--gradient-to': '49 46 129',
        }
    },
    {
        id: 'forest-whisper',
        name: 'Forest Whisper',
        colors: {
            '--primary': '34 197 94',
            '--primary-glow': 'rgba(34, 197, 94, 0.5)',
            '--secondary': '21 128 61',
            '--accent': '74 222 128',
            '--background': '2 8 4',
            '--card': '5 15 8',
            '--border': '34 197 94 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '134 239 172',
            '--gradient-from': '34 197 94',
            '--gradient-to': '21 128 61',
        }
    },
    {
        id: 'slate-modern',
        name: 'Slate Modern',
        colors: {
            '--primary': '71 85 105',
            '--primary-glow': 'rgba(71, 85, 105, 0.5)',
            '--secondary': '30 41 59',
            '--accent': '148 163 184',
            '--background': '15 23 42',
            '--card': '30 41 59',
            '--border': '255 255 255 / 0.05',
            '--text': '255 255 255',
            '--text-muted': '203 213 225',
            '--gradient-from': '71 85 105',
            '--gradient-to': '30 41 59',
        }
    },
    {
        id: 'solar-flare',
        name: 'Solar Flare',
        colors: {
            '--primary': '249 115 22',
            '--primary-glow': 'rgba(249, 115, 22, 0.5)',
            '--secondary': '194 65 12',
            '--accent': '251 146 60',
            '--background': '10 5 0',
            '--card': '25 10 5',
            '--border': '249 115 22 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '253 186 116',
            '--gradient-from': '249 115 22',
            '--gradient-to': '194 65 12',
        }
    },
    {
        id: 'lavender-mist',
        name: 'Lavender Mist',
        colors: {
            '--primary': '168 85 247',
            '--primary-glow': 'rgba(168, 85, 247, 0.5)',
            '--secondary': '126 34 206',
            '--accent': '192 132 252',
            '--background': '10 2 15',
            '--card': '20 5 30',
            '--border': '168 85 247 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '216 180 254',
            '--gradient-from': '168 85 247',
            '--gradient-to': '126 34 206',
        }
    },
    {
        id: 'midnight-teal',
        name: 'Midnight Teal',
        colors: {
            '--primary': '20 184 166',
            '--primary-glow': 'rgba(20, 184, 166, 0.5)',
            '--secondary': '13 148 136',
            '--accent': '45 212 191',
            '--background': '2 10 10',
            '--card': '5 20 20',
            '--border': '20 184 166 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '153 246 245',
            '--gradient-from': '20 184 166',
            '--gradient-to': '13 148 136',
        }
    },
    {
        id: 'orchid-blossom',
        name: 'Orchid Blossom',
        colors: {
            '--primary': '217 70 239',
            '--primary-glow': 'rgba(217, 70, 239, 0.5)',
            '--secondary': '162 28 175',
            '--accent': '232 121 249',
            '--background': '12 2 12',
            '--card': '25 5 25',
            '--border': '217 70 239 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '245 208 254',
            '--gradient-from': '217 70 239',
            '--gradient-to': '162 28 175',
        }
    },
    {
        id: 'electric-violet',
        name: 'Electric Violet',
        colors: {
            '--primary': '139 92 246',
            '--primary-glow': 'rgba(139, 92, 246, 0.5)',
            '--secondary': '109 40 217',
            '--accent': '167 139 250',
            '--background': '8 2 15',
            '--card': '15 5 30',
            '--border': '139 92 246 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '196 181 253',
            '--gradient-from': '139 92 246',
            '--gradient-to': '109 40 217',
        }
    },
    {
        id: 'volcano-ash',
        name: 'Volcano Ash',
        colors: {
            '--primary': '239 68 68',
            '--primary-glow': 'rgba(239, 68, 68, 0.5)',
            '--secondary': '185 28 28',
            '--accent': '248 113 113',
            '--background': '12 10 10',
            '--card': '20 18 18',
            '--border': '239 68 68 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '252 165 165',
            '--gradient-from': '239 68 68',
            '--gradient-to': '185 28 28',
        }
    },
    {
        id: 'northern-sky',
        name: 'Northern Sky',
        colors: {
            '--primary': '56 189 248',
            '--primary-glow': 'rgba(56, 189, 248, 0.5)',
            '--secondary': '2 132 199',
            '--accent': '125 211 252',
            '--background': '2 6 15',
            '--card': '5 12 25',
            '--border': '56 189 248 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '186 230 253',
            '--gradient-from': '56 189 248',
            '--gradient-to': '2 132 199',
        }
    },
    {
        id: 'mystic-nebula',
        name: 'Mystic Nebula',
        colors: {
            '--primary': '124 58 237',
            '--primary-glow': 'rgba(124, 58, 237, 0.5)',
            '--secondary': '219 39 119',
            '--accent': '167 139 250',
            '--background': '5 2 12',
            '--card': '12 5 25',
            '--border': '124 58 237 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '216 180 254',
            '--gradient-from': '124 58 237',
            '--gradient-to': '219 39 119',
        }
    },
    {
        id: 'graphite-pro',
        name: 'Graphite Pro',
        colors: {
            '--primary': '115 115 115',
            '--primary-glow': 'rgba(115, 115, 115, 0.5)',
            '--secondary': '38 38 38',
            '--accent': '163 163 163',
            '--background': '10 10 10',
            '--card': '23 23 23',
            '--border': '255 255 255 / 0.1',
            '--text': '255 255 255',
            '--text-muted': '163 163 163',
            '--gradient-from': '115 115 115',
            '--gradient-to': '38 38 38',
        }
    }
];

export const getThemeById = (id: string): Theme => {
    return themes.find(t => t.id === id) || themes[0];
};
