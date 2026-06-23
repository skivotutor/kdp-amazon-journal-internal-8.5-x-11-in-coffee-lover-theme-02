import React, { useState } from 'react';
import { JournalConfig } from '../types';
import { getCoffeeSVG, CoffeeBeanIcon } from './CoffeeSVGs';

interface KDPPreviewProps {
  config: JournalConfig;
}

export const KDPPreview: React.FC<KDPPreviewProps> = ({ config }) => {
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'lined' | 'intro'>('lined');
  
  // Scaled dimensions: 1 inch = 40 pixels on screen
  const scale = 40;
  const pageWidth = 8.5 * scale; // 340px
  const pageHeight = 11 * scale; // 440px

  // Generate mock line list for lined pages
  const renderMockLines = (isOdd: boolean) => {
    const leftMargin = isOdd ? config.insideMargin : config.outsideMargin;
    const rightMargin = isOdd ? config.outsideMargin : config.insideMargin;
    const { topMargin, bottomMargin, lineHeight } = config;

    // Convert to relative pixels
    const pxLeft = leftMargin * scale;
    const pxRight = rightMargin * scale;
    const pxTop = topMargin * scale;
    const pxBottom = bottomMargin * scale;
    
    const printWidth = pageWidth - pxLeft - pxRight;
    const printHeight = pageHeight - pxTop - pxBottom;

    // Accounts for header block
    const lineStartY = config.hasTopDateBlock ? pxTop + (0.8 * scale) : pxTop;
    const lineYLimit = pageHeight - pxBottom - (0.4 * scale);
    const lineGap = lineHeight * scale;
    
    const linesCount = Math.floor((lineYLimit - lineStartY) / lineGap);
    const lines = [];

    for (let i = 0; i < linesCount; i++) {
      lines.push(lineStartY + i * lineGap);
    }

    return {
      pxLeft,
      pxRight,
      pxTop,
      pxBottom,
      printWidth,
      printHeight,
      lines,
      lineStartY
    };
  };

  const oddPageData = renderMockLines(true);
  const evenPageData = renderMockLines(false);

  return (
    <div className="flex flex-col items-center w-full" id="kdp_interactive_visualizer">
      {/* Visual Controls bar under Clean Minimalism */}
      <div className="flex flex-wrap items-center justify-between w-full gap-4 p-5 border-b border-zinc-200 bg-white shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 font-mono">
            Interactive Sheet Preview:
          </span>
          <div className="inline-flex bg-zinc-100 p-1 border border-zinc-200">
            <button
              onClick={() => setViewMode('intro')}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === 'intro'
                  ? 'bg-zinc-950 text-white'
                  : 'text-zinc-650 hover:text-zinc-950'
              }`}
            >
              📖 Welcome & Slogan Pages (1-3)
            </button>
            <button
              onClick={() => setViewMode('lined')}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === 'lined'
                  ? 'bg-zinc-950 text-white'
                  : 'text-zinc-650 hover:text-zinc-950'
              }`}
            >
              📝 Lined Spread (4-123)
            </button>
          </div>
        </div>

        {/* Switch to enable guideline overlay */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showGuides}
              onChange={() => setShowGuides(!showGuides)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-zinc-200 peer peer-focus:outline-none peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-zinc-950"></div>
            <span className="ms-2 text-[10px] font-bold uppercase tracking-wider text-zinc-800 font-mono">
              Margin Guides ({showGuides ? 'ON' : 'OFF'})
            </span>
          </label>
        </div>
      </div>

      {/* Guide notice explaining printer sequences */}
      <div className="w-full px-5 py-3.5 text-xs bg-zinc-50 border-b border-zinc-200 text-zinc-600 leading-relaxed font-serif">
        <p className="flex items-start">
          <span className="font-bold text-zinc-950 mr-1.5 font-sans text-[11px] tracking-wide uppercase">📐 Spine Gutter Safety:</span> 
          Notice how the margins alternate between left and right. Larger inside margins auto-flip on left vs right sheets to protect writing from falling into the creased book safe zone.
        </p>
      </div>

      {/* Main Preview sheets container */}
      <div className="w-full overflow-x-auto py-10 px-6 flex justify-center bg-zinc-50/50 border border-zinc-200">
        <div className="flex flex-col xl:flex-row gap-8 items-center justify-center min-w-max">
          
          {/* INTRO VIEWS */}
          {viewMode === 'intro' && (
            <>
              {/* PAGE 1: TITLE FRONT PIECE (Outer Odd / Right Page) */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono tracking-wider font-bold text-zinc-400 mb-2.5">PAGE 1 — RECTO (RIGHT)</span>
                <div 
                  className="bg-white shadow-sm border border-zinc-200 relative transition-all"
                  style={{ width: pageWidth, height: pageHeight }}
                >
                  {/* Guideline bounding overlay */}
                  {showGuides && (
                    <div 
                      className="absolute border border-dashed border-red-400/80 pointer-events-none"
                      style={{
                        left: config.insideMargin * scale,
                        right: config.outsideMargin * scale,
                        top: config.topMargin * scale,
                        bottom: config.bottomMargin * scale,
                      }}
                    />
                  )}

                  {/* Page contents in absolute B&W */}
                  <div className="absolute inset-0 flex flex-col items-center justify-between p-6 select-none">
                    <div className="mt-12 text-center w-full">
                      <h1 className="font-serif font-light text-zinc-950 text-2xl tracking-[0.06em] break-words px-4 leading-normal uppercase">
                        {config.firstPageTitle || 'My Coffee Lover Journal'}
                      </h1>
                      <div className="w-8 h-[1px] bg-black mx-auto my-3"></div>
                      <p className="font-serif italic text-zinc-500 text-xs px-6">
                        {config.firstPageSubtitle || 'Thoughts brewed in the quiet of the morning.'}
                      </p>
                    </div>

                    <div className="flex justify-center items-center h-44 w-full">
                      <div className="text-zinc-950">
                        {getCoffeeSVG(config.coffeeCupStyle, 120, '', config.customCoffeeCupSvgOrPng)}
                      </div>
                    </div>

                    <div className="w-full flex flex-col items-center mb-8">
                      <div className="w-12 border-t border-zinc-300 my-2" />
                      <p className="font-serif text-[10px] italic text-zinc-405">
                        Cozy thoughts brew on these pages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAGE 2: JOURNAL PROPERTY PAGE (Even / Left Page) */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono tracking-wider font-bold text-zinc-400 mb-2.5">PAGE 2 — VERSO (LEFT)</span>
                <div 
                  className="bg-white shadow-sm border border-zinc-200 relative transition-all"
                  style={{ width: pageWidth, height: pageHeight }}
                >
                  {showGuides && (
                    <div 
                      className="absolute border border-dashed border-red-400/80 pointer-events-none"
                      style={{
                        left: config.outsideMargin * scale,
                        right: config.insideMargin * scale,
                        top: config.topMargin * scale,
                        bottom: config.bottomMargin * scale,
                      }}
                    />
                  )}

                  {/* Page Contents */}
                  <div className="absolute inset-0 flex flex-col items-center justify-around p-8 select-none">
                    <div className="border border-zinc-200 w-full h-full p-6 flex flex-col items-center justify-center relative">
                      <h2 className="font-mono text-[10px] font-bold text-zinc-800 tracking-widest text-center mt-4">
                        THIS JOURNAL BELONGS TO:
                      </h2>
                      
                      {/* Name placeholder line */}
                      <div className="w-4/5 h-16 border-b border-zinc-900 flex items-end justify-center pb-2 relative my-4">
                        <span className="font-serif italic text-zinc-900 text-lg">
                          {config.ownerName || 'Your Name'}
                        </span>
                        {(!config.ownerName || config.ownerName === 'Your Name Here') && (
                          <span className="absolute bottom-2 text-[10px] tracking-wider text-zinc-400 italic">
                            (Write your name here)
                          </span>
                        )}
                      </div>

                      <p className="font-serif italic text-xs text-zinc-400 text-center px-4 max-w-xs mt-4">
                        « May your coffee be strong and your morning thoughts be deep »
                      </p>

                      <div className="text-zinc-300 mt-12 mb-4">
                        {getCoffeeSVG(config.coffeeCupStyle, 54, '', config.customCoffeeCupSvgOrPng)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAGE 3: MAIN SELECTED QUOTE PAGE (Odd / Right Page) */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono tracking-wider font-bold text-zinc-400 mb-2.5">PAGE 3 — RECTO (RIGHT)</span>
                <div 
                  className="bg-white shadow-sm border border-zinc-200 relative transition-all"
                  style={{ width: pageWidth, height: pageHeight }}
                >
                  {showGuides && (
                    <div 
                      className="absolute border border-dashed border-red-400/80 pointer-events-none"
                      style={{
                        left: config.insideMargin * scale,
                        right: config.outsideMargin * scale,
                        top: config.topMargin * scale,
                        bottom: config.bottomMargin * scale,
                      }}
                    />
                  )}

                  {/* Page Contents */}
                  <div className="absolute inset-0 flex flex-col items-center justify-between p-8 select-none">
                    <div className="border-[1px] border-zinc-200 w-full h-full p-6 flex flex-col items-center justify-between relative">
                      {/* Nested double thin border */}
                      <div className="absolute inset-1 border border-zinc-100 pointer-events-none"></div>
                      
                      <div className="text-zinc-400 mt-6">
                        {getCoffeeSVG(config.coffeeCupStyle, 70, '', config.customCoffeeCupSvgOrPng)}
                      </div>

                      <div className="text-center px-4">
                        <p className="font-serif italic text-base text-zinc-950 leading-relaxed">
                          "{config.selectedSlogan || 'I like my coffee black and my mornings bright.'}"
                        </p>
                        {config.selectedSloganAuthor && (
                          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mt-3 text-right">
                            — {config.selectedSloganAuthor}
                          </p>
                        )}
                      </div>

                      {/* Small leaf or bean divider element */}
                      <div className="flex items-center justify-center gap-1.5 w-1/3 mb-4">
                        <div className="h-[1px] bg-zinc-200 flex-1"></div>
                        <CoffeeBeanIcon size={12} className="text-zinc-400" />
                        <div className="h-[1px] bg-zinc-200 flex-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* LINED SPREAD VIEWS */}
          {viewMode === 'lined' && (
            <>
              {/* EVEN PAGE: Left-Hand Lined Page */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-[9px] bg-zinc-950 text-white px-1.5 py-0.5 font-mono uppercase font-bold tracking-wider">Left Page</span>
                  <span className="text-[10px] font-mono font-bold text-zinc-400">EVEN PAGE (e.g. 4, 12, 120)</span>
                </div>
                <div 
                  className="bg-white shadow-sm border border-zinc-200 relative transition-all"
                  style={{ width: pageWidth, height: pageHeight }}
                >
                  {/* Gutter / Margin markers (LEFT = Outside, RIGHT = Inside binding gutter) */}
                  {showGuides && (
                    <div 
                      className="absolute border border-dashed border-red-400/80 pointer-events-none"
                      style={{
                        left: config.outsideMargin * scale,
                        right: config.insideMargin * scale,
                        top: config.topMargin * scale,
                        bottom: config.bottomMargin * scale,
                      }}
                    >
                      <span className="absolute -top-4 right-0 text-[8px] bg-red-100/85 text-red-500 font-mono px-1 rounded-sm transform translate-x-1/2">
                        Inside Gutter: {config.insideMargin}"
                      </span>
                      <span className="absolute -top-4 left-0 text-[8px] bg-red-100/85 text-red-500 font-mono px-1 rounded-sm transform -translate-x-1/2">
                        Outside margin: {config.outsideMargin}"
                      </span>
                    </div>
                  )}

                  {/* Header details */}
                  {config.hasTopDateBlock && (
                    <div 
                      className="absolute text-[9px] text-zinc-450 font-mono tracking-wide"
                      style={{
                        top: config.topMargin * scale + 10,
                        left: config.outsideMargin * scale,
                        right: config.insideMargin * scale,
                      }}
                    >
                      <div className="flex justify-between items-center w-full">
                        {config.hasBeanRating ? (
                          <div className="flex items-center gap-1 text-[9px] text-zinc-400">
                            <span className="uppercase font-bold tracking-wider">DAILY VIBE:</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((b) => (
                                <CoffeeBeanIcon key={b} size={10} className="text-zinc-300" />
                              ))}
                            </div>
                          </div>
                        ) : <div />}
                        <span>DATE: __________________</span>
                      </div>
                    </div>
                  )}

                  {/* Actual lines drawn on Page surface */}
                  <svg className="absolute inset-0 pointer-events-none w-full h-full">
                    {evenPageData.lines.map((lineY, index) => (
                      <line
                        key={index}
                        x1={evenPageData.pxLeft}
                        y1={lineY}
                        x2={pageWidth - evenPageData.pxRight}
                        y2={lineY}
                        stroke="#e4e4e7"
                        strokeWidth="1"
                      />
                    ))}
                  </svg>

                  {/* Small Coffee Cup watermark bottom-left (outer edge for Left page!) */}
                  <div 
                    className="absolute opacity-25 text-zinc-950"
                    style={{
                      left: (config.outsideMargin * scale) + 6,
                      bottom: (config.bottomMargin * scale) + 6,
                    }}
                  >
                    {getCoffeeSVG(config.coffeeCupStyle, 28, '', config.customCoffeeCupSvgOrPng)}
                  </div>

                  {/* Page number Bottom Left (Even / Left Page) */}
                  {config.hasPageNumbers && (
                    <div 
                      className="absolute text-[10px] text-zinc-450 font-mono font-medium"
                      style={{
                        bottom: (config.bottomMargin * scale) - 24,
                        left: config.outsideMargin * scale,
                      }}
                    >
                      22
                    </div>
                  )}
                  {config.hasPageNumbers && config.customFooterText && (
                    <div 
                      className="absolute text-[8px] uppercase tracking-widest text-zinc-400 font-mono text-center w-full"
                      style={{
                        bottom: (config.bottomMargin * scale) - 24,
                        left: 0,
                      }}
                    >
                      {config.customFooterText}
                    </div>
                  )}
                </div>
              </div>

              {/* ODD PAGE: Right-Hand Lined Page */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-[9px] bg-zinc-950 text-white px-1.5 py-0.5 font-mono uppercase font-bold tracking-wider">Right Page</span>
                  <span className="text-[10px] font-mono font-bold text-zinc-400">ODD PAGE (e.g. 5, 27, 123)</span>
                </div>
                <div 
                  className="bg-white shadow-sm border border-zinc-200 relative transition-all"
                  style={{ width: pageWidth, height: pageHeight }}
                >
                  {/* Gutter / Margin markers (LEFT = Inside binding gutter, RIGHT = Outside margin) */}
                  {showGuides && (
                    <div 
                      className="absolute border border-dashed border-red-400/80 pointer-events-none"
                      style={{
                        left: config.insideMargin * scale,
                        right: config.outsideMargin * scale,
                        top: config.topMargin * scale,
                        bottom: config.bottomMargin * scale,
                      }}
                    >
                      <span className="absolute -top-4 left-0 text-[8px] bg-red-100/85 text-red-500 font-mono px-1 rounded-sm transform -translate-x-1/2">
                        Inside Gutter: {config.insideMargin}"
                      </span>
                      <span className="absolute -top-4 right-0 text-[8px] bg-red-100/85 text-red-500 font-mono px-1 rounded-sm transform translate-x-1/2">
                        Outside margin: {config.outsideMargin}"
                      </span>
                    </div>
                  )}

                  {/* Header details */}
                  {config.hasTopDateBlock && (
                    <div 
                      className="absolute text-[9px] text-zinc-450 font-mono tracking-wide"
                      style={{
                        top: config.topMargin * scale + 10,
                        left: config.insideMargin * scale,
                        right: config.outsideMargin * scale,
                      }}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span>DATE: __________________</span>
                        {config.hasBeanRating && (
                          <div className="flex items-center gap-1 text-[9px] text-zinc-400">
                            <span className="uppercase font-bold tracking-wider">DAILY VIBE:</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((b) => (
                                <CoffeeBeanIcon key={b} size={10} className="text-zinc-300" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actual lines drawn on Page surface */}
                  <svg className="absolute inset-0 pointer-events-none w-full h-full">
                    {oddPageData.lines.map((lineY, index) => (
                      <line
                        key={index}
                        x1={oddPageData.pxLeft}
                        y1={lineY}
                        x2={pageWidth - oddPageData.pxRight}
                        y2={lineY}
                        stroke="#e4e4e7"
                        strokeWidth="1"
                      />
                    ))}
                  </svg>

                  {/* Small Coffee Cup watermark bottom-right (outer edge for Right page!) */}
                  <div 
                    className="absolute opacity-25 text-zinc-950"
                    style={{
                      right: (config.outsideMargin * scale) + 6,
                      bottom: (config.bottomMargin * scale) + 6,
                    }}
                  >
                    {getCoffeeSVG(config.coffeeCupStyle, 28, '', config.customCoffeeCupSvgOrPng)}
                  </div>

                  {/* Page number Bottom Right (Odd / Right Page) */}
                  {config.hasPageNumbers && (
                    <div 
                      className="absolute text-[10px] text-zinc-450 font-mono font-medium"
                      style={{
                        bottom: (config.bottomMargin * scale) - 24,
                        right: config.outsideMargin * scale,
                      }}
                    >
                      23
                    </div>
                  )}
                  {config.hasPageNumbers && config.customFooterText && (
                    <div 
                      className="absolute text-[8px] uppercase tracking-widest text-zinc-400 font-mono text-center w-full"
                      style={{
                        bottom: (config.bottomMargin * scale) - 24,
                        left: 0,
                      }}
                    >
                      {config.customFooterText}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
