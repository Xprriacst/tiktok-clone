/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#1E40AF', // Deep blue (primary) - blue-800
        'primary-50': '#EFF6FF', // Very light blue - blue-50
        'primary-100': '#DBEAFE', // Light blue - blue-100
        'primary-500': '#3B82F6', // Medium blue - blue-500
        'primary-600': '#2563EB', // Darker blue - blue-600
        'primary-700': '#1D4ED8', // Dark blue - blue-700
        
        // Secondary Colors
        'secondary': '#7C3AED', // Vibrant purple (secondary) - violet-600
        'secondary-50': '#F5F3FF', // Very light purple - violet-50
        'secondary-100': '#EDE9FE', // Light purple - violet-100
        'secondary-500': '#8B5CF6', // Medium purple - violet-500
        'secondary-600': '#7C3AED', // Purple - violet-600
        'secondary-700': '#6D28D9', // Dark purple - violet-700
        
        // Accent Colors
        'accent': '#10B981', // Fresh green (accent) - emerald-500
        'accent-50': '#ECFDF5', // Very light green - emerald-50
        'accent-100': '#D1FAE5', // Light green - emerald-100
        'accent-500': '#10B981', // Green - emerald-500
        'accent-600': '#059669', // Darker green - emerald-600
        
        // Background Colors
        'background': '#FAFBFC', // Soft off-white (background) - slate-50
        'surface': '#FFFFFF', // Pure white (surface) - white
        
        // Text Colors
        'text-primary': '#1F2937', // Rich dark gray (text primary) - gray-800
        'text-secondary': '#6B7280', // Medium gray (text secondary) - gray-500
        
        // Status Colors
        'success': '#059669', // Deeper green (success) - emerald-600
        'success-50': '#ECFDF5', // Light success background - emerald-50
        'success-100': '#D1FAE5', // Success background - emerald-100
        
        'warning': '#D97706', // Warm amber (warning) - amber-600
        'warning-50': '#FFFBEB', // Light warning background - amber-50
        'warning-100': '#FEF3C7', // Warning background - amber-100
        
        'error': '#DC2626', // Clear red (error) - red-600
        'error-50': '#FEF2F2', // Light error background - red-50
        'error-100': '#FEE2E2', // Error background - red-100
        
        // Border Colors
        'border': '#E5E7EB', // Minimal border color - gray-200
        'border-light': '#F3F4F6', // Light border - gray-100
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'], // Modern sans-serif for headings
        'body': ['Inter', 'sans-serif'], // Consistent body text
        'caption': ['Inter', 'sans-serif'], // Unified caption text
        'data': ['JetBrains Mono', 'monospace'], // Technical data display
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'sm': '4px', // Button border radius
        'DEFAULT': '6px', // Card border radius
        'lg': '8px',
        'xl': '12px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-in': 'slideIn 200ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      transitionDuration: {
        '200': '200ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      zIndex: {
        '1000': '1000', // Navigation header
        '1100': '1100', // Processing status overlays
        '1200': '1200', // Search results
        '1300': '1300', // Modal dialogs
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}