import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF9F6',
        surface: '#FFFFFF',
        'surface-elevated': '#FFFFFF',
        'surface-muted': '#F4F3EE',
        forest: {
          50: '#F0F7F4',
          100: '#E1EFE9',
          200: '#C2DFD3',
          300: '#94C7B3',
          400: '#5FA98E',
          500: '#3A8C6F',
          600: '#2A7057',
          700: '#1F5844',
          800: '#174435',
          900: '#0E2E23',
          950: '#071A14',
        },
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        charcoal: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#090D16',
        },
        status: {
          supported: '#059669',
          'supported-bg': '#ECFDF5',
          'supported-border': '#A7F3D0',
          partial: '#D97706',
          'partial-bg': '#FFFBEB',
          'partial-border': '#FDE68A',
          inconclusive: '#64748B',
          'inconclusive-bg': '#F8FAFC',
          'inconclusive-border': '#E2E8F0',
          discrepancy: '#DC2626',
          'discrepancy-bg': '#FEF2F2',
          'discrepancy-border': '#FECACA',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)',
        elevated: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;

