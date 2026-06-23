import React, { useState } from 'react';
import { JournalConfig } from './types';
import { KDPPreview } from './components/KDPPreview';
import { SloganManager } from './components/SloganManager';
import { generateKDPIntieriorPDF } from './lib/pdfGenerator';
import { COFFEE_CUP_PRESETS } from './data/coffeeSlogans';
import { getCoffeeSVG } from './components/CoffeeSVGs';
import { 
  Coffee, 
  Settings, 
  Layers, 
  HelpCircle, 
  Heart, 
  Sparkles, 
  Download, 
  ChevronsRight, 
  AlertCircle,
  Clock,
  BookOpen,
  Sliders,
  AlignLeft
} from 'lucide-react';

const INITIAL_CONFIG: JournalConfig = {
  insideMargin: 0.75, // 0.75 in gutter margin
  outsideMargin: 0.5, // 0.5 in outside margin
  topMargin: 0.625, // 0.625 top margin (comfortable room)
  bottomMargin: 0.625, // 0.625 bottom margin
  lineHeight: 0.28, // 0.28 in (7.1mm college ruled line-height)
  theme: 'cream',
  ownerName: 'Your Name Here',
  hasOwnerNameLine: true,
  firstPageTitle: 'My Coffee & Thoughts Journal',
  firstPageSubtitle: 'Thoughts brewed in the quiet of the morning.',
  selectedSlogan: 'First I drink the coffee, then I write my dreams.',
  selectedSloganAuthor: 'Aesthetic Journal',
  coffeeCupStyle: 'cozy-heart',
  hasPageNumbers: true,
  hasBeanRating: true,
  hasTopDateBlock: true,
  customFooterText: 'Brewed with Love & Coffee',
  pageCount: 123 // Fixed sequence count (Page 1 Title, Page 2 Owner, Page 3 Slogan, Pages 4-123 Lined pages)
};

export default function App() {
  const [config, setConfig] = useState<JournalConfig>(INITIAL_CONFIG);
  const [activeTab, setActiveTab] = useState<'visuals' | 'margins' | 'quotes'>('visuals');
  
  // Custom Watermark uploaded file and AI generation states
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState<string>('minimalist line art coffee cup with flower petals');
  const [isBrewing, setIsBrewing] = useState<boolean>(false);
  const [brewError, setBrewError] = useState<string | null>(null);

  // PDF Compilation states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');

  const updateConfig = (updated: Partial<JournalConfig>) => {
    setConfig(prev => ({ ...prev, ...updated }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setUploadSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Reject files not matching format expectations
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    const isValidFormat = fileType === 'image/svg+xml' || fileType === 'image/png' || fileName.endsWith('.svg') || fileName.endsWith('.png');

    if (!isValidFormat) {
      setUploadError('Invalid format. Please upload SVG or PNG files only.');
      return;
    }

    const reader = new FileReader();
    if (fileType === 'image/svg+xml' || fileName.endsWith('.svg')) {
      reader.onload = (event) => {
        const svgContent = event.target?.result as string;
        if (svgContent && (svgContent.includes('<svg') || svgContent.includes('<SVG'))) {
          updateConfig({
            coffeeCupStyle: 'custom',
            customCoffeeCupSvgOrPng: svgContent
          });
          setUploadSuccess(`Successfully uploaded "${file.name}" vector SVG!`);
        } else {
          setUploadError('Failed to parse uploaded content as a valid vector SVG structure.');
        }
      };
      reader.readAsText(file);
    } else {
      // It's a PNG! Let's read it as base64 data-URL
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        if (base64Data) {
          // Check image resolution if possible to guide user
          const img = new Image();
          img.onload = () => {
            if (img.width < 500 || img.height < 500) {
              setUploadError(`Warning: uploaded image is ${img.width}x${img.height}px. KDP printing requires high-resolution (suggested at least 1000px width/height) for crisp print quality.`);
            } else {
              setUploadSuccess(`Successfully uploaded "${file.name}" (${img.width}x${img.height}px PNG)!`);
            }
            updateConfig({
              coffeeCupStyle: 'custom',
              customCoffeeCupSvgOrPng: base64Data
            });
          };
          img.src = base64Data;
        } else {
          setUploadError('Failed to process the uploaded image.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIBrew = async () => {
    setIsBrewing(true);
    setBrewError(null);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      const response = await fetch('/api/generate-coffee-icon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: aiPrompt })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Server returned an error generating your coffee icon.');
      }

      const data = await response.json();
      if (data.svg) {
        updateConfig({
          coffeeCupStyle: 'custom',
          customCoffeeCupSvgOrPng: data.svg
        });
        setUploadSuccess('AI successfully brewed your custom coffee vector!');
      } else {
        throw new Error('AI returned an empty response.');
      }
    } catch (err: any) {
      console.error(err);
      setBrewError(err.message || 'Failed to brew coffee icon. Please check your prompt and try again.');
    } finally {
      setIsBrewing(false);
    }
  };

  // Determine humorous, coffee-themed progress message based on percentage
  const getProgressVibe = (p: number) => {
    if (p <= 5) return 'Selecting the premium Arabica coffee beans... ☕';
    if (p <= 20) return 'Roasting background watermarks at high DPI... 🔥';
    if (p <= 40) return 'Steaming page 2 owner credentials and templates... 🥛';
    if (p <= 60) return `Pouring sequential writing lines (comfort spacing)... 📝`;
    if (p <= 80) return 'Binding alternating inside gutters for spine printing sequence... 📐';
    if (p <= 95) return 'Adding high-DPI custom café watermarks... 🌸';
    return 'Topping off pages with micro-foamed latte-art! Almost ready to serve... ✨';
  };

  // Trigger PDF Generation
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    setProgress(0);
    setProgressStatus(getProgressVibe(0));

    try {
      // Small timeout to allow loader UI to show
      await new Promise(resolve => setTimeout(resolve, 500));

      const pdfBlob = await generateKDPIntieriorPDF(config, (p) => {
        setProgress(p);
        setProgressStatus(getProgressVibe(p));
      });

      // Simple click trigger to download Blob as file
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kdp_coffee_journal_interior_8.5x11_123pages.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert('Failed to generate KDP PDF interior. Please report this issue.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 pb-20 relative font-sans" id="app_root">
      {/* Clean Minimalism Top Editorial Header */}
      <header className="bg-white border-b border-zinc-200 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-zinc-950 flex items-center justify-center text-white shrink-0">
              <Coffee size={28} strokeWidth={1} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.14em] bg-zinc-100 border border-zinc-300 text-zinc-800 px-2 py-0.5 font-mono">
                  8.5x11 IN &bull; B&W INTERIOR &bull; 123 PAGES
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.14em] bg-zinc-950 text-white px-2 py-0.5 font-mono flex items-center gap-1">
                  <Sparkles size={8} /> GEMINI SECURED
                </span>
              </div>
              <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-zinc-950 mt-1.5 font-serif">
                The Coffee Journal Interior Maker
              </h1>
              <p className="text-xs text-zinc-500 font-serif mt-1 max-w-2xl leading-relaxed">
                Design custom, high-margin, print-ready interiors for Amazon KDP notebook publishing. Structured with alternating spine-gutter safety margins, real-time page sequence visualization, and bespoke female-focused quote pages.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-6 py-3.5 bg-zinc-950 hover:bg-zinc-900 text-white font-semibold uppercase tracking-[0.12em] text-xs transition-colors shadow-xs active:scale-[0.99] font-mono cursor-pointer border border-zinc-800"
          >
            <Download size={14} />
            Download pdf (123 Pages)
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls Dashboard (5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-6" id="kdp_controls_sidebar">
          
          {/* Trim / Binding info summary card */}
          <div className="bg-white border border-zinc-200 p-5 flex gap-4 items-start shadow-xs">
            <BookOpen className="text-zinc-900 shrink-0 mt-0.5" size={18} strokeWidth={1.5} />
            <div className="text-xs font-sans leading-relaxed text-zinc-700">
              <p className="font-semibold text-zinc-950 text-sm tracking-wide uppercase font-mono">📐 PRINT CONFIGURATION</p>
              <div className="w-12 h-0.5 bg-black my-2"></div>
              <p className="mt-1">
                &bull; <span className="font-medium text-zinc-900">Trim Size:</span> 8.5" x 11" (No Bleed Paperback).
              </p>
              <p>
                &bull; <span className="font-medium text-zinc-900">Total Page Count:</span> <span className="underline font-mono">123 Pages</span>. Structured for exact KDP spine printing signatures (Page 1 Frontispiece, Page 2 Owner Identification, Page 3 Core Coffee Slogan, Page 4-123 Elegant Alternate Lined Pages).
              </p>
            </div>
          </div>

          {/* Settings Navigation Tabs */}
          <div className="flex bg-zinc-200/60 p-1 border border-zinc-200">
            <button
              onClick={() => setActiveTab('visuals')}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'visuals'
                  ? 'bg-zinc-950 text-white'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/50'
              }`}
            >
              <Layers size={12} /> Elements
            </button>
            <button
              onClick={() => setActiveTab('margins')}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'margins'
                  ? 'bg-zinc-950 text-white'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/50'
              }`}
            >
              <Sliders size={12} /> Margins & Ruled
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'quotes'
                  ? 'bg-zinc-950 text-white'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/50'
              }`}
            >
              <Sparkles size={12} /> AI Slogans
            </button>
          </div>

          {/* Active Settings Panel Body */}
          <div className="bg-white border border-zinc-200 p-6 shadow-xs">
            
            {/* TAB 1: VISUAL ELEMENTS & HEADER/FOOTERS */}
            {activeTab === 'visuals' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest font-mono flex items-center gap-2 border-b border-zinc-200 pb-2 mb-4">
                    ☕ Title Page Customization
                  </h3>
                  
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1 font-mono">
                        Main Title
                      </label>
                      <input
                        type="text"
                        value={config.firstPageTitle}
                        onChange={(e) => updateConfig({ firstPageTitle: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-none border border-zinc-300 bg-zinc-50 focus:bg-white focus:border-zinc-950 outline-none"
                        placeholder="My Coffee Lover Journal"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1 font-mono">
                        Aesthetic Subtitle / Vibe Line
                      </label>
                      <input
                        type="text"
                        value={config.firstPageSubtitle}
                        onChange={(e) => updateConfig({ firstPageSubtitle: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-none border border-zinc-300 bg-zinc-50 focus:bg-white focus:border-zinc-950 outline-none"
                        placeholder="Thoughts brewed in the quiet of the morning."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest font-mono flex items-center gap-2 border-b border-zinc-200 pb-2 mb-4">
                    📝 Property Page Details
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-700">Name Designation line</span>
                      <input
                        type="checkbox"
                        checked={config.hasOwnerNameLine}
                        onChange={(e) => updateConfig({ hasOwnerNameLine: e.target.checked })}
                        className="rounded-none text-zinc-950 focus:ring-zinc-950 accent-black h-4 w-4 bg-zinc-50 border-zinc-300"
                      />
                    </div>
                    {config.hasOwnerNameLine && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1 font-mono">
                          Owner Default Value (blank for manual writing)
                        </label>
                        <input
                          type="text"
                          value={config.ownerName}
                          onChange={(e) => updateConfig({ ownerName: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-none border border-zinc-300 bg-zinc-50 focus:bg-white focus:border-zinc-950 outline-none"
                          placeholder="Your Name Here"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest font-mono flex items-center justify-between border-b border-zinc-200 pb-2 mb-4">
                    <span>🎨 Watermark Graphic Design</span>
                    {config.coffeeCupStyle === 'custom' && (
                      <span className="text-[9px] uppercase tracking-wider bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 border border-emerald-200 font-mono">
                        Active: Custom
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed mb-4">
                    This main graphic element prints as a beautiful watermark at the outer bottom corner of writing pages (alternating placement for printer signatures).
                  </p>

                  {/* Option Tabs / Choice */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        // Reset to first preset if clicking standard
                        updateConfig({ coffeeCupStyle: 'cozy-heart' });
                      }}
                      className={`py-2 text-[10px] font-bold uppercase tracking-wider border font-mono transition-all cursor-pointer ${
                        config.coffeeCupStyle !== 'custom'
                          ? 'border-zinc-950 bg-zinc-950 text-white'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                      }`}
                    >
                      Preset Vectors
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateConfig({ coffeeCupStyle: 'custom' });
                      }}
                      className={`py-2 text-[10px] font-bold uppercase tracking-wider border font-mono transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        config.coffeeCupStyle === 'custom'
                          ? 'border-zinc-950 bg-zinc-950 text-white'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                      }`}
                    >
                      <Sparkles size={10} /> Bespoke / AI Icon
                    </button>
                  </div>

                  {config.coffeeCupStyle !== 'custom' ? (
                    <div className="grid grid-cols-1 gap-2">
                      {COFFEE_CUP_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => updateConfig({ coffeeCupStyle: preset.id as any })}
                          className={`text-left p-3 border text-xs flex flex-col gap-0.5 transition-all outline-none cursor-pointer ${
                            config.coffeeCupStyle === preset.id
                              ? 'border-zinc-950 bg-zinc-50 font-medium'
                              : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50/50'
                          }`}
                        >
                          <span className="font-semibold text-zinc-950">{preset.label}</span>
                          <span className="text-[10px] text-zinc-500">{preset.desc}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-zinc-200 p-4 bg-zinc-50/60 flex flex-col gap-5 sm:gap-6 animate-fade-in">
                      
                      {/* Subtitle / Description of Custom Mode */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono block">CUSTOM VECTOR SYSTEM</span>
                        <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                          Integrate your own custom branding watermark, or brew an original SVG vector instantly with Gemini AI.
                        </p>
                      </div>

                      {/* SECTION A: FILE UPLOAD */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5 font-mono">
                          📁 Option 1: Upload Vector SVG or PNG
                        </label>
                        <div className="flex flex-col gap-2">
                          <label className="w-full flex flex-col items-center justify-center border border-dashed border-zinc-350 bg-white hover:bg-zinc-50/80 cursor-pointer p-5 transition-all">
                            <div className="flex flex-col items-center justify-center text-center">
                              <Layers size={20} className="text-zinc-400 mb-1.5" />
                              <span className="text-xs font-semibold text-zinc-950 uppercase tracking-wider block">CHOOSE SVG OR PNG FILE</span>
                              <span className="text-[9px] text-zinc-500 mt-0.5 block">File must be SVG or PNG (Minimum recommended 1000px)</span>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".svg,.png" 
                              onChange={handleImageUpload}
                            />
                          </label>

                          {/* Success and Error Indicators */}
                          {uploadError && (
                            <div className="bg-red-50 text-red-800 border border-red-100 text-[10px] px-3 py-2 leading-relaxed flex items-start gap-1.5">
                              <AlertCircle size={12} className="shrink-0 mt-0.5 text-red-500" />
                              <span>{uploadError}</span>
                            </div>
                          )}

                          {uploadSuccess && (
                            <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] px-3 py-2 leading-relaxed flex items-start gap-1.5">
                              <Sparkles size={12} className="shrink-0 mt-0.5 text-emerald-500" />
                              <span>{uploadSuccess}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="h-0.5 bg-zinc-200"></div>

                      {/* SECTION B: AI BREW VECTOR GENERATOR */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5 font-mono">
                          ✨ Option 2: AI Brew Vector
                        </label>
                        
                        <div className="flex flex-col gap-3">
                          <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            rows={2}
                            className="w-full text-xs p-2.5 rounded-none border border-zinc-300 bg-white focus:border-zinc-950 outline-none resize-none font-sans leading-relaxed"
                            placeholder="e.g. minimalist line art of a warm steaming cup of coffee with cozy hearts"
                          />

                          {/* Quick Suggestion Prompts */}
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { label: 'French Press', prompt: 'minimalist single-line art french press coffee maker with clean outlines' },
                              { label: 'Cozy Mug', prompt: 'cute steaming cozy mug of coffee with dual small hearts floating above it' },
                              { label: 'Aromatic Beans', prompt: 'three fresh minimalist coffee beans clustered with delicate star sparkles' },
                              { label: 'Chemex Brewer', prompt: 'elegant minimalist Chemex coffee dripper vector ornament lines' }
                            ].map((sug) => (
                              <button
                                key={sug.label}
                                type="button"
                                onClick={() => setAiPrompt(sug.prompt)}
                                className="text-[9px] uppercase font-bold tracking-wider px-2 py-1 bg-zinc-200/50 text-zinc-700 hover:bg-zinc-300/60 hover:text-zinc-950 transition-all font-mono cursor-pointer border border-zinc-300"
                              >
                                {sug.label}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            disabled={isBrewing}
                            onClick={handleAIBrew}
                            className={`w-full py-3 text-xs uppercase font-bold tracking-[0.1em] font-mono border transition-all cursor-pointer ${
                              isBrewing
                                ? 'bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed'
                                : 'bg-zinc-950 border-zinc-800 text-white hover:bg-zinc-900 active:scale-[0.99]'
                            }`}
                          >
                            {isBrewing ? 'Dripping vector elements... ☕' : 'Brew Custom SVG with Gemini'}
                          </button>

                          {brewError && (
                            <div className="bg-red-50 text-red-800 border border-red-100 text-[10px] px-3 py-2 leading-relaxed flex items-start gap-1.5">
                              <AlertCircle size={12} className="shrink-0 mt-0.5 text-red-500" />
                              <span>{brewError}</span>
                            </div>
                          )}

                          {config.customCoffeeCupSvgOrPng && (
                            <div className="flex items-center gap-3 bg-white p-2.5 border border-zinc-200 mt-2">
                              <div className="w-12 h-12 bg-zinc-100/50 border border-zinc-200 shrink-0 flex items-center justify-center p-1 overflow-hidden">
                                {getCoffeeSVG('custom', 40, '', config.customCoffeeCupSvgOrPng)}
                              </div>
                              <div className="text-[10px]">
                                <span className="font-bold text-zinc-950 block">Current Watermark Preview</span>
                                <span className="text-zinc-500 block">This logo will print perfectly within your 123-page interior layout.</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest font-mono flex items-center gap-2 border-b border-zinc-200 pb-2 mb-4">
                    ⚙️ Header & Footer Widgets
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5 pr-2">
                        <span className="text-xs font-medium text-zinc-700">Top Date Block</span>
                        <span className="text-[10px] text-zinc-400">Adds an elegant "Date" write-in bar</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.hasTopDateBlock}
                        onChange={(e) => updateConfig({ hasTopDateBlock: e.target.checked })}
                        className="rounded-none text-zinc-950 focus:ring-zinc-950 accent-black h-4 w-4 bg-zinc-50 border-zinc-300"
                      />
                    </div>

                    {config.hasTopDateBlock && (
                      <div className="flex items-center justify-between pl-4 border-l border-zinc-300">
                        <div className="flex flex-col gap-0.5 pr-2">
                          <span className="text-xs font-medium text-zinc-700">"Daily Vibe" Coffee Rating</span>
                          <span className="text-[10px] text-zinc-400">Adds 5 blank coffee beans to color in</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={config.hasBeanRating}
                          onChange={(e) => updateConfig({ hasBeanRating: e.target.checked })}
                          className="rounded-none text-zinc-950 focus:ring-zinc-950 accent-black h-4 w-4 bg-zinc-50 border-zinc-300"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5 pr-2">
                        <span className="text-xs font-medium text-zinc-700">Sequential Page Numbers</span>
                        <span className="text-[10px] text-zinc-400">Adds pages on outer corners</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.hasPageNumbers}
                        onChange={(e) => updateConfig({ hasPageNumbers: e.target.checked })}
                        className="rounded-none text-zinc-950 focus:ring-zinc-950 accent-black h-4 w-4 bg-zinc-50 border-zinc-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1 font-mono">
                        Centered Custom Footer Affirmation text
                      </label>
                      <input
                        type="text"
                        value={config.customFooterText}
                        onChange={(e) => updateConfig({ customFooterText: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-none border border-zinc-300 bg-zinc-50 focus:bg-white focus:border-zinc-950 outline-none"
                        placeholder="e.g. Brewed with Love & Coffee"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MARGIN CODES & COMFORT WRITING LINES */}
            {activeTab === 'margins' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest font-mono flex items-center gap-2 border-b border-zinc-200 pb-2 mb-4">
                    📏 Alternate Margins (Inches)
                  </h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed mb-4">
                    KDP bound printing requires strict margins. The inside binding safety margin is automatically flipped on even pages so content never prints too close to the book spine.
                  </p>

                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1 font-mono">
                        <span className="font-semibold text-zinc-700">Inside Margin / Gutter:</span>
                        <span className="font-bold text-zinc-950 bg-zinc-100 px-2.5 py-0.5 rounded-none border border-zinc-350">{config.insideMargin}"</span>
                      </div>
                      <input
                        type="range"
                        min="0.375"
                        max="1.25"
                        step="0.0625"
                        value={config.insideMargin}
                        onChange={(e) => updateConfig({ insideMargin: parseFloat(e.target.value) })}
                        className="w-full h-1.5 bg-zinc-200 rounded-none accent-black cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-zinc-400 font-mono mt-0.5">
                        <span>Min (0.375")</span>
                        <span>Suggested (0.75")</span>
                        <span>Max (1.25")</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1 font-mono">
                        <span className="font-semibold text-zinc-700">Outside Margin:</span>
                        <span className="font-bold text-zinc-950 bg-zinc-100 px-2.5 py-0.5 rounded-none border border-zinc-350">{config.outsideMargin}"</span>
                      </div>
                      <input
                        type="range"
                        min="0.25"
                        max="1.0"
                        step="0.0625"
                        value={config.outsideMargin}
                        onChange={(e) => updateConfig({ outsideMargin: parseFloat(e.target.value) })}
                        className="w-full h-1.5 bg-zinc-200 rounded-none accent-black cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-zinc-400 font-mono mt-0.5">
                        <span>Min (0.25")</span>
                        <span>Suggested (0.5")</span>
                        <span>Max (1.0")</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1 font-mono">
                        <span className="font-semibold text-zinc-700">Top & Bottom Margins:</span>
                        <span className="font-bold text-zinc-950 bg-zinc-100 px-2.5 py-0.5 rounded-none border border-zinc-350">{config.topMargin}"</span>
                      </div>
                      <input
                        type="range"
                        min="0.375"
                        max="1.0"
                        step="0.0625"
                        value={config.topMargin}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          updateConfig({ topMargin: val, bottomMargin: val });
                        }}
                        className="w-full h-1.5 bg-zinc-200 rounded-none accent-black cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-zinc-400 font-mono mt-0.5">
                        <span>Min (0.375")</span>
                        <span>Suggested (0.625")</span>
                        <span>Max (1.0")</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest font-mono flex items-center gap-2 border-b border-zinc-200 pb-2 mb-4">
                    📝 Rule Line Spacing
                  </h3>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => updateConfig({ lineHeight: 0.28 })}
                      className={`flex-1 py-2 text-xs transition-all border font-mono tracking-wider ${
                        config.lineHeight === 0.28
                          ? 'border-zinc-950 bg-zinc-950 text-white font-bold'
                          : 'border-zinc-250 text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      COLLEGE (0.28")
                    </button>
                    <button
                      onClick={() => updateConfig({ lineHeight: 0.32 })}
                      className={`flex-1 py-2 text-xs transition-all border font-mono tracking-wider ${
                        config.lineHeight === 0.32
                          ? 'border-zinc-950 bg-zinc-950 text-white font-bold'
                          : 'border-zinc-250 text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      WIDE (0.32")
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1 font-mono">
                      <span className="font-semibold text-zinc-700">Custom Margin Grid Spacing:</span>
                      <span className="font-bold text-zinc-950 bg-zinc-100 px-2 py-0.5 rounded-none border border-zinc-350">{config.lineHeight}"</span>
                    </div>
                    <input
                      type="range"
                      min="0.22"
                      max="0.45"
                      step="0.01"
                      value={config.lineHeight}
                      onChange={(e) => updateConfig({ lineHeight: parseFloat(e.target.value) })}
                      className="w-full h-1.5 bg-zinc-200 rounded-none accent-black cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-400 font-mono mt-0.5">
                      <span>Narrow (0.22" / 5.5mm)</span>
                      <span>Wide (0.45" / 11.4mm)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200 flex gap-3">
                  <AlertCircle size={16} className="text-zinc-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                    <p className="font-semibold text-zinc-800">📏 Standard comfort recommendation:</p>
                    <p className="mt-0.5">
                      The default <span className="font-medium text-zinc-950 underline">0.28 inches (7.1mm)</span> replicates standard USA College Ruled line spacing. This is highly preferred for adult notebook niches, striking a perfect balance between writing density and readability.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SLOGAN WRITER & AI GEMINI BUILDER */}
            {activeTab === 'quotes' && (
              <div className="animate-fade-in">
                <SloganManager config={config} onChangeConfig={updateConfig} />
              </div>
            )}
            
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Preview Spread (7/12) */}
        <div className="lg:col-span-7 flex flex-col gap-6" id="kdp_spread_viewport">
          
          <div className="bg-white border border-zinc-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <AlignLeft size={14} className="text-zinc-950" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-mono">
                  Aesthetic KDP Template Visualizer
                </h2>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                1:1 Scale Print Simulation
              </span>
            </div>

            <KDPPreview config={config} />
          </div>

          {/* Quick FAQ / Guide box */}
          <div className="bg-white border border-zinc-200 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-zinc-200 pb-2.5 font-mono">
              <HelpCircle size={14} className="text-zinc-950" /> KDP Paperback Upload Instructions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-serif leading-relaxed text-zinc-650">
              <div>
                <p className="font-bold text-zinc-950 font-sans mb-1 uppercase tracking-wide text-[10px]">1. Trim Size Selection</p>
                <div className="w-6 h-[1px] bg-black my-1.5"></div>
                <p>When creating your paperback book on KDP Amazon, navigate to the paperback details section and choose <span className="font-semibold text-zinc-900 underline">8.5" x 11"</span> as your trim size.</p>
              </div>
              <div>
                <p className="font-bold text-zinc-950 font-sans mb-1 uppercase tracking-wide text-[10px]">2. No Bleed Setup</p>
                <div className="w-6 h-[1px] bg-black my-1.5"></div>
                <p>Since the writing lines are inset cleanly within custom outer safety margins, you must choose the <span className="font-semibold text-zinc-900 underline">"No Bleed"</span> setting during upload.</p>
              </div>
              <div>
                <p className="font-bold text-zinc-950 font-sans mb-1 uppercase tracking-wide text-[10px]">3. Matte Cover Vibe</p>
                <div className="w-6 h-[1px] bg-black my-1.5"></div>
                <p>For a beautiful female-focused notebook, KDP's <span className="font-semibold text-zinc-900 underline">Matte</span> paperback cover finish is highly recommended over glossy to bring out cozy pastel shades.</p>
              </div>
              <div>
                <p className="font-bold text-zinc-950 font-sans mb-1 uppercase tracking-wide text-[10px]">4. Economical Black & White</p>
                <div className="w-6 h-[1px] bg-black my-1.5"></div>
                <p>Ensure you select <span className="font-semibold text-zinc-900 underline">"Black & White Interior with Cream/White Paper"</span> to minimize print cost and maximize your royalty profits!</p>
              </div>
            </div>
          </div>
        </div>
        
      </main>

      {/* BREWING PDF PROGRESS MODAL */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full border border-zinc-200 p-8 shadow-2xl text-center flex flex-col items-center gap-4">
            <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-none text-zinc-950 relative">
              <Coffee size={32} strokeWidth={1} className="animate-spin" style={{ animationDuration: '4s' }} />
            </div>

            <div className="mt-2 w-full">
              <span className="text-[9px] uppercase font-bold tracking-widest bg-zinc-950 text-white px-2.5 py-1 font-mono">
                Brewing Interior: {progress}% Complete
              </span>
              <h3 className="text-sm font-light uppercase tracking-wider text-zinc-950 font-sans mt-4 text-center">
                Compiling KDP Booklet PDF
              </h3>
              
              {/* Progress bar */}
              <div className="w-full h-[3px] bg-zinc-100 overflow-hidden mx-auto mt-4 border border-zinc-200">
                <div 
                  className="h-full bg-zinc-950 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-[11px] text-zinc-500 font-serif italic leading-relaxed max-w-xs mx-auto mt-4 bg-zinc-50 p-3 border border-zinc-150">
                {progressStatus}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Credit Bar */}
      <footer className="mt-20 py-8 border-t border-zinc-200 text-center text-[10px] font-mono uppercase tracking-wider text-zinc-400">
        <p>KDP Coffee Lover's Interior Engine &bull; Tailored for Female Audiences &bull; 8.5"x11" Black & White Print Compatible</p>
        <p className="text-[9px] mt-1 text-zinc-300 font-sans normal-case italic">Crafting professional Minimalist templates precisely mapped for paperback printers</p>
      </footer>
    </div>
  );
}
