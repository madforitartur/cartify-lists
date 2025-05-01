
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
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
				// Custom colors for our shopping app
				cartify: {
					primary: '#8B5CF6',
					secondary: '#D6BCFA',
					accent1: '#F2FCE2',
					accent2: '#FEF7CD',
					dark: '#1A1F2C',
					light: '#F6F6F7'
				},
				// Category colors
				category: {
					fruits: '#F97316',
					dairy: '#0EA5E9',
					cleaning: '#8B5CF6',
					bakery: '#D946EF',
					meat: '#F43F5E',
					beverages: '#10B981',
					default: '#64748B'
				},
				// Theme colors
				purple: {
					'500': '#8B5CF6',
					'600': '#7C3AED'
				},
				orange: {
					'500': '#F97316',
					'600': '#EA580C'
				},
				blue: {
					'500': '#0EA5E9',
					'600': '#0284C7'
				},
				green: {
					'500': '#10B981',
					'600': '#059669'
				},
				red: {
					'500': '#F43F5E',
					'600': '#E11D48'
				},
				pink: {
					'500': '#EC4899',
					'600': '#DB2777'
				},
				teal: {
					'500': '#14B8A6',
					'600': '#0D9488'
				},
				indigo: {
					'500': '#6366F1',
					'600': '#4F46E5'
				},
				// New colors
				yellow: {
					'500': '#EAB308',
					'600': '#CA8A04'
				},
				lime: {
					'500': '#84CC16',
					'600': '#65A30D'
				},
				emerald: {
					'500': '#10B981',
					'600': '#059669'
				},
				cyan: {
					'500': '#06B6D4',
					'600': '#0891B2'
				},
				sky: {
					'500': '#0EA5E9',
					'600': '#0284C7'
				},
				violet: {
					'500': '#8B5CF6',
					'600': '#7C3AED'
				},
				fuchsia: {
					'500': '#D946EF',
					'600': '#C026D3'
				},
				rose: {
					'500': '#F43F5E',
					'600': '#E11D48'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'slide-in': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
