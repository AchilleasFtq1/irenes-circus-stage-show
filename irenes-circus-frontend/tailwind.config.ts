import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: "class",
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				rock: {
					black: '#0A0A0A',       // Deep black for backgrounds
					charcoal: '#1A1A1A',    // Dark charcoal
					slate: '#2D2D2D',       // Medium slate
					steel: '#434343',       // Steel gray
					ash: '#6B6B6B',         // Light ash
					rust: '#B85450',        // Rust red/orange
					amber: '#D69E2E',       // Amber/gold
					copper: '#B7791F',      // Copper brown
					bourbon: '#8B4513',     // Bourbon brown
					whiskey: '#A0522D',     // Whiskey tan
					denim: '#1E3A8A',       // Deep denim blue
					smoke: '#9CA3AF',       // Smoke gray
					cream: '#F7FAFC',       // Off-white cream
					bone: '#EDF2F7',        // Bone white
					blood: '#DC2626',       // Blood red
					fire: '#EA580C',        // Fire orange
					lightning: '#F59E0B',   // Lightning yellow
					storm: '#374151',       // Storm gray
				},
				circus: {
					dark: '#1A202C',        // Dark text
					cream: '#F7FAFC',       // Light cream background
					gold: '#D69E2E',        // Gold accent
					red: '#B85450',         // Red accent
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			borderWidth: {
				'3': '3px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'rock-pulse': {
					'0%, 100%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(1.05)', opacity: '0.8' }
				},
				'amp-glow': {
					'0%, 100%': { boxShadow: '0 0 5px #B85450, 0 0 10px #B85450, 0 0 15px #B85450' },
					'50%': { boxShadow: '0 0 10px #B85450, 0 0 20px #B85450, 0 0 30px #B85450' }
				},
				'distortion': {
					'0%': { transform: 'skew(0deg, 0deg)' },
					'25%': { transform: 'skew(0.5deg, 0.2deg)' },
					'50%': { transform: 'skew(-0.5deg, -0.2deg)' },
					'75%': { transform: 'skew(0.2deg, -0.5deg)' },
					'100%': { transform: 'skew(0deg, 0deg)' }
				},
				'feedback': {
					'0%': { transform: 'translateX(0)' },
					'10%': { transform: 'translateX(-2px)' },
					'20%': { transform: 'translateX(2px)' },
					'30%': { transform: 'translateX(-2px)' },
					'40%': { transform: 'translateX(2px)' },
					'50%': { transform: 'translateX(-1px)' },
					'60%': { transform: 'translateX(1px)' },
					'70%': { transform: 'translateX(-1px)' },
					'80%': { transform: 'translateX(1px)' },
					'90%': { transform: 'translateX(-1px)' },
					'100%': { transform: 'translateX(0)' }
				},
				'stage-lights': {
					'0%': { opacity: '0.4', transform: 'scale(0.8)' },
					'50%': { opacity: '1', transform: 'scale(1.2)' },
					'100%': { opacity: '0.4', transform: 'scale(0.8)' }
				},
				'headbang': {
					'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
					'25%': { transform: 'translateY(-8px) rotate(-2deg)' },
					'75%': { transform: 'translateY(-8px) rotate(2deg)' }
				},
				'riff': {
					'0%': { transform: 'translateX(0) rotate(0deg)' },
					'20%': { transform: 'translateX(-3px) rotate(-1deg)' },
					'40%': { transform: 'translateX(3px) rotate(1deg)' },
					'60%': { transform: 'translateX(-2px) rotate(-0.5deg)' },
					'80%': { transform: 'translateX(2px) rotate(0.5deg)' },
					'100%': { transform: 'translateX(0) rotate(0deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'rock-pulse': 'rock-pulse 2s ease-in-out infinite',
				'amp-glow': 'amp-glow 3s ease-in-out infinite',
				'distortion': 'distortion 0.3s ease-in-out',
				'feedback': 'feedback 0.5s ease-in-out',
				'stage-lights': 'stage-lights 4s ease-in-out infinite',
				'headbang': 'headbang 1s ease-in-out infinite',
				'riff': 'riff 2s ease-in-out infinite'
			},
			fontFamily: {
				rock: ['Oswald', 'Impact', 'Arial Black', 'sans-serif'],
				country: ['Merriweather', 'Georgia', 'serif'],
				edgy: ['Bebas Neue', 'Oswald', 'sans-serif'],
				hipster: ['Fira Sans', 'Helvetica', 'sans-serif'],
				vintage: ['Playfair Display', 'Times New Roman', 'serif']
			},
			backgroundImage: {
				'rock-texture': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KPGNpcmNsZSBjeD0iNyIgY3k9IjciIHI9IjEiLz4KPGNpcmNsZSBjeD0iNTMiIGN5PSI3IiByPSIxIi8+CjxjaXJjbGUgY3g9IjciIGN5PSI1MyIgcj0iMSIvPgo8Y2lyY2xlIGN4PSI1MyIgY3k9IjUzIiByPSIxIi8+CjwvZz4KPC9nPgo8L3N2Zz4=')",
				'grunge-overlay': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8ZmlsdGVyIGlkPSJub2lzZSI+CjxmZVR1cmJ1bGVuY2UgYmFzZUZyZXF1ZW5jeT0iMC45IiBudW1PY3RhdmVzPSI0IiByZXN1bHQ9Im5vaXNlIi8+CjxmZUNvbG9yTWF0cml4IGluPSJub2lzZSIgdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPgo8L2ZpbHRlcj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPg==')"
			},
			boxShadow: {
				'rock-inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.6)',
				'amp-glow': '0 0 20px rgba(184, 84, 80, 0.5)',
				'stage-light': '0 0 50px rgba(214, 158, 46, 0.3)'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
