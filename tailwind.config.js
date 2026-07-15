/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        void: {
          DEFAULT: '#050409',
          50: '#0d0b14',
          100: '#0A0912',
          200: '#12101d',
          300: '#1a1828',
          400: '#252233',
          500: '#302d3e',
        },
        thread: {
          DEFAULT: '#E8B96A',
          muted: '#c49248',
          bright: '#f5d08a',
          glow: 'rgba(232,185,106,0.15)',
        },
        stability: {
          DEFAULT: '#4C8CFF',
          muted: '#3370e0',
          bright: '#6ea3ff',
          glow: 'rgba(76,140,255,0.15)',
        },
        decay: {
          DEFAULT: '#E8506A',
          muted: '#c93d56',
          bright: '#f27088',
          glow: 'rgba(232,80,106,0.15)',
        },
        paradox: {
          DEFAULT: '#9D6FE0',
          muted: '#7f54c0',
          bright: '#b893f0',
          glow: 'rgba(157,111,224,0.15)',
        },
        loom: {
          border: 'rgba(232,185,106,0.12)',
          surface: 'rgba(255,255,255,0.03)',
          elevated: 'rgba(255,255,255,0.06)',
          overlay: 'rgba(5,4,9,0.85)',
        },
      },
      backgroundImage: {
        'thread-glow': 'radial-gradient(ellipse at 50% 0%, rgba(232,185,106,0.08) 0%, transparent 60%)',
        'stability-glow': 'radial-gradient(ellipse at 0% 50%, rgba(76,140,255,0.06) 0%, transparent 60%)',
        'void-gradient': 'linear-gradient(135deg, #050409 0%, #0A0912 50%, #080710 100%)',
        'card-shimmer': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
      },
      boxShadow: {
        'thread': '0 0 20px rgba(232,185,106,0.2), 0 0 40px rgba(232,185,106,0.05)',
        'stability': '0 0 20px rgba(76,140,255,0.2), 0 0 40px rgba(76,140,255,0.05)',
        'decay': '0 0 20px rgba(232,80,106,0.2), 0 0 40px rgba(232,80,106,0.05)',
        'paradox': '0 0 20px rgba(157,111,224,0.2), 0 0 40px rgba(157,111,224,0.05)',
        'card': '0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,185,106,0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 4s ease-in-out infinite',
        'scan': 'scan 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
          '25%, 75%': { opacity: '0.95' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(232,185,106,0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(232,185,106,0.35)' },
        },
      },
    },
  },
}
