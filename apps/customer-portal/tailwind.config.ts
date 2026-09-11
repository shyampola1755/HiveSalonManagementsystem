import type { Config } from 'tailwindcss';
import { hiveTailwindPreset } from '../../packages/config/src/tailwind.config';

const config: Config = {
  presets: [hiveTailwindPreset as any],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
