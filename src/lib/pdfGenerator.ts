import { jsPDF } from 'jspdf';
import { JournalConfig } from '../types';

// Plain SVG strings for the high-res offscreen rendering
const SVG_TEMPLATES = {
  'cozy-heart': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 42 35 C 38 25, 30 25, 38 12 C 45 6, 50 18, 42 35 Z" fill="none" />
      <path d="M 58 35 C 54 27, 48 24, 52 14 C 57 8, 62 18, 58 35 Z" stroke-dasharray="1 1" fill="none" />
      <path d="M 50 30 C 47 22, 42 22, 47 16 C 51 12, 54 18, 50 30 Z" fill="none" />
      <path d="M 50 10 C 49 7, 45 7, 47 4 C 50 1, 51 6, 50 10 Z" stroke-width="1" />
      <path d="M 46 16 C 44 14, 44 10, 47 11 C 50 10, 50 14, 46 16 Z" fill="black" stroke="none" />
      <path d="M 54 17 C 52 15, 52 11, 55 12 C 58 11, 58 15, 54 17 Z" fill="black" stroke="none" />
      <path d="M 25 38 L 75 38 C 75 38, 73 68, 50 68 C 27 68, 25 38, 25 38 Z" stroke-width="1.8" />
      <path d="M 50 54 C 44 46, 42 50, 50 58 C 58 50, 56 46, 50 54 Z" stroke-width="1.2" />
      <path d="M 75 44 C 84 44, 84 56, 73 58" />
      <path d="M 18 76 C 18 72, 82 72, 82 76 C 82 82, 18 82, 18 76 Z" />
      <line x1="28" y1="76" x2="72" y2="76" stroke-width="1.2" />
      <path d="M 12 45 C 10 40, 10 50, 8 45" />
      <path d="M 92 45 C 90 40, 90 50, 88 45" />
    </svg>
  `,
  'elegant-line': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 38 28 Q 44 18, 38 8 T 44 -2" transform="scale(0.8) translate(15, 12)" />
      <path d="M 48 28 Q 54 16, 48 6 T 54 -4" transform="scale(0.8) translate(15, 14)" />
      <path d="M 58 28 Q 63 20, 58 10 T 63 0" transform="scale(0.8) translate(15, 12)" />
      <path d="M 30 38 C 30 55, 35 66, 50 66 C 65 66, 70 55, 70 38" stroke-width="2" />
      <line x1="26" y1="38" x2="74" y2="38" stroke-width="2.3" />
      <path d="M 70 42 H 84 V 54 H 68.5" />
      <path d="M 20 74 C 35 79, 65 79, 80 74" />
      <path d="M 28 80 C 40 83, 60 83, 72 80" stroke-width="1" />
      <path d="M 20 25 L 22 27 M 22 25 L 20 27" stroke-width="1" />
      <path d="M 80 28 L 82 30 M 82 28 L 80 30" stroke-width="1" />
      <circle cx="50" cy="52" r="1.5" fill="black" stroke="none" />
    </svg>
  `,
  'latte-art': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="50" cy="50" r="32" stroke-width="2" />
      <circle cx="50" cy="50" r="28" stroke-width="1" />
      <circle cx="50" cy="50" r="24" stroke-dasharray="3 2" stroke-width="0.8" />
      <path d="M 50 72 V 32" stroke-width="1.2" />
      <path d="M 50 68 C 44 65, 42 58, 50 56 C 58 58, 56 65, 50 68 Z" />
      <path d="M 50 58 C 42 55, 40 48, 50 46 C 60 48, 58 55, 50 58 Z" />
      <path d="M 50 48 C 44 46, 42 40, 50 38 C 58 40, 56 46, 50 48 Z" />
      <path d="M 50 38 Q 45 34, 50 30 Q 55 34, 50 38" fill="black" />
      <path d="M 81.5 45 C 87 40, 89 54, 81.5 55" />
      <circle cx="50" cy="50" r="44" stroke-width="1" stroke-dasharray="10 3" />
      <path d="M 12 18 C 16 14, 20 22, 24 18" stroke-width="0.8" />
      <path d="M 76 18 C 80 14, 84 22, 88 18" stroke-width="0.8" stroke-dasharray="1 1" />
    </svg>
  `,
  'steaming-cup': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 36 30 C 36 20, 44 22, 40 10 C 37 2, 45 4, 43 -2" transform="translate(4, 5)" />
      <path d="M 46 30 C 46 18, 54 20, 50 8 C 47 0, 55 2, 53 -4" transform="translate(2, 5)" />
      <path d="M 56 30 C 56 22, 64 24, 60 12 C 57 4, 65 6, 63 0" transform="translate(0, 5)" />
      <rect x="28" y="38" width="44" height="38" rx="4" stroke-width="2" />
      <path d="M 72 44 C 83 44, 83 66, 72 66" stroke-width="1.8" />
      <path d="M 72 49 C 78 49, 78 61, 72 61" stroke-width="0.8" />
      <line x1="32" y1="46" x2="68" y2="46" stroke-width="1" stroke-dasharray="2 2" />
      <line x1="32" y1="56" x2="68" y2="56" stroke-width="1.5" />
      <line x1="32" y1="66" x2="68" y2="66" stroke-width="1" stroke-dasharray="2 2" />
      <path d="M 16 80 H 84" stroke-width="2" />
      <path d="M 24 84 H 76" stroke-width="1" />
      <circle cx="20" cy="30" r="1" fill="black" stroke="none" />
      <circle cx="82" cy="34" r="1.5" fill="black" stroke="none" />
    </svg>
  `,
  'minimalist-beans': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 38 45 L 62 45 C 62 45, 60 68, 50 68 C 40 68, 38 45, 38 45 Z" stroke-width="2" />
      <path d="M 26 74 C 36 78, 64 78, 74 74" stroke-width="1.5" />
      <path d="M 45 36 C 47 30, 43 28, 46 22 L 48 18" />
      <path d="M 52 36 C 54 29, 50 27, 53 20 L 55 16" stroke-dasharray="1 1" />
      <g transform="translate(14, 25) rotate(-35) scale(0.8)">
        <ellipse cx="10" cy="10" rx="6" ry="4" stroke-width="1.2" />
        <path d="M 4 10 C 10 12, 10 8, 16 10" stroke-width="0.8" />
      </g>
      <g transform="translate(74, 52) rotate(45) scale(0.8)">
        <ellipse cx="10" cy="10" rx="6" ry="4" stroke-width="1.2" />
        <path d="M 4 10 C 10 12, 10 8, 16 10" stroke-width="0.8" />
      </g>
      <g transform="translate(70, 16) rotate(15) scale(0.6)">
        <ellipse cx="10" cy="10" rx="6" ry="4" stroke-width="1.2" fill="black" />
      </g>
      <path d="M 18 58 L 22 62 M 22 58 L 18 62" stroke-width="0.8" />
      <circle cx="34" cy="24" r="1" fill="black" stroke="none" />
      <circle cx="62" cy="78" r="1.5" fill="black" stroke="none" />
    </svg>
  `
};

const SINGLE_BEAN_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.5">
    <ellipse cx="12" cy="12" rx="9" ry="6" transform="rotate(-45 12 12)" />
    <path d="M 5.5 18.5 C 12 15, 12 9, 18.5 5.5" />
  </svg>
`;

/**
 * Offscreen rendering of an SVG template to a high-DPI Base64 PNG.
 * For PDF rendering at 300 DPI, we render at 1000x1000px and embed with transparency.
 */
function renderSVGToPNG(svgString: string, size = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D context not supported');
      }

      // Convert SVG to highly compliant blob URL to sidestep cross-origin issues
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      };

      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to render SVG image source.'));
      };

      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Compiles a full 123-page PDF tailored precisely to Amazon KDP 8.5 x 11 inches requirements.
 * Follows alternating printer sequences for Verso (Left) and Recto (Right) pages to ensure absolute gutter safety.
 */
export async function generateKDPIntieriorPDF(
  config: JournalConfig,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  // Initialize jsPDF with portrait orientation, inches as base unit, and exact 8.5" x 11" dimensional cards.
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [8.5, 11]
  });

  // Pre-render elements for speed and crispness.
  let coffeeCupPNG: string;
  if (config.coffeeCupStyle === 'custom' && config.customCoffeeCupSvgOrPng) {
    const isSvg = config.customCoffeeCupSvgOrPng.trim().startsWith('<svg') || config.customCoffeeCupSvgOrPng.trim().includes('<svg');
    if (isSvg) {
      coffeeCupPNG = await renderSVGToPNG(config.customCoffeeCupSvgOrPng, 1200);
    } else {
      // It's already a high-res base64 PNG
      coffeeCupPNG = config.customCoffeeCupSvgOrPng;
    }
  } else {
    const mainCoffeeSVG = SVG_TEMPLATES[config.coffeeCupStyle as keyof typeof SVG_TEMPLATES] || SVG_TEMPLATES['cozy-heart'];
    coffeeCupPNG = await renderSVGToPNG(mainCoffeeSVG, 1200);
  }
  
  const singleBeanPNG = await renderSVGToPNG(SINGLE_BEAN_SVG, 500);

  // Set total pages (KDP needs 123 exact pages as requested)
  const totalPages = config.pageCount;

  // Render Page-by-Page loop
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    onProgress?.(Math.floor((pageNum / totalPages) * 100));

    // After Page 1, we must add a new page.
    if (pageNum > 1) {
      doc.addPage([8.5, 11], 'portrait');
    }

    // Determine if layout is ODD page (Right/Recto) or EVEN page (Left/Verso) to adjust margins for binding sequence
    const isOdd = pageNum % 2 !== 0;
    
    // Gutter settings: ODD page has left gutter (spine is on left). EVEN page has right gutter (spine is on right).
    const leftMargin = isOdd ? config.insideMargin : config.outsideMargin;
    const rightMargin = isOdd ? config.outsideMargin : config.insideMargin;
    const { topMargin, bottomMargin } = config;

    const printableWidth = 8.5 - leftMargin - rightMargin;
    const printableHeight = 11 - topMargin - bottomMargin;

    // --- PAGE 1: TITLE / FRONT PIECE PAGE (Right / Recto) ---
    if (pageNum === 1) {
      // Elegant minimal B&W Title Design with vector graphics
      doc.setFont('times', 'bold');
      doc.setFontSize(26);
      doc.setTextColor(30, 30, 30);
      
      const titleY = topMargin + 1.2;
      doc.text(config.firstPageTitle, 8.5 / 2, titleY, { align: 'center' });
      
      doc.setFont('times', 'italic');
      doc.setFontSize(14);
      doc.setTextColor(80, 80, 80);
      doc.text(config.firstPageSubtitle, 8.5 / 2, titleY + 0.4, { align: 'center' });

      // Centered magnificent Large Coffee Cup Graphic
      const graphicSize = 3.5;
      const graphicX = (8.5 - graphicSize) / 2;
      const graphicY = titleY + 1.0;
      doc.addImage(coffeeCupPNG, 'PNG', graphicX, graphicY, graphicSize, graphicSize, undefined, 'MEDIUM');

      // Bottom ornamental bar
      const bottomDecorationY = 11 - bottomMargin - 1.5;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.01);
      doc.line(leftMargin + 1, bottomDecorationY, 8.5 - rightMargin - 1, bottomDecorationY);
      
      doc.setFont('times', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(110, 110, 110);
      doc.text("Cozy thoughts brew on these pages.", 8.5 / 2, bottomDecorationY + 0.3, { align: 'center' });
      
      continue;
    }

    // --- PAGE 2: LOG OWNER NAME PAGE (Left / Verso) ---
    if (pageNum === 2) {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.008);
      // Beautiful delicate border around Page 2
      doc.rect(leftMargin, topMargin, printableWidth, printableHeight);

      // Centered Owner text block
      const centerY = 11 / 2;
      
      doc.setFont('times', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("THIS JOURNAL BELONGS TO:", 8.5 / 2, centerY - 1.2, { align: 'center' });

      // Custom Name input line
      if (config.hasOwnerNameLine) {
        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(0.015);
        doc.line(leftMargin + 0.8, centerY - 0.2, 8.5 - rightMargin - 0.8, centerY - 0.2);
        
        if (config.ownerName && config.ownerName !== "Your Name Here") {
          doc.setFont('times', 'italic');
          doc.setFontSize(16);
          doc.setTextColor(20, 20, 20);
          doc.text(config.ownerName, 8.5 / 2, centerY - 0.3, { align: 'center' });
        }
      }

      // Elegant Coffee slogan below name
      doc.setFont('times', 'italic');
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("« May your coffee be strong and your morning be focused »", 8.5 / 2, centerY + 0.8, { align: 'center' });

      // Small stylized cup watermark centered near the bottom
      doc.addImage(coffeeCupPNG, 'PNG', (8.5 - 1.2) / 2, centerY + 1.8, 1.2, 1.2, undefined, 'FAST');

      continue;
    }

    // --- PAGE 3: COFFEE SLOGAN DEDICATION PAGE (Right / Recto) ---
    if (pageNum === 3) {
      // Grand Slogan layout
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.012);
      // Double border effect
      doc.rect(leftMargin + 0.15, topMargin + 0.15, printableWidth - 0.3, printableHeight - 0.3);
      doc.rect(leftMargin + 0.2, topMargin + 0.2, printableWidth - 0.4, printableHeight - 0.4);

      // Giant centered coffee-cup drawing
      const bigCupW = 2.4;
      doc.addImage(coffeeCupPNG, 'PNG', (8.5 - bigCupW) / 2, topMargin + 0.8, bigCupW, bigCupW, undefined, 'MEDIUM');

      // The Slogan Quotation
      doc.setFont('times', 'italic');
      doc.setFontSize(18);
      doc.setTextColor(30, 30, 30);
      
      const quoteLines = doc.splitTextToSize(config.selectedSlogan, printableWidth - 1.0);
      let quoteY = topMargin + 3.8;
      doc.setLineHeightFactor(1.45);
      doc.text(quoteLines, 8.5 / 2, quoteY, { align: 'center' });
      doc.setLineHeightFactor(1.15); // reset to standard spacing

      // Slogan Author
      if (config.selectedSloganAuthor) {
        doc.setFont('times', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(110, 110, 110);
        const sloganOffset = quoteLines.length * 0.4;
        doc.text(`— ${config.selectedSloganAuthor}`, 8.5 / 2 + 1.0, quoteY + sloganOffset, { align: 'right' });
      }

      // Beautiful horizontal divider using tiny beans
      const dividerY = 11 - bottomMargin - 1.8;
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.005);
      doc.line(leftMargin + 1.2, dividerY, 8.5 - rightMargin - 1.2, dividerY);
      doc.addImage(singleBeanPNG, 'PNG', 8.5 / 2 - 0.15, dividerY - 0.15, 0.3, 0.3);

      continue;
    }

    // --- PAGES 4 to 123: LINED JOURNAL PAGES ---
    // Header blocks
    let lineStartY = topMargin;

    if (config.hasTopDateBlock) {
      doc.setFont('times', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(120, 120, 120);
      
      // Placed based on outer edge to index beautifully
      const dateX = isOdd ? (8.5 - rightMargin - 1.8) : leftMargin;
      doc.text("Date: ___________________", dateX, topMargin + 0.3);

      // Rating block: "Daily Vibe:" or "Caffeine Level:" with 5 coffee beans
      if (config.hasBeanRating) {
        const ratingLabelX = isOdd ? leftMargin : (8.5 - rightMargin - 2.8);
        doc.text("Daily Vibe:", ratingLabelX, topMargin + 0.3);
        
        // Render 5 blank little beans to color in
        const beanW = 0.15;
        const beanSpacing = 0.20;
        const beanStartX = ratingLabelX + 0.85;
        for (let i = 0; i < 5; i++) {
          doc.addImage(singleBeanPNG, 'PNG', beanStartX + (i * beanSpacing), topMargin + 0.12, beanW, beanW, undefined, 'FAST');
        }
      }

      lineStartY = topMargin + 0.8;
    }

    // Space for horizontal lines
    const bottomLineYLimit = 11 - bottomMargin - 0.5;
    const totalLinesSpaceHeight = bottomLineYLimit - lineStartY;
    const numLines = Math.floor(totalLinesSpaceHeight / config.lineHeight);

    doc.setDrawColor(190, 190, 190); // soft aesthetic writing grey
    doc.setLineWidth(0.007); // laser-sharp vector thickness

    // Draw the perfect writing lines
    for (let j = 0; j < numLines; j++) {
      const lineY = lineStartY + (j * config.lineHeight);
      doc.line(leftMargin, lineY, 8.5 - rightMargin, lineY);
    }

    // Footer decoration: watermark of the coffee cup at the edge, alternating
    // ODD (spine left, watermark bottom-right outwards)
    // EVEN (spine right, watermark bottom-left outwards)
    const watermarkScale = 0.9;
    const watermarkY = 11 - bottomMargin - 0.85;
    const watermarkX = isOdd ? (8.5 - rightMargin - watermarkScale - 0.1) : (leftMargin + 0.1);
    
    // Add coffee cup watermark to bottom outer corner with 35% opacity (achieved via fast rendering format or light background)
    // Canvas background render generates perfectly clean black and white, we keep lines and watermark in harmony
    doc.addImage(coffeeCupPNG, 'PNG', watermarkX, watermarkY, watermarkScale, watermarkScale, undefined, 'FAST');

    // Page Number Placement: Outer margins to follow sequential printer binder
    if (config.hasPageNumbers) {
      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(140, 140, 140);
      
      const pageX = isOdd ? (8.5 - rightMargin) : leftMargin;
      const pageAlign = isOdd ? 'right' : 'left';
      doc.text(`${pageNum}`, pageX, 11 - bottomMargin + 0.3, { align: pageAlign });

      // Custom footer text centered at the bottom of each page
      if (config.customFooterText) {
        doc.text(config.customFooterText, 8.5 / 2, 11 - bottomMargin + 0.3, { align: 'center' });
      }
    }
  }

  // Generate and return Blob
  return doc.output('blob');
}
