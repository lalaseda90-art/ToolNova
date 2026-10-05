import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FileText, Image as ImageIcon, Calculator, Wrench, Search, Sun, Moon,
  ShieldCheck, Zap, Download, Upload, Copy, Check, RefreshCw, Trash2,
  Plus, ArrowRight, ChevronRight, Sparkles, Layers, FileUp, FileDown,
  Edit3, UserCheck, HelpCircle, AlertCircle, Menu, X, Share2, Printer,
  Eye, CornerUpLeft, Lock, Award, BookOpen, Clock, Globe, BarChart2,
  Grid, Compass, ArrowUpDown, ChevronDown
} from 'lucide-react';

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const TOOL_CATEGORIES = [
  { id: 'all', name: 'All Tools', icon: Grid },
  { id: 'pdf', name: 'PDF Tools', icon: FileText },
  { id: 'image', name: 'Image Tools', icon: ImageIcon },
  { id: 'text', name: 'Text & OCR', icon: Edit3 },
  { id: 'student', name: 'Student & Job', icon: Award },
  { id: 'utility', name: 'General Utilities', icon: Wrench },
];

const TOOLS_DATA = [
  // PDF Tools
  {
    id: 'compress-pdf',
    name: 'PDF Compressor',
    category: 'pdf',
    icon: FileDown,
    badge: 'Popular',
    desc: 'Compress and reduce PDF file size online by downsampling canvas pages.',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf size reducer'],
    route: '/compress-pdf',
    metaDesc: 'Free online PDF compressor tool. Reduce PDF file size quickly right in your browser without losing quality.'
  },
  {
    id: 'merge-pdf',
    name: 'PDF Merger',
    category: 'pdf',
    icon: Layers,
    badge: 'Popular',
    desc: 'Combine multiple PDF files into a single structured document effortlessly.',
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'pdf joiner'],
    route: '/merge-pdf',
    metaDesc: 'Merge multiple PDF documents into one single file online. Fast, free, and secure client-side merging.'
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    category: 'pdf',
    icon: FileUp,
    badge: 'Free',
    desc: 'Convert JPG, PNG, or WebP images into a single professional PDF document.',
    keywords: ['jpg to pdf', 'image to pdf', 'convert jpg to pdf', 'png to pdf'],
    route: '/jpg-to-pdf',
    metaDesc: 'Convert JPG, PNG, and WebP images to PDF online for free. Custom orientation and page sizing options.'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'pdf',
    icon: ImageIcon,
    badge: 'Fast',
    desc: 'Extract and render PDF pages directly into high-quality JPG image files.',
    keywords: ['pdf to jpg', 'pdf to image', 'convert pdf to jpg', 'extract pdf images'],
    route: '/pdf-to-jpg',
    metaDesc: 'Convert PDF pages to high-resolution JPG images online. Pure client-side conversion for high privacy.'
  },
  {
    id: 'pdf-to-png',
    name: 'PDF to PNG',
    category: 'pdf',
    icon: ImageIcon,
    badge: 'HD',
    desc: 'Render PDF pages to crisp PNG images with lossless visual detail.',
    keywords: ['pdf to png', 'convert pdf to png', 'transparent pdf to image'],
    route: '/pdf-to-png',
    metaDesc: 'Convert PDF files to PNG images online instantly with crystal clear resolution.'
  },

  // Image Tools
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    icon: FileDown,
    badge: 'Popular',
    desc: 'Compress JPG, PNG, and WebP images with custom quality and resolution sliders.',
    keywords: ['image compressor', 'compress photo', 'reduce image size', 'kb reducer'],
    route: '/image-compressor',
    metaDesc: 'Compress image files online while preserving quality. Reduce file size in KB/MB instantly.'
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    category: 'image',
    icon: RefreshCw,
    badge: 'Essential',
    desc: 'Convert JPG images into PNG format seamlessly using browser canvas.',
    keywords: ['jpg to png', 'convert jpg to png', 'image format converter'],
    route: '/jpg-to-png',
    metaDesc: 'Convert JPG to PNG online quickly with high output quality.'
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    category: 'image',
    icon: RefreshCw,
    badge: 'Essential',
    desc: 'Convert PNG images to JPG with customizable solid background colors.',
    keywords: ['png to jpg', 'convert png to jpg', 'transparent background fill'],
    route: '/png-to-jpg',
    metaDesc: 'Convert PNG to JPG online easily with background color fill controls.'
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    category: 'image',
    icon: Grid,
    badge: 'Pro',
    desc: 'Resize images to exact pixel dimensions or percentages with aspect ratio lock.',
    keywords: ['image resizer', 'resize photo', 'change image dimensions', 'pixel resizer'],
    route: '/image-resizer',
    metaDesc: 'Resize your images online to exact dimensions in pixels or percentages.'
  },
  {
    id: 'passport-photo-maker',
    name: 'Passport Photo Maker',
    category: 'image',
    icon: UserCheck,
    badge: 'New',
    desc: 'Crop photos to standard official country passport specifications and print grids.',
    keywords: ['passport photo maker', 'passport size photo', '2x2 photo creator', 'visa photo'],
    route: '/passport-photo-maker',
    metaDesc: 'Create official passport and visa photos online. Standard sizes for US, UK, EU, India, and more.'
  },

  // Text / OCR Tools
  {
    id: 'image-to-text',
    name: 'Image to Text (OCR)',
    category: 'text',
    icon: Sparkles,
    badge: 'AI Powered',
    desc: 'Extract text from scanned documents, photos, and screenshots via Tesseract OCR.',
    keywords: ['ocr online', 'image to text', 'extract text from photo', 'read text from image'],
    route: '/image-to-text',
    metaDesc: 'Free online OCR tool to convert images to editable text using client-side AI.'
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    category: 'text',
    icon: BarChart2,
    badge: 'Instant',
    desc: 'Analyze word count, character count, reading time, and keyword density live.',
    keywords: ['word counter', 'character count', 'reading time calculator', 'sentence counter'],
    route: '/word-counter',
    metaDesc: 'Free online word counter & character statistics tool with live keyword density.'
  },

  // Student & Job Tools
  {
    id: 'cv-maker',
    name: 'CV / Resume Maker',
    category: 'student',
    icon: Award,
    badge: 'Top Tool',
    desc: 'Build professional PDF resumes with live formatted layout preview and export.',
    keywords: ['cv maker', 'resume builder', 'free resume maker', 'pdf cv generator'],
    route: '/cv-maker',
    metaDesc: 'Build a beautiful, job-ready resume online for free. Download or print instantly as PDF.'
  },
  {
    id: 'signature-maker',
    name: 'Signature Maker',
    category: 'student',
    icon: Edit3,
    badge: 'Popular',
    desc: 'Draw custom digital signatures on canvas and download as transparent PNGs.',
    keywords: ['signature maker', 'digital signature', 'draw signature online', 'e-signature'],
    route: '/signature-maker',
    metaDesc: 'Create transparent digital signatures online. Draw with mouse or touch screen and download.'
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'student',
    icon: Calculator,
    badge: 'Math',
    desc: 'Solve percentage values, percentage increases, and relative changes quickly.',
    keywords: ['percentage calculator', 'calculate percentage', 'percent change', 'discount calculator'],
    route: '/percentage-calculator',
    metaDesc: 'Free online percentage calculator. Solve X% of Y, percentage increase/decrease, and ratios.'
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    category: 'student',
    icon: Clock,
    badge: 'Exact',
    desc: 'Calculate exact age in years, months, days, total hours, and next birthday countdown.',
    keywords: ['age calculator', 'calculate exact age', 'date of birth calculator', 'how old am i'],
    route: '/age-calculator',
    metaDesc: 'Calculate your exact age in years, months, days, hours, and find out your next birthday countdown.'
  },

  // General Utility Tools
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'utility',
    icon: Compass,
    badge: 'Popular',
    desc: 'Generate downloadable high-res QR codes for URLs, WiFi, contact cards, and text.',
    keywords: ['qr code generator', 'make qr code', 'custom qr code', 'wifi qr code'],
    route: '/qr-code-generator',
    metaDesc: 'Generate custom QR codes online for URLs, Wi-Fi networks, vCards, and plain text.'
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    category: 'utility',
    icon: Lock,
    badge: 'Secure',
    desc: 'Generate cryptographically strong random passwords with customizable parameters.',
    keywords: ['password generator', 'strong password', 'secure random password', 'password maker'],
    route: '/password-generator',
    metaDesc: 'Generate secure, random passwords locally in your browser. Highly customizable and cryptographically safe.'
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    category: 'utility',
    icon: ArrowUpDown,
    badge: 'Multi-Unit',
    desc: 'Convert length, weight, temperature, area, and volume units in real time.',
    keywords: ['unit converter', 'metric converter', 'length converter', 'weight conversion'],
    route: '/unit-converter',
    metaDesc: 'Instant unit converter for length, weight, temperature, area, and volume.'
  },
  {
    id: 'text-case-converter',
    name: 'Text Case Converter',
    category: 'utility',
    icon: Edit3,
    badge: 'Utility',
    desc: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, and Slugify.',
    keywords: ['text case converter', 'uppercase converter', 'lowercase', 'title case maker'],
    route: '/text-case-converter',
    metaDesc: 'Convert text formatting into UPPERCASE, lowercase, Title Case, Sentence case, or URL Slugs.'
  }
];

const BLOG_POSTS = [
  {
    slug: 'how-to-compress-pdf-on-android',
    title: 'How to Compress PDF Files on Android Phones Without Apps',
    date: 'October 2, 2026',
    author: 'ToolNova Tech Team',
    excerpt: 'Learn how to easily downsample and reduce heavy PDF file sizes directly on your Android Chrome browser with complete privacy.'
  },
  {
    slug: 'how-to-convert-jpg-to-pdf',
    title: 'How to Convert Multiple JPG Photos to One PDF Document',
    date: 'September 28, 2026',
    author: 'Sarah Jenkins',
    excerpt: 'Combine assignment photos, receipts, or legal documents into a single organized PDF file without downloading software.'
  },
  {
    slug: 'how-to-reduce-image-size',
    title: 'How to Reduce Image Size in KB for Online Application Forms',
    date: 'September 20, 2026',
    author: 'Alex Rivera',
    excerpt: 'Step-by-step guide to shrinking image sizes to fit strict online form upload limits under 100KB or 500KB.'
  },
  {
    slug: 'how-to-create-a-qr-code',
    title: 'How to Create Custom QR Codes for Wi-Fi Networks & Business Cards',
    date: 'September 15, 2026',
    author: 'ToolNova Tech Team',
    excerpt: 'Generate branded QR codes for instant Wi-Fi connectivity and digital contact sharing with high scan reliability.'
  },
  {
    slug: 'how-to-make-a-passport-photo-online',
    title: 'How to Make Official Passport Photos at Home for Free',
    date: 'September 10, 2026',
    author: 'David Vance',
    excerpt: 'Crop your portrait photos to standard US 2x2 inch or UK 35x45mm sizing and generate printable 4x6 print grids.'
  }
];

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white';

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 animate-bounce ${bg}`}>
      {type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75"><X className="w-4 h-4" /></button>
    </div>
  );
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('toolnova_theme') === 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('toolnova_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('toolnova_theme', 'light');
    }
  }, [darkMode]);

  // Handle browser navigation & direct routing simulation
  const navigateTo = (route) => {
    setCurrentRoute(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Search filtering logic
  const filteredTools = useMemo(() => {
    return TOOLS_DATA.filter((tool) => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.desc.toLowerCase().includes(q) ||
        tool.keywords.some(k => k.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  // Determine current active tool view
  const activeTool = TOOLS_DATA.find(t => t.route === currentRoute);
  const activeBlog = BLOG_POSTS.find(b => `/blog/${b.slug}` === currentRoute);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200">
      
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black text-xl">
              T
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Tool<span className="text-blue-600 dark:text-blue-400">Nova</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Free Client-Side Online Tools
              </span>
            </div>
          </div>

          {/* Quick Header Search */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tools (e.g. PDF Compressor, QR Code)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentRoute !== '/') navigateTo('/');
              }}
              className="w-full pl-9 pr-4 py-1.5 text-sm rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Actions & Navigation Links */}
          <div className="flex items-center gap-2">
            <nav className="hidden lg:flex items-center gap-6 mr-4 text-sm font-medium text-slate-600 dark:text-slate-300">
              <button onClick={() => navigateTo('/')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Home</button>
              <button onClick={() => navigateTo('/blog')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Blog</button>
              <button onClick={() => navigateTo('/about')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">About</button>
              <button onClick={() => navigateTo('/privacy-policy')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Privacy</button>
            </nav>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  navigateTo('/');
                }}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="flex flex-col space-y-2 font-medium text-sm text-slate-600 dark:text-slate-300 pt-2">
              <button onClick={() => navigateTo('/')} className="text-left py-1 hover:text-blue-600">All Tools Home</button>
              <button onClick={() => navigateTo('/blog')} className="text-left py-1 hover:text-blue-600">Tech Blog</button>
              <button onClick={() => navigateTo('/about')} className="text-left py-1 hover:text-blue-600">About ToolNova</button>
              <button onClick={() => navigateTo('/privacy-policy')} className="text-left py-1 hover:text-blue-600">Privacy Policy</button>
              <button onClick={() => navigateTo('/terms')} className="text-left py-1 hover:text-blue-600">Terms of Service</button>
            </div>
          </div>
        )}
      </header>

      {}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HOMEPAGE VIEW */}
        {currentRoute === '/' && (
          <div className="space-y-12">
            
            {/* Hero Section */}
            <section className="text-center space-y-6 pt-4 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                100% Client-Side Local Browser Processing • Zero Server Uploads
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Free Online Tools That <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Just Work.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300">
                Convert, compress, calculate, generate, and edit files right inside your web browser. Ultra-fast, private, and unlimited.
              </p>

              {/* Main Search Bar */}
              <div className="max-w-xl mx-auto relative shadow-xl shadow-blue-500/5 rounded-2xl">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="What tool do you need? (e.g. Compress PDF, Image OCR, QR Code)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 text-base rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
                {TOOL_CATEGORIES.map((cat) => {
                  const IconComponent = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Ad Banner Placeholder */}
            <div className="bg-slate-100 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-4 text-center text-xs text-slate-400 uppercase tracking-widest font-mono">
              [ Advertisement Placeholder - Non-Intrusive Banner ]
            </div>

            {/* Tools Grid */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  Available Tools ({filteredTools.length})
                </h2>
              </div>

              {filteredTools.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
                  <AlertCircle className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">No tools found matching "{searchQuery}"</p>
                  <p className="text-sm text-slate-500 mt-1">Try searching for keywords like "PDF", "Compress", or "Calculator".</p>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Reset Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredTools.map((tool) => {
                    const IconComponent = tool.icon;
                    return (
                      <div
                        key={tool.id}
                        onClick={() => navigateTo(tool.route)}
                        className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              {tool.badge}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {tool.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                              {tool.desc}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                          <span>Open Tool</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Why ToolNova Section */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Why People Choose ToolNova
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Built from the ground up for maximum speed, client-side privacy, and effortless mobile usability.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Client-Side Privacy</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Your confidential PDF documents, images, and text never leave your personal browser session. Everything processes locally.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Instant Speed</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    No waiting for server uploads or queue bottlenecks. Powered by modern JavaScript, HTML5 Canvas, and Web APIs.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">No Signups or Paywalls</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Every tool is completely free with no user registration, email requirements, or hidden daily limits.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">Frequently Asked Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Are my uploaded files uploaded to any server?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    No. ToolNova performs all PDF compression, image rendering, OCR text extraction, and formatting locally on your computer or mobile device.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Does ToolNova work on mobile devices?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Yes! ToolNova is engineered mobile-first and works smoothly on Android Chrome, iOS Safari, tablets, and desktops.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Is there any fee or file size limitation?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    ToolNova is completely free. Processing speed depends on your hardware capabilities since computation happens locally.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Can I use ToolNova offline?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Once the web application page and library scripts are loaded, most tools continue to work even without an active internet connection!
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {}
        {activeTool && (
          <ToolPageLayout tool={activeTool} navigateTo={navigateTo} showToast={showToast}>
            {renderActiveTool(activeTool.id, showToast)}
          </ToolPageLayout>
        )}

        {/* BLOG LISTING VIEW */}
        {currentRoute === '/blog' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">ToolNova Tech & Guides Blog</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Actionable tutorials on PDF optimization, image editing, privacy, and online web tools.</p>
            </div>

            <div className="grid gap-6">
              {BLOG_POSTS.map((post) => (
                <div
                  key={post.slug}
                  onClick={() => navigateTo(`/blog/${post.slug}`)}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition cursor-pointer space-y-3"
                >
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>By {post.author}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white hover:text-blue-600 transition">{post.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{post.excerpt}</p>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 pt-1">
                    Read Full Guide <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INDIVIDUAL BLOG POST VIEW */}
        {activeBlog && (
          <article className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
            <button onClick={() => navigateTo('/blog')} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <CornerUpLeft className="w-4 h-4" /> Back to Blog
            </button>
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-400">{activeBlog.date} • {activeBlog.author}</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">{activeBlog.title}</h1>
            </div>
            <div className="prose dark:prose-invert text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-base font-medium text-slate-800 dark:text-slate-200">{activeBlog.excerpt}</p>
              <p>
                Working with digital documents on mobile devices can often feel restricted due to strict upload limitations or app store clutter. ToolNova provides a streamlined, browser-native method to handle all your daily document tasks without installing third-party apps.
              </p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Key Takeaways for Fast Local Processing:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Files stay securely inside your browser's JS memory sandbox.</li>
                <li>Reduces data usage since no large files are transmitted across cellular networks.</li>
                <li>Works smoothly on low-spec Android and iPhone devices.</li>
              </ul>
              <p>
                To try this right now, visit our homepage and select the relevant tool for instant free access.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => navigateTo('/')} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition">
                Explore All Free Tools
              </button>
            </div>
          </article>
        )}

        {/* INFORMATIONAL PAGES (About, Privacy, Terms) */}
        {currentRoute === '/about' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">About ToolNova</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              ToolNova was built with a simple mission: <strong>Free Online Tools That Just Work.</strong>
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Most online tool platforms subject users to mandatory signups, upload queues, intrusive pop-ups, and privacy risks by processing user documents on unknown cloud servers. ToolNova redefines web utility by performing file calculations, rendering, compression, and conversions directly on the client side using HTML5 Canvas, WebAssembly, and local JavaScript engines.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="block text-2xl font-black text-blue-600 dark:text-blue-400">20+</span>
                <span className="text-xs text-slate-500">Free Utilities</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</span>
                <span className="text-xs text-slate-500">Client-Side Privacy</span>
              </div>
            </div>
          </div>
        )}

        {currentRoute === '/privacy-policy' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Privacy Policy</h1>
            <p className="text-xs text-slate-400">Last updated: October 2026</p>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Local Client-Side Processing</h2>
              <p>
                ToolNova operates predominantly via client-side scripts. When you select a PDF, image, or text file, the file is read directly into your web browser's local memory. No file data is transmitted to or stored on ToolNova servers.
              </p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Analytics & Cookies</h2>
              <p>
                We do not track personally identifiable information (PII). We only store basic theme preferences (such as light/dark mode selection) in your browser's local storage.
              </p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Third-Party Libraries</h2>
              <p>
                Open-source JavaScript libraries (such as pdf-lib, Tesseract.js, and qrcode) are loaded via reputable content delivery networks (CDNs) for optimal performance.
              </p>
            </div>
          </div>
        )}

        {currentRoute === '/terms' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Terms of Service</h1>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>By using ToolNova, you agree to use our client-side utilities responsibly and lawfully.</p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Disclaimer of Warranty</h2>
              <p>
                ToolNova tools are provided "as is" without warranty of any kind. While we strive for maximum accuracy and speed in file processing, users are encouraged to maintain backup copies of critical documents.
              </p>
            </div>
          </div>
        )}
      </main>

      {}
      <footer className="mt-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('/')}>
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base">
                  T
                </div>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  Tool<span className="text-blue-600 dark:text-blue-400">Nova</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                ToolNova delivers ultra-fast, client-side web applications for instant PDF editing, image optimization, OCR extraction, and calculations without server dependencies.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Secure Browser Local Execution
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Popular PDF</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <li><button onClick={() => navigateTo('/compress-pdf')} className="hover:text-blue-600">PDF Compressor</button></li>
                <li><button onClick={() => navigateTo('/merge-pdf')} className="hover:text-blue-600">PDF Merger</button></li>
                <li><button onClick={() => navigateTo('/jpg-to-pdf')} className="hover:text-blue-600">JPG to PDF</button></li>
                <li><button onClick={() => navigateTo('/pdf-to-jpg')} className="hover:text-blue-600">PDF to JPG</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Top Utilities</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <li><button onClick={() => navigateTo('/image-compressor')} className="hover:text-blue-600">Image Compressor</button></li>
                <li><button onClick={() => navigateTo('/image-to-text')} className="hover:text-blue-600">Image to Text (OCR)</button></li>
                <li><button onClick={() => navigateTo('/cv-maker')} className="hover:text-blue-600">CV / Resume Maker</button></li>
                <li><button onClick={() => navigateTo('/qr-code-generator')} className="hover:text-blue-600">QR Code Generator</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Company & Legal</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <li><button onClick={() => navigateTo('/about')} className="hover:text-blue-600">About Us</button></li>
                <li><button onClick={() => navigateTo('/blog')} className="hover:text-blue-600">Tech Blog</button></li>
                <li><button onClick={() => navigateTo('/privacy-policy')} className="hover:text-blue-600">Privacy Policy</button></li>
                <li><button onClick={() => navigateTo('/terms')} className="hover:text-blue-600">Terms of Service</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© 2026 ToolNova. All rights reserved. Built for speed and client-side privacy.</p>
            <p className="flex items-center gap-1">
              <span>Mobile First</span> • <span>Cloudflare Ready</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ToolPageLayout({ tool, navigateTo, showToast, children }) {
  const IconComponent = tool.icon;
  const relatedTools = TOOLS_DATA.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 3);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Breadcrumb & Navigation Header */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <button onClick={() => navigateTo('/')} className="hover:text-blue-600">Home</button>
        <ChevronRight className="w-3 h-3" />
        <span className="capitalize">{tool.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 dark:text-white font-medium">{tool.name}</span>
      </div>

      {/* Tool Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {tool.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {tool.desc}
            </p>
          </div>
        </div>

        {/* Client-Side Privacy Notice Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Processed 100% locally in your browser — zero file uploads to servers.</span>
        </div>
      </div>

      {/* Interactive Tool Main Execution Workspace */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {children}
      </div>

      {/* How To Use & Features Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" /> How to use {tool.name}
          </h3>
          <ol className="list-decimal pl-4 space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <li>Select or upload your source files into the tool interface.</li>
            <li>Adjust settings, sliders, or dimensions according to your preferences.</li>
            <li>Click the process or generate action button.</li>
            <li>Preview the output and click download to save directly to your device.</li>
          </ol>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" /> Key Benefits & Features
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Lightning fast browser computation.</li>
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Complete privacy guarantees.</li>
            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> No limits or mandatory user account creation.</li>
          </ul>
        </div>
      </div>

      {/* Related Tools Navigation */}
      {relatedTools.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Related Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((rel) => {
              const RelIcon = rel.icon;
              return (
                <div
                  key={rel.id}
                  onClick={() => navigateTo(rel.route)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl hover:border-blue-500 cursor-pointer flex items-center gap-3 transition"
                >
                  <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-lg">
                    <RelIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rel.name}</h4>
                    <span className="text-[10px] text-slate-400">Try Tool →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function renderActiveTool(toolId, showToast) {
  switch (toolId) {
    case 'compress-pdf': return <PdfCompressorTool showToast={showToast} />;
    case 'merge-pdf': return <PdfMergerTool showToast={showToast} />;
    case 'jpg-to-pdf': return <JpgToPdfTool showToast={showToast} />;
    case 'pdf-to-jpg': return <PdfToImageTool format="jpg" showToast={showToast} />;
    case 'pdf-to-png': return <PdfToImageTool format="png" showToast={showToast} />;
    case 'image-compressor': return <ImageCompressorTool showToast={showToast} />;
    case 'jpg-to-png': return <ImageFormatTool targetFormat="png" showToast={showToast} />;
    case 'png-to-jpg': return <ImageFormatTool targetFormat="jpg" showToast={showToast} />;
    case 'image-resizer': return <ImageResizerTool showToast={showToast} />;
    case 'passport-photo-maker': return <PassportPhotoTool showToast={showToast} />;
    case 'image-to-text': return <ImageToTextOcrTool showToast={showToast} />;
    case 'word-counter': return <WordCounterTool showToast={showToast} />;
    case 'cv-maker': return <CvMakerTool showToast={showToast} />;
    case 'signature-maker': return <SignatureMakerTool showToast={showToast} />;
    case 'percentage-calculator': return <PercentageCalculatorTool showToast={showToast} />;
    case 'age-calculator': return <AgeCalculatorTool showToast={showToast} />;
    case 'qr-code-generator': return <QrCodeGeneratorTool showToast={showToast} />;
    case 'password-generator': return <PasswordGeneratorTool showToast={showToast} />;
    case 'unit-converter': return <UnitConverterTool showToast={showToast} />;
    case 'text-case-converter': return <TextCaseConverterTool showToast={showToast} />;
    default: return <div>Tool interface loading...</div>;
  }
}

function PdfCompressorTool({ showToast }) {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(0.6);
  const [scale, setScale] = useState(1.2);
  const [processing, setProcessing] = useState(false);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [origSize, setOrigSize] = useState(0);
  const [newSize, setNewSize] = useState(0);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setOrigSize(f.size);
      setCompressedBlob(null);
    } else {
      showToast('Please select a valid PDF document.', 'error');
    }
  };

  const processCompress = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js');
      await loadScript('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js');

      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

      const fileArrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: fileArrayBuffer }).promise;
      
      const newPdfDoc = await window.PDFLib.PDFDocument.create();

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;

        const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
        const jpgImage = await newPdfDoc.embedJpg(imgDataUrl);

        const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
        newPage.drawImage(jpgImage, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height,
        });
      }

      const compressedBytes = await newPdfDoc.save();
      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      setCompressedBlob(blob);
      setNewSize(blob.size);
      showToast('PDF compressed successfully!');
    } catch (err) {
      console.error(err);
      showToast('Error compressing PDF. File may be encrypted.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-800/30">
        <Upload className="w-10 h-10 mx-auto text-blue-500 mb-3" />
        <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-comp-input" />
        <label htmlFor="pdf-comp-input" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold cursor-pointer inline-block shadow-md">
          Select PDF File
        </label>
        {file && (
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 font-mono">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {file && (
        <div className="space-y-4 bg-slate-100 dark:bg-slate-800 p-5 rounded-2xl">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
              <span>Compression Level (Quality: {Math.round(quality * 100)}%)</span>
              <span>{quality < 0.5 ? 'High Compression' : 'Balanced'}</span>
            </label>
            <input
              type="range"
              min="0.2"
              max="0.9"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <button
            onClick={processCompress}
            disabled={processing}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            {processing ? 'Compressing PDF...' : 'Compress PDF File'}
          </button>
        </div>
      )}

      {compressedBlob && (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-emerald-800 dark:text-emerald-300">Compression Complete!</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-mono">
              -{(100 - (newSize / origSize) * 100).toFixed(0)}% Saved
            </span>
          </div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-mono">
            <span>Original: {(origSize / 1024 / 1024).toFixed(2)} MB</span>
            <span>New Size: {(newSize / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <a
            href={URL.createObjectURL(compressedBlob)}
            download={`compressed_${file?.name || 'document.pdf'}`}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow transition"
          >
            <Download className="w-4 h-4" /> Download Compressed PDF
          </a>
        </div>
      )}
    </div>
  );
}

function PdfMergerTool({ showToast }) {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    if (selected.length === 0) {
      showToast('Please select valid PDF files.', 'error');
      return;
    }
    setFiles(prev => [...prev, ...selected]);
  };

  const removeFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      showToast('Please select at least 2 PDF files to merge.', 'error');
      return;
    }
    setProcessing(true);
    try {
      await loadScript('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js');
      const mergedPdf = await window.PDFLib.PDFDocument.create();

      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await window.PDFLib.PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged_document.pdf';
      link.click();

      showToast('PDFs merged and download started!');
    } catch (err) {
      console.error(err);
      showToast('Error merging PDF files.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-800/30">
        <Layers className="w-10 h-10 mx-auto text-blue-500 mb-3" />
        <input type="file" accept=".pdf" multiple onChange={handleFiles} className="hidden" id="pdf-merge-input" />
        <label htmlFor="pdf-merge-input" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold cursor-pointer inline-block shadow">
          Add PDF Files
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Selected Documents ({files.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                <span className="truncate max-w-xs">{i + 1}. {f.name}</span>
                <button onClick={() => removeFile(i)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={mergePdfs}
            disabled={processing}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-sm shadow transition flex items-center justify-center gap-2"
          >
            {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
            {processing ? 'Merging Documents...' : 'Merge & Download PDF'}
          </button>
        </div>
      )}
    </div>
  );
}

function JpgToPdfTool({ showToast }) {
  const [images, setImages] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    setImages(prev => [...prev, ...files]);
  };

  const convertToPdf = async () => {
    if (images.length === 0) {
      showToast('Please select at least one image.', 'error');
      return;
    }
    setProcessing(true);
    try {
      await loadScript('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js');
      const pdfDoc = await window.PDFLib.PDFDocument.create();

      for (const file of images) {
        const buffer = await file.arrayBuffer();
        let img;
        if (file.type === 'image/png') {
          img = await pdfDoc.embedPng(buffer);
        } else {
          img = await pdfDoc.embedJpg(buffer);
        }

        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted_images.pdf';
      link.click();

      showToast('JPG converted to PDF successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to convert images to PDF.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-800/30">
        <ImageIcon className="w-10 h-10 mx-auto text-blue-500 mb-3" />
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" id="jpg-pdf-input" />
        <label htmlFor="jpg-pdf-input" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold cursor-pointer inline-block shadow">
          Select Images (JPG, PNG)
        </label>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={convertToPdf}
            disabled={processing}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow flex items-center justify-center gap-2"
          >
            {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
            {processing ? 'Generating PDF...' : 'Convert to PDF & Download'}
          </button>
        </div>
      )}
    </div>
  );
}

function PdfToImageTool({ format, showToast }) {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setPages([]);
    } else {
      showToast('Please select a PDF file.', 'error');
    }
  };

  const convertPdfToImages = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js');
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

      const buffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
      const pageImages = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;
        const mime = format === 'png' ? 'image/png' : 'image/jpeg';
        pageImages.push({ pageNum: i, dataUrl: canvas.toDataURL(mime, 0.92) });
      }

      setPages(pageImages);
      showToast(`PDF converted to ${format.toUpperCase()} images!`);
    } catch (err) {
      console.error(err);
      showToast('Error converting PDF to images.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-800/30">
        <FileDown className="w-10 h-10 mx-auto text-blue-500 mb-3" />
        <input type="file" accept=".pdf" onChange={handleFile} className="hidden" id="pdf-img-input" />
        <label htmlFor="pdf-img-input" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold cursor-pointer inline-block shadow">
          Select PDF File
        </label>
        {file && <p className="text-xs text-slate-500 mt-2">{file.name}</p>}
      </div>

      {file && pages.length === 0 && (
        <button
          onClick={convertPdfToImages}
          disabled={processing}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow flex items-center justify-center gap-2"
        >
          {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          {processing ? 'Rendering Pages...' : `Convert PDF to ${format.toUpperCase()}`}
        </button>
      )}

      {pages.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Converted Pages ({pages.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pages.map((p) => (
              <div key={p.pageNum} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
                <img src={p.dataUrl} alt={`Page ${p.pageNum}`} className="w-full rounded border" />
                <a
                  href={p.dataUrl}
                  download={`page_${p.pageNum}.${format}`}
                  className="w-full py-1.5 bg-blue-600 text-white text-xs font-semibold rounded flex items-center justify-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download Page {p.pageNum}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ImageCompressorTool({ showToast }) {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(0.7);
  const [compressedDataUrl, setCompressedDataUrl] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleImage = (e) => {
    const f = e.target.files[0];
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setCompressedDataUrl(null);
    } else {
      showToast('Please upload a valid image file.', 'error');
    }
  };

  const compress = () => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      setCompressedDataUrl(dataUrl);

      // Estimate byte size
      const head = 'data:image/jpeg;base64,';
      const bytes = Math.round((dataUrl.length - head.length) * 3 / 4);
      setCompressedSize(bytes);
      showToast('Image compressed successfully!');
    };
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-800/30">
        <ImageIcon className="w-10 h-10 mx-auto text-blue-500 mb-3" />
        <input type="file" accept="image/*" onChange={handleImage} className="hidden" id="img-comp-input" />
        <label htmlFor="img-comp-input" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold cursor-pointer inline-block shadow">
          Select Image (JPG/PNG/WebP)
        </label>
        {file && <p className="text-xs text-slate-500 mt-2 font-mono">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
      </div>

      {file && (
        <div className="space-y-4 bg-slate-100 dark:bg-slate-800 p-5 rounded-2xl">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
              <span>Quality ({Math.round(quality * 100)}%)</span>
              <span>{quality < 0.5 ? 'High Compression' : 'Best Quality'}</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <button onClick={compress} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow">
            Compress Image Now
          </button>
        </div>
      )}

      {compressedDataUrl && (
        <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span>Original: {(file.size / 1024).toFixed(1)} KB</span>
            <span className="font-bold text-emerald-600">New: {(compressedSize / 1024).toFixed(1)} KB</span>
          </div>

          <img src={compressedDataUrl} alt="Compressed" className="max-h-64 mx-auto rounded border" />

          <a
            href={compressedDataUrl}
            download={`compressed_${file?.name || 'image.jpg'}`}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow"
          >
            <Download className="w-4 h-4" /> Download Compressed Image
          </a>
        </div>
      )}
    </div>
  );
}

function ImageFormatTool({ targetFormat, showToast }) {
  const [file, setFile] = useState(null);
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [bgColor, setBgColor] = useState('#FFFFFF');

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setConvertedUrl(null);
    }
  };

  const convertFormat = () => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (targetFormat === 'jpg') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      const mime = targetFormat === 'png' ? 'image/png' : 'image/jpeg';
      setConvertedUrl(canvas.toDataURL(mime, 0.95));
      showToast(`Image converted to ${targetFormat.toUpperCase()}!`);
    };
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-800/30">
        <RefreshCw className="w-10 h-10 mx-auto text-blue-500 mb-3" />
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" id="fmt-input" />
        <label htmlFor="fmt-input" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold cursor-pointer inline-block shadow">
          Upload Image
        </label>
        {file && <p className="text-xs text-slate-500 mt-2">{file.name}</p>}
      </div>

      {file && (
        <div className="space-y-4">
          {targetFormat === 'jpg' && (
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold">Background Fill Color for Transparency:</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
            </div>
          )}

          <button onClick={convertFormat} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow">
            Convert to {targetFormat.toUpperCase()}
          </button>
        </div>
      )}

      {convertedUrl && (
        <div className="text-center space-y-3">
          <img src={convertedUrl} alt="Converted" className="max-h-64 mx-auto rounded border" />
          <a
            href={convertedUrl}
            download={`converted.${targetFormat}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow"
          >
            <Download className="w-4 h-4" /> Download {targetFormat.toUpperCase()}
          </a>
        </div>
      )}
    </div>
  );
}

function ImageResizerTool({ showToast }) {
  const [file, setFile] = useState(null);
  const [origDimensions, setOrigDimensions] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [resizedUrl, setResizedUrl] = useState(null);

  const handleImage = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      const img = new Image();
      img.src = URL.createObjectURL(f);
      img.onload = () => {
        setOrigDimensions({ w: img.width, h: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
    }
  };

  const handleWidthChange = (val) => {
    const w = parseInt(val) || 0;
    setWidth(w);
    if (lockAspect && origDimensions.w > 0) {
      setHeight(Math.round((w / origDimensions.w) * origDimensions.h));
    }
  };

  const handleHeightChange = (val) => {
    const h = parseInt(val) || 0;
    setHeight(h);
    if (lockAspect && origDimensions.h > 0) {
      setWidth(Math.round((h / origDimensions.h) * origDimensions.w));
    }
  };

  const processResize = () => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      setResizedUrl(canvas.toDataURL('image/jpeg', 0.92));
      showToast('Image resized successfully!');
    };
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-800/30">
        <Grid className="w-10 h-10 mx-auto text-blue-500 mb-3" />
        <input type="file" accept="image/*" onChange={handleImage} className="hidden" id="resize-input" />
        <label htmlFor="resize-input" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold cursor-pointer inline-block shadow">
          Select Image
        </label>
        {file && <p className="text-xs text-slate-500 mt-2">Original: {origDimensions.w} x {origDimensions.h} px</p>}
      </div>

      {file && (
        <div className="space-y-4 bg-slate-100 dark:bg-slate-800 p-5 rounded-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full mt-1 p-2 text-sm rounded-lg border dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full mt-1 p-2 text-sm rounded-lg border dark:bg-slate-900"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input type="checkbox" checked={lockAspect} onChange={(e) => setLockAspect(e.target.checked)} />
            Lock Aspect Ratio
          </label>

          <button onClick={processResize} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow">
            Resize Image
          </button>
        </div>
      )}

      {resizedUrl && (
        <div className="text-center space-y-3">
          <img src={resizedUrl} alt="Resized" className="max-h-64 mx-auto rounded border" />
          <a
            href={resizedUrl}
            download="resized_image.jpg"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow"
          >
            <Download className="w-4 h-4" /> Download Resized Image
          </a>
        </div>
      )}
    </div>
  );
}

function PassportPhotoTool({ showToast }) {
  const [file, setFile] = useState(null);
  const [preset, setPreset] = useState('us'); // us, uk, eu
  const [photoUrl, setPhotoUrl] = useState(null);

  const presets = {
    us: { name: 'US / India (2x2 inch)', w: 600, h: 600 },
    uk: { name: 'UK / Europe (35x45 mm)', w: 413, h: 531 },
    ca: { name: 'Canada (50x70 mm)', w: 590, h: 826 }
  };

  const handleImage = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const generatePassportPhoto = () => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const cfg = presets[preset];
      const canvas = document.createElement('canvas');
      canvas.width = cfg.w;
      canvas.height = cfg.h;
      const ctx = canvas.getContext('2d');

      // White background fill
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, cfg.w, cfg.h);

      // Fit center cover crop
      const aspectImg = img.width / img.height;
      const aspectCanvas = cfg.w / cfg.h;
      let renderW = cfg.w;
      let renderH = cfg.h;
      let offsetX = 0;
      let offsetY = 0;

      if (aspectImg > aspectCanvas) {
        renderW = cfg.h * aspectImg;
        offsetX = -(renderW - cfg.w) / 2;
      } else {
        renderH = cfg.w / aspectImg;
        offsetY = -(renderH - cfg.h) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
      setPhotoUrl(canvas.toDataURL('image/jpeg', 0.95));
      showToast('Passport size photo generated!');
    };
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-800/30">
        <UserCheck className="w-10 h-10 mx-auto text-blue-500 mb-3" />
        <input type="file" accept="image/*" onChange={handleImage} className="hidden" id="pass-input" />
        <label htmlFor="pass-input" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold cursor-pointer inline-block shadow">
          Upload Portrait Photo
        </label>
        {file && <p className="text-xs text-slate-500 mt-2">{file.name}</p>}
      </div>

      {file && (
        <div className="space-y-4 bg-slate-100 dark:bg-slate-800 p-5 rounded-2xl">
          <div>
            <label className="text-xs font-semibold">Select Country Specification:</label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="w-full mt-1 p-2.5 text-sm rounded-lg border dark:bg-slate-900"
            >
              {Object.entries(presets).map(([k, v]) => (
                <option key={k} value={k}>{v.name}</option>
              ))}
            </select>
          </div>

          <button onClick={generatePassportPhoto} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow">
            Create Passport Photo
          </button>
        </div>
      )}

      {photoUrl && (
        <div className="text-center space-y-3">
          <img src={photoUrl} alt="Passport Output" className="w-40 h-40 object-cover mx-auto rounded border shadow-lg" />
          <a
            href={photoUrl}
            download="passport_photo.jpg"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow"
          >
            <Download className="w-4 h-4" /> Download Photo
          </a>
        </div>
      )}
    </div>
  );
}

function ImageToTextOcrTool({ showToast }) {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImage = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const processOcr = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(10);
    try {
      await loadScript('https://unpkg.com/tesseract.js@v2.1.0/dist/tesseract.min.js');
      
      const worker = window.Tesseract.createWorker({
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      setExtractedText(text);
      showToast('Text extracted successfully!');
    } catch (err) {
      console.error(err);
      showToast('OCR extraction failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-800/30">
        <Sparkles className="w-10 h-10 mx-auto text-blue-500 mb-3" />
        <input type="file" accept="image/*" onChange={handleImage} className="hidden" id="ocr-input" />
        <label htmlFor="ocr-input" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold cursor-pointer inline-block shadow">
          Upload Document Image
        </label>
        {file && <p className="text-xs text-slate-500 mt-2">{file.name}</p>}
      </div>

      {file && (
        <button
          onClick={processOcr}
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow flex items-center justify-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? `Extracting Text (${progress}%)...` : 'Extract Text (OCR)'}
        </button>
      )}

      {extractedText && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Extracted Text Output</label>
            <button
              onClick={() => {
                navigator.clipboard.writeText(extractedText);
                showToast('Copied to clipboard!');
              }}
              className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-xs font-semibold rounded hover:bg-slate-300 flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Text
            </button>
          </div>
          <textarea
            value={extractedText}
            readOnly
            rows={8}
            className="w-full p-4 text-sm font-mono rounded-xl border dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}

function WordCounterTool({ showToast }) {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
    const readTime = Math.ceil(words / 200);

    return { words, chars, charsNoSpaces, sentences, paragraphs, readTime };
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
          <span className="block text-2xl font-black text-blue-600">{stats.words}</span>
          <span className="text-[10px] text-slate-500 uppercase font-bold">Words</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
          <span className="block text-2xl font-black text-indigo-600">{stats.chars}</span>
          <span className="text-[10px] text-slate-500 uppercase font-bold">Characters</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
          <span className="block text-2xl font-black text-purple-600">{stats.charsNoSpaces}</span>
          <span className="text-[10px] text-slate-500 uppercase font-bold">No Spaces</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
          <span className="block text-2xl font-black text-emerald-600">{stats.sentences}</span>
          <span className="text-[10px] text-slate-500 uppercase font-bold">Sentences</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
          <span className="block text-2xl font-black text-amber-600">{stats.paragraphs}</span>
          <span className="text-[10px] text-slate-500 uppercase font-bold">Paragraphs</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
          <span className="block text-2xl font-black text-rose-600">{stats.readTime} min</span>
          <span className="text-[10px] text-slate-500 uppercase font-bold">Read Time</span>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here to analyze..."
        rows={8}
        className="w-full p-4 text-sm rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(text);
            showToast('Text copied!');
          }}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-300"
        >
          Copy Text
        </button>
        <button
          onClick={() => setText('')}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

function CvMakerTool({ showToast }) {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    title: 'Senior Software Engineer',
    email: 'john.doe@example.com',
    phone: '+1 (555) 019-2834',
    summary: 'Dedicated and result-driven engineer with 5+ years of experience building responsive web applications and scalable client-side systems.',
    education: 'B.S. in Computer Science - Tech University (2018-2022)',
    experience: 'Frontend Developer - Acme Corp (2022-Present)\n- Built client-side web platforms.\n- Improved page performance scores by 40%.',
    skills: 'JavaScript, React, HTML5, CSS3, Tailwind CSS, Performance Optimization'
  });

  const handlePrint = () => {
    window.print();
    showToast('Printing CV dialog opened.');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Form Controls */}
        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">CV Information</h3>
          
          <div>
            <label className="text-xs font-semibold">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mt-1 p-2 text-sm rounded border dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Professional Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full mt-1 p-2 text-sm rounded border dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold">Email</label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full mt-1 p-2 text-sm rounded border dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full mt-1 p-2 text-sm rounded border dark:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold">Professional Summary</label>
            <textarea
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full mt-1 p-2 text-sm rounded border dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Work Experience</label>
            <textarea
              rows={4}
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full mt-1 p-2 text-sm rounded border dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Education</label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full mt-1 p-2 text-sm rounded border dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Key Skills</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full mt-1 p-2 text-sm rounded border dark:bg-slate-900"
            />
          </div>
        </div>

        {/* Live Resume Preview Box */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">Live Formatted Preview</h3>
            <button onClick={handlePrint} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow">
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
          </div>

          <div id="cv-preview-area" className="p-6 bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200 space-y-4 font-sans">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-black text-slate-900">{formData.name || 'Your Name'}</h2>
              <p className="text-xs font-semibold text-blue-600">{formData.title}</p>
              <p className="text-[11px] text-slate-500 mt-1">{formData.email} • {formData.phone}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Profile Summary</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{formData.summary}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Work Experience</h4>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{formData.experience}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Education</h4>
              <p className="text-xs text-slate-700">{formData.education}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Skills</h4>
              <p className="text-xs text-slate-700">{formData.skills}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignatureMakerTool({ showToast }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
  }, [color]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext('2d').beginPath();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadSignature = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'signature.png';
    link.click();
    showToast('Signature downloaded as PNG!');
  };

  return (
    <div className="space-y-4 text-center">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold">Pen Color:</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer border" />
        </div>
        <button onClick={clearCanvas} className="px-3 py-1 bg-red-100 text-red-600 rounded text-xs font-semibold hover:bg-red-200">
          Clear Canvas
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={500}
        height={220}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        className="w-full max-w-lg h-52 mx-auto border-2 border-slate-300 dark:border-slate-700 bg-white rounded-2xl cursor-crosshair shadow-inner"
      />

      <button onClick={downloadSignature} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow">
        Download Transparent PNG Signature
      </button>
    </div>
  );
}

function PercentageCalculatorTool({ showToast }) {
  const [x1, setX1] = useState(15);
  const [y1, setY1] = useState(200);

  const [x2, setX2] = useState(25);
  const [y2, setY2] = useState(100);

  const res1 = useMemo(() => ((x1 / 100) * y1).toFixed(2), [x1, y1]);
  const res2 = useMemo(() => y2 !== 0 ? ((x2 / y2) * 100).toFixed(2) : 0, [x2, y2]);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Formula 1 */}
      <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase text-slate-500">What is X% of Y?</h4>
        <div className="flex items-center gap-2">
          <span className="text-sm">What is</span>
          <input type="number" value={x1} onChange={(e) => setX1(parseFloat(e.target.value) || 0)} className="w-20 p-2 text-sm rounded border dark:bg-slate-900" />
          <span className="text-sm">% of</span>
          <input type="number" value={y1} onChange={(e) => setY1(parseFloat(e.target.value) || 0)} className="w-24 p-2 text-sm rounded border dark:bg-slate-900" />
          <span className="text-sm">?</span>
        </div>
        <div className="text-sm font-bold text-blue-600 dark:text-blue-400">Result: {res1}</div>
      </div>

      {/* Formula 2 */}
      <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase text-slate-500">X is what % of Y?</h4>
        <div className="flex items-center gap-2">
          <input type="number" value={x2} onChange={(e) => setX2(parseFloat(e.target.value) || 0)} className="w-20 p-2 text-sm rounded border dark:bg-slate-900" />
          <span className="text-sm">is what % of</span>
          <input type="number" value={y2} onChange={(e) => setY2(parseFloat(e.target.value) || 0)} className="w-24 p-2 text-sm rounded border dark:bg-slate-900" />
          <span className="text-sm">?</span>
        </div>
        <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Result: {res2}%</div>
      </div>
    </div>
  );
}

function AgeCalculatorTool({ showToast }) {
  const [dob, setDob] = useState('2000-01-01');

  const ageData = useMemo(() => {
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = now - birth;
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;

    return { years, months, days, totalDays, totalHours };
  }, [dob]);

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Date of Birth:</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full mt-1 p-3 text-sm rounded-xl border dark:bg-slate-900 border-slate-300 dark:border-slate-700"
        />
      </div>

      {ageData && (
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-100 dark:border-blue-800">
            <span className="block text-2xl font-black text-blue-600">{ageData.years}</span>
            <span className="text-xs text-slate-500">Years</span>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <span className="block text-2xl font-black text-indigo-600">{ageData.months}</span>
            <span className="text-xs text-slate-500">Months</span>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-950/60 rounded-xl border border-purple-100 dark:border-purple-800">
            <span className="block text-2xl font-black text-purple-600">{ageData.days}</span>
            <span className="text-xs text-slate-500">Days</span>
          </div>
          <div className="col-span-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-300">
            Total Living Time: {ageData.totalDays.toLocaleString()} Days ({ageData.totalHours.toLocaleString()} Hours)
          </div>
        </div>
      )}
    </div>
  );
}

function QrCodeGeneratorTool({ showToast }) {
  const [text, setText] = useState('https://toolnova.pages.dev');
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js').then(() => {
      generateQr();
    });
  }, [text]);

  const generateQr = () => {
    if (!window.QRCode) return;
    const container = document.createElement('div');
    new window.QRCode(container, {
      text: text || 'https://toolnova.pages.dev',
      width: 200,
      height: 200,
      correctLevel: window.QRCode.CorrectLevel.H
    });
    setTimeout(() => {
      const img = container.querySelector('img');
      if (img) setQrUrl(img.src);
    }, 100);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto text-center">
      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block text-left mb-1">Text or URL for QR Code:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter website link or text..."
          className="w-full p-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      {qrUrl && (
        <div className="space-y-4">
          <img src={qrUrl} alt="QR Code" className="w-48 h-48 mx-auto p-3 bg-white rounded-2xl shadow border" />
          <a
            href={qrUrl}
            download="qrcode.png"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow"
          >
            <Download className="w-4 h-4" /> Download QR Code PNG
          </a>
        </div>
      )}
    </div>
  );
}

function PasswordGeneratorTool({ showToast }) {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const generate = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let res = '';
    for (let i = 0; i < length; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

  useEffect(() => {
    generate();
  }, [length, uppercase, numbers, symbols]);

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border">
        <span className="font-mono text-base font-bold text-blue-600 dark:text-blue-400 break-all">{password}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(password);
            showToast('Password copied to clipboard!');
          }}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-2 shrink-0"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
        <div>
          <label className="text-xs font-semibold flex justify-between">
            <span>Length: {length}</span>
          </label>
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} /> Include Uppercase
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} /> Include Numbers
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} /> Include Symbols
          </label>
        </div>

        <button onClick={generate} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow">
          Regenerate Password
        </button>
      </div>
    </div>
  );
}

function UnitConverterTool({ showToast }) {
  const [val, setVal] = useState(1);
  const [type, setType] = useState('length'); // length, weight
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('ft');

  const convert = useMemo(() => {
    const v = parseFloat(val) || 0;
    if (type === 'length') {
      // Meters base
      let meters = v;
      if (from === 'km') meters = v * 1000;
      if (from === 'ft') meters = v * 0.3048;
      if (from === 'in') meters = v * 0.0254;

      if (to === 'm') return meters;
      if (to === 'km') return meters / 1000;
      if (to === 'ft') return meters / 0.3048;
      if (to === 'in') return meters / 0.0254;
    }
    return v;
  }, [val, type, from, to]);

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold">Value</label>
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full mt-1 p-2 text-sm rounded border dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-semibold">From Unit</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full mt-1 p-2 text-sm rounded border dark:bg-slate-900">
            <option value="m">Meters (m)</option>
            <option value="km">Kilometers (km)</option>
            <option value="ft">Feet (ft)</option>
            <option value="in">Inches (in)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold">To Unit</label>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full mt-1 p-2 text-sm rounded border dark:bg-slate-900">
          <option value="m">Meters (m)</option>
          <option value="km">Kilometers (km)</option>
          <option value="ft">Feet (ft)</option>
          <option value="in">Inches (in)</option>
        </select>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-950/60 rounded-2xl text-center border border-blue-200 dark:border-blue-800">
        <span className="text-xs text-slate-500">Converted Value</span>
        <span className="block text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{convert.toFixed(4)}</span>
      </div>
    </div>
  );
}

function TextCaseConverterTool({ showToast }) {
  const [text, setText] = useState('');

  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());
  const toTitle = () => setText(text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
  const toSlug = () => setText(text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'));

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste text to convert formatting..."
        rows={6}
        className="w-full p-4 text-sm rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:outline-none"
      />

      <div className="flex flex-wrap gap-2">
        <button onClick={toUpper} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">UPPERCASE</button>
        <button onClick={toLower} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">lowercase</button>
        <button onClick={toTitle} className="px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold">Title Case</button>
        <button onClick={toSlug} className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold">URL Slug</button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(text);
            showToast('Text copied!');
          }}
          className="px-3 py-2 bg-slate-200 dark:bg-slate-800 text-xs font-semibold rounded"
        >
          Copy
        </button>
      </div>
    </div>
  );
}