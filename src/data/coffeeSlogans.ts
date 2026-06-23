import { CoffeeSlogan } from '../types';

export const PRELOADED_SLOGANS: CoffeeSlogan[] = [
  {
    text: "First I drink the coffee, then I do the things.",
    author: "Classic Quote",
    category: "funny"
  },
  {
    text: "Life is a journey of brewing warm ideas, caffeine, and endless kindness.",
    author: "Aesthetic Journal",
    category: "aesthetic"
  },
  {
    text: "Pour yourself a cup of warm ambition and write your dreams down.",
    author: "Inspiring Slow Mornings",
    category: "motivational"
  },
  {
    text: "Warm mug, full heart, slow morning, beautiful thoughts.",
    author: "Cozy Café",
    category: "cozy"
  },
  {
    text: "Coffee: because adulting is hard, but your dreams are worth it.",
    author: "Encouraging Heart",
    category: "motivational"
  },
  {
    text: "May your coffee be strong, your thoughts be clear, and your morning be sweet.",
    author: "Morning Vibes",
    category: "aesthetic"
  },
  {
    text: "I like my coffee hot, my slow mornings long, and my journals filled.",
    author: "Parisian Café Enthusiast",
    category: "cozy"
  },
  {
    text: "A daily cup of gratitude and a giant brew of positive vibes.",
    author: "Mindful Living",
    category: "motivational"
  },
  {
    text: "Caffeine & Kindness - brewing magic on every single page.",
    author: "Aesthetic Coffee",
    category: "aesthetic"
  },
  {
    text: "Brewing thoughts, sipping ideas, journaling dreams.",
    author: "Dreams in Coffee",
    category: "cozy"
  },
  {
    text: "Coffee: A liquid hug that makes everything else possible.",
    author: "Cozy Hugs",
    category: "cozy"
  },
  {
    text: "Focused coffee, quiet space, and a heart completely open to write.",
    author: "Self Care Routine",
    category: "aesthetic"
  }
];

export const COFFEE_VIBE_CATEGORIES = [
  { value: 'aesthetic', label: '🌸 Aesthetic & Elegant' },
  { value: 'cozy', label: '☕ Warm & Cozy' },
  { value: 'motivational', label: '✨ Inspiring & Empowering' },
  { value: 'funny', label: '🌻 Bright & Sassy/Funny' }
];

export const COFFEE_CUP_PRESETS = [
  { id: 'cozy-heart', label: 'Cozy Heart Cup', desc: 'Cute steam hearts with saucer outline' },
  { id: 'elegant-line', label: 'Aesthetic Line Art', desc: 'Minimalist curvy cup with modern dots' },
  { id: 'latte-art', label: 'Love Latte Art', desc: 'Top-down look tracking rosetta foam' },
  { id: 'steaming-cup', label: 'Classic Warm Mug', desc: 'Symmetrical strip mug with rich cozy steam' },
  { id: 'minimalist-beans', label: 'Espresso & Coffee Beans', desc: 'Dainty classic mini-cup with orbits' }
];
