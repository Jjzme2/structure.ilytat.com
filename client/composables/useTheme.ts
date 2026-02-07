export const useTheme = () => {

    const themes = {
        default: {
            name: 'HQ Default',
            class: 'theme-default',
            category: 'Standard',
            colors: ['slate', 'modern', 'pro']
        },
        executive: {
            name: 'Executive',
            class: 'theme-executive',
            category: 'Standard',
            colors: ['indigo', 'blue', 'deep']
        },
        midnight: {
            name: 'Midnight',
            class: 'theme-midnight',
            category: 'Standard',
            colors: ['black', 'slate', 'dark']
        },
        mono: {
            name: 'Mono',
            class: 'theme-mono',
            category: 'Standard',
            colors: ['white', 'black', 'grey']
        },
        frost: {
            name: 'Frost',
            class: 'theme-frost',
            category: 'Glass',
            colors: ['cyan', 'blue', 'icy']
        },
        ether: {
            name: 'Ether',
            class: 'theme-ether',
            category: 'Glass',
            colors: ['purple', 'violet', 'ethereal']
        },
        deepSpace: {
            name: 'Deep Space',
            class: 'theme-deep-space',
            category: 'Abstract',
            colors: ['black', 'blue', 'void']
        },
        sunset: {
            name: 'Sunset',
            class: 'theme-sunset',
            category: 'Abstract',
            colors: ['orange', 'red', 'warm']
        },
        nature: {
            name: 'Nature',
            class: 'theme-nature',
            category: 'Abstract',
            colors: ['green', 'emerald', 'organic']
        },
        nebula: {
            name: 'Nebula',
            class: 'theme-nebula',
            category: 'Abstract',
            colors: ['purple', 'pink', 'cosmic']
        },
        aurora: {
            name: 'Aurora',
            class: 'theme-aurora',
            category: 'Abstract',
            colors: ['green', 'cyan', 'northern']
        },
        solaris: {
            name: 'Solaris',
            class: 'theme-solaris',
            category: 'Abstract',
            colors: ['yellow', 'amber', 'bright']
        },
        cyber: {
            name: 'Cyber Neon',
            class: 'theme-cyber',
            category: 'Abstract',
            colors: ['pink', 'blue', 'neon']
        },
        matrix: {
            name: 'Digital Matrix',
            class: 'theme-matrix',
            category: 'Abstract',
            colors: ['green', 'black', 'digital']
        },
        deepsea: {
            name: 'Deep Sea',
            class: 'theme-deepsea',
            category: 'Abstract',
            colors: ['blue', 'cyan', 'abyssal']
        },
        midnightRose: {
            name: 'Midnight Rose',
            class: 'theme-midnight-rose',
            category: 'Abstract',
            colors: ['pink', 'black', 'rose']
        },
        ops: {
            name: 'Field Ops',
            class: 'theme-ops',
            category: 'Technical',
            colors: ['green', 'olive', 'tactical']
        },
        obsidian: {
            name: 'Obsidian',
            class: 'theme-obsidian',
            category: 'Technical',
            colors: ['black', 'stone', 'sharp']
        },
        titanium: {
            name: 'Titanium',
            class: 'theme-titanium',
            category: 'Technical',
            colors: ['grey', 'silver', 'metal']
        },
        blueprint: {
            name: 'Blueprint',
            class: 'theme-blueprint',
            category: 'Technical',
            colors: ['blue', 'white', 'sketch']
        },
        nordic: {
            name: 'Nordic',
            class: 'theme-nordic',
            category: 'Technical',
            colors: ['blue', 'grey', 'cold']
        },
        crimson: {
            name: 'Crimson',
            class: 'theme-crimson',
            category: 'Classic',
            colors: ['red', 'blood', 'rich']
        },
        royal: {
            name: 'Royal Blue',
            class: 'theme-royal',
            category: 'Classic',
            colors: ['blue', 'gold', 'regal']
        },
        emerald: {
            name: 'Emerald',
            class: 'theme-emerald',
            category: 'Classic',
            colors: ['green', 'jewel', 'vibrant']
        },
        vintage: {
            name: 'Vintage',
            class: 'theme-vintage',
            category: 'Classic',
            colors: ['amber', 'brown', 'retro']
        },
        arcticFlare: {
            name: 'Arctic Flare',
            class: 'theme-arctic-flare',
            category: 'Glass',
            colors: ['cyan', 'violet', 'arctic']
        },
        solarFlare: {
            name: 'Solar Flare',
            class: 'theme-solar-flare',
            category: 'Glass',
            colors: ['amber', 'yellow', 'solar']
        },
        midnightAurora: {
            name: 'Midnight Aurora',
            class: 'theme-midnight-aurora',
            category: 'Glass',
            colors: ['green', 'purple', 'aurora']
        },
        velvetNebula: {
            name: 'Velvet Nebula',
            class: 'theme-velvet-nebula',
            category: 'Glass',
            colors: ['violet', 'pink', 'nebula']
        },
        goldenHour: {
            name: 'Golden Hour',
            class: 'theme-golden-hour',
            category: 'Glass',
            colors: ['peach', 'gold', 'sunset']
        },
        oceanicAbyss: {
            name: 'Oceanic Abyss',
            class: 'theme-oceanic-abyss',
            category: 'Glass',
            colors: ['teal', 'navy', 'marine']
        },
        forestMist: {
            name: 'Forest Mist',
            class: 'theme-forest-mist',
            category: 'Glass',
            colors: ['emerald', 'slate', 'mist']
        },
        rubyHorizon: {
            name: 'Ruby Horizon',
            class: 'theme-ruby-horizon',
            category: 'Glass',
            colors: ['red', 'pink', 'horizon']
        },
        silverStream: {
            name: 'Silver Stream',
            class: 'theme-silver-stream',
            category: 'Glass',
            colors: ['grey', 'blue', 'metal']
        },
        neonDrift: {
            name: 'Neon Drift',
            class: 'theme-neon-drift',
            category: 'Glass',
            colors: ['purple', 'cyan', 'neon']
        },
        neonDriftV2: {
            name: 'Neon Drift V2',
            class: 'theme-neon-drift-v2',
            category: 'Glass',
            colors: ['purple', 'cyan', 'vibrant']
        },
        crimsonTide: {
            name: 'Crimson Tide',
            class: 'theme-crimson-tide',
            category: 'Abstract',
            colors: ['red', 'black', 'deep']
        },
        azureGlaze: {
            name: 'Azure Glaze',
            class: 'theme-azure-glaze',
            category: 'Glass',
            colors: ['blue', 'sky', 'soft']
        },
        emeraldGlow: {
            name: 'Emerald Glow',
            class: 'theme-emerald-glow',
            category: 'Glass',
            colors: ['green', 'emerald', 'vibrant']
        },
        sunsetPeak: {
            name: 'Sunset Peak',
            class: 'theme-sunset-peak',
            category: 'Abstract',
            colors: ['orange', 'magenta', 'warm']
        },
        midnightSpark: {
            name: 'Midnight Spark',
            class: 'theme-midnight-spark',
            category: 'Abstract',
            colors: ['navy', 'silver', 'sparkle']
        },
        violetRay: {
            name: 'Violet Ray',
            class: 'theme-violet-ray',
            category: 'Glass',
            colors: ['violet', 'purple', 'intense']
        },
        cyberPunk: {
            name: 'Cyber Punk',
            class: 'theme-cyber-punk',
            category: 'Abstract',
            colors: ['yellow', 'pink', 'neon']
        },
        arcticFrost: {
            name: 'Arctic Frost',
            class: 'theme-arctic-frost',
            category: 'Glass',
            colors: ['white', 'blue', 'ice']
        },
        deepForest: {
            name: 'Deep Forest',
            class: 'theme-deep-forest',
            category: 'Abstract',
            colors: ['green', 'moss', 'dark']
        }
    }

    const currentTheme = useState('theme', () => 'default')

    const applyTheme = (themeName: string) => {
        if (!themes[themeName as keyof typeof themes]) return

        const root = document.documentElement

        // Remove existing theme classes
        Object.values(themes).forEach(t => {
            root.classList.remove(t.class)
        })

        // Add new theme class
        root.classList.add(themes[themeName as keyof typeof themes].class)
        currentTheme.value = themeName

        // Persist to local storage
        localStorage.setItem('hq-theme', themeName)
    }

    const initTheme = () => {
        const savedTheme = localStorage.getItem('hq-theme')
        if (savedTheme && themes[savedTheme as keyof typeof themes]) {
            applyTheme(savedTheme)
        } else {
            applyTheme('default')
        }
    }

    return {
        themes,
        currentTheme,
        applyTheme,
        initTheme
    }
}
