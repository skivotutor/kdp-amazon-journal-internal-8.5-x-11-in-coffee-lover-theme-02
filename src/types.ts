export interface JournalConfig {
  insideMargin: number; // in inches (gutter)
  outsideMargin: number; // in inches
  topMargin: number; // in inches
  bottomMargin: number; // in inches
  lineHeight: number; // in inches (e.g., 0.28 for college-ruled, 0.32 for wide-ruled)
  theme: 'cream' | 'mocha' | 'latte' | 'dark-espresso'; // visual theme of the UI
  ownerName: string;
  hasOwnerNameLine: boolean;
  firstPageTitle: string;
  firstPageSubtitle: string;
  selectedSlogan: string;
  selectedSloganAuthor: string;
  coffeeCupStyle: 'cozy-heart' | 'elegant-line' | 'latte-art' | 'steaming-cup' | 'minimalist-beans' | 'custom';
  customCoffeeCupSvgOrPng?: string; // custom SVG string OR base64 PNG data-url
  hasPageNumbers: boolean;
  hasBeanRating: boolean;
  hasTopDateBlock: boolean;
  customFooterText: string;
  pageCount: number; // fixed at 123 pages total
}

export interface CoffeeSlogan {
  text: string;
  author?: string;
  category: 'aesthetic' | 'funny' | 'cozy' | 'motivational';
}
