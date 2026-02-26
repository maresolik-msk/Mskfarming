import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Leaf, Apple, Flower2, Carrot, TreePine, Search,
  ChevronRight, ChevronLeft, Sun, Droplets, Clock,
  Star, Bookmark, BookmarkCheck,
  Sprout, Shield, TrendingUp, ShoppingCart, Sparkles,
  Bug, Loader2, AlertCircle, ChevronDown, StickyNote,
  Send, Calendar, Zap, Info, CircleCheck, Wheat
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getHortCrops, getHortCategories, getHortCropDetail,
  getHortSeasonal, toggleHortBookmark, getHortBookmarks,
  saveHortNote, getHortNotes
} from '../../lib/api';
import { ImageWithFallback } from './figma/ImageWithFallback';

// ─── Types ───
interface CropListItem {
  id: string;
  name: string;
  name_te?: string;
  category: string;
  image_hint: string;
  season: string[];
  difficulty: string;
  duration_days: number;
  water_need: string;
  sunlight: string;
  fun_fact: string;
}

interface Category {
  id: string;
  name: string;
  name_te?: string;
  icon: string;
  color: string;
  count: number;
}

// ─── Image Map ───
const CROP_IMAGES: Record<string, string> = {
  tomato: 'https://images.unsplash.com/photo-1758552219061-5148ccb5bc5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  eggplant: 'https://images.unsplash.com/photo-1659261111792-66709e46d53d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  okra: 'https://images.unsplash.com/photo-1571455230472-034c3a71a699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  chilli: 'https://images.unsplash.com/photo-1562755293-c1432c329c8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  bitter_gourd: 'https://images.unsplash.com/photo-1766714534617-b3cffc7f9085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  mango: 'https://images.unsplash.com/photo-1734163075572-8948e799e42c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  banana: 'https://images.unsplash.com/photo-1760000622077-929c01d80975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  papaya: 'https://images.unsplash.com/photo-1664182810781-f92724fd4a80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  guava: 'https://images.unsplash.com/photo-1706734745541-f33f1207ee21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  spinach: 'https://images.unsplash.com/photo-1634731201932-9bd92839bea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  coriander: 'https://images.unsplash.com/photo-1767156969831-0beee76fa958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  curry_leaf: 'https://images.unsplash.com/photo-1692025463947-96689a2c8543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  turmeric: 'https://images.unsplash.com/photo-1768729341078-9da4e0ea959e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  moringa: 'https://images.unsplash.com/photo-1771643033515-0028fd03b708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  marigold: 'https://images.unsplash.com/photo-1685027006919-1079bf7f2d4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
};

const getCropImage = (hint: string) => CROP_IMAGES[hint] || CROP_IMAGES.tomato;

// ─── Category Icons ───
const catIcons: Record<string, typeof Leaf> = {
  grid: Sparkles,
  carrot: Carrot,
  apple: Apple,
  leaf: Leaf,
  flower: Sprout,
  root: TreePine,
  flower2: Flower2,
};

// ─── Difficulty Config ───
const diffConfig: Record<string, { color: string; bg: string; label: string }> = {
  easy: { color: 'text-green-600', bg: 'bg-green-50', label: 'Easy' },
  medium: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Medium' },
  hard: { color: 'text-red-600', bg: 'bg-red-50', label: 'Hard' },
};

// ─── Detail Tabs ───
const DETAIL_TABS = [
  { id: 'grow', label: 'Growing', icon: Sprout },
  { id: 'organic', label: 'Organic', icon: Leaf },
  { id: 'cycle', label: 'Cycle', icon: Calendar },
  { id: 'sell', label: 'Selling', icon: ShoppingCart },
];

interface HorticultureGuideProps {
  onClose: () => void;
}

export function HorticultureGuide({ onClose }: HorticultureGuideProps) {
  // ─── State ───
  const [view, setView] = useState<'browse' | 'detail'>('browse');
  const [crops, setCrops] = useState<CropListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [cropDetail, setCropDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('grow');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [userNote, setUserNote] = useState('');
  const [cropNotes, setCropNotes] = useState<any[]>([]);
  const [seasonalCrops, setSeasonalCrops] = useState<any[]>([]);
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  // Debounce ref for search
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery]);

  // ─── Load Data ───
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadCrops();
  }, [activeCategory, debouncedSearch]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [catRes, bookmarkRes, cropsRes] = await Promise.all([
        getHortCategories(),
        getHortBookmarks().catch(() => ({ bookmarks: [] })),
        getHortCrops(), // Load initial crops in parallel
      ]);
      if (catRes?.categories) setCategories(catRes.categories);
      if (bookmarkRes?.bookmarks) setBookmarks(bookmarkRes.bookmarks);
      if (cropsRes?.crops) setCrops(cropsRes.crops);

      // Load seasonal for current month
      const currentMonth = new Date().toLocaleString('en', { month: 'long' });
      const seasonRes = await getHortSeasonal(currentMonth).catch(() => null);
      if (seasonRes?.crops) setSeasonalCrops(seasonRes.crops);
    } catch (err) {
      console.error('Failed to load horticulture data:', err);
    }
    setLoading(false);
  };

  const loadCrops = async () => {
    try {
      const res = await getHortCrops(
        activeCategory !== 'all' ? activeCategory : undefined,
        debouncedSearch || undefined
      );
      if (res?.crops) setCrops(res.crops);
    } catch (err) {
      console.error('Failed to load crops:', err);
    }
  };

  const openDetail = async (cropId: string) => {
    setSelectedCropId(cropId);
    setDetailLoading(true);
    setView('detail');
    setActiveTab('grow');
    setExpandedStage(null);
    try {
      const [detailRes, notesRes] = await Promise.all([
        getHortCropDetail(cropId),
        getHortNotes(cropId).catch(() => ({ notes: [] })),
      ]);
      if (detailRes?.crop) setCropDetail(detailRes.crop);
      if (notesRes?.notes) setCropNotes(notesRes.notes);
    } catch (err) {
      console.error('Failed to load crop detail:', err);
      toast.error('Failed to load crop details');
    }
    setDetailLoading(false);
  };

  const handleBookmark = async (cropId: string) => {
    try {
      const res = await toggleHortBookmark(cropId);
      if (res) {
        setBookmarks(res.bookmarks || []);
        toast.success(res.bookmarked ? 'Bookmarked!' : 'Removed bookmark');
      }
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleSaveNote = async () => {
    if (!userNote.trim() || !selectedCropId) return;
    try {
      const res = await saveHortNote(selectedCropId, userNote.trim());
      if (res?.note) {
        setCropNotes(prev => [...prev, res.note]);
        setUserNote('');
        toast.success('Note saved!');
      }
    } catch (err) {
      toast.error('Failed to save note');
    }
  };

  const displayedCrops = showBookmarked
    ? crops.filter(c => bookmarks.includes(c.id))
    : crops;

  const currentMonth = new Date().toLocaleString('en', { month: 'long' });

  // ═══════════════════════════════════════════
  // BROWSE VIEW
  // ═══════════════════════════════════════════
  const renderBrowseView = () => (
    <div className="pb-28">
      {/* Header */}
      <div className="relative overflow-hidden rounded-b-3xl bg-gradient-to-br from-[#2d6a1e] via-[#3a8528] to-[#4F8F4A] p-5 pb-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNSIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <button onClick={onClose} className="p-2 -ml-2 rounded-xl bg-white/15 backdrop-blur-sm">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Horticulture Guide</h1>
            <button
              onClick={() => setShowBookmarked(!showBookmarked)}
              className={`p-2 rounded-xl backdrop-blur-sm transition-all ${showBookmarked ? 'bg-yellow-400/30' : 'bg-white/15'}`}
            >
              {showBookmarked ? <BookmarkCheck className="w-5 h-5 text-yellow-300" /> : <Bookmark className="w-5 h-5 text-white" />}
            </button>
          </div>
          <p className="text-white/80 text-sm mb-4">Fruits, vegetables, herbs & more - grow naturally, sell smartly</p>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search crops, herbs, fruits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-5">
        {/* Categories Scroll */}
        <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-2 pb-1">
            {categories.map(cat => {
              const Icon = catIcons[cat.icon] || Sparkles;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setShowBookmarked(false); }}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#4F8F4A] text-white shadow-lg shadow-[#4F8F4A]/20'
                      : 'bg-white border border-border/50 text-muted-foreground hover:bg-muted/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-muted/50'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Seasonal Spotlight */}
        {!showBookmarked && !searchQuery && activeCategory === 'all' && seasonalCrops.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-amber-100">
                <Calendar className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="font-bold text-sm text-amber-900">What to Plant in {currentMonth}</h3>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {seasonalCrops.map((sc: any) => (
                <button
                  key={sc.id}
                  onClick={() => openDetail(sc.id)}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-white/80 rounded-xl border border-amber-200/50 hover:bg-white transition-all"
                >
                  <ImageWithFallback
                    src={getCropImage(sc.image_hint)}
                    alt={sc.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span className="text-xs font-semibold text-foreground whitespace-nowrap">{sc.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Crops Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#4F8F4A]" />
          </div>
        ) : displayedCrops.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">
              {showBookmarked ? 'No bookmarked crops yet' : 'No crops found'}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {showBookmarked ? 'Bookmark crops to see them here' : 'Try a different search or category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {displayedCrops.map((crop, idx) => {
              const diff = diffConfig[crop.difficulty] || diffConfig.easy;
              const isBookmarked = bookmarks.includes(crop.id);
              return (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-white rounded-2xl border border-border/40 overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <button
                    onClick={() => openDetail(crop.id)}
                    className="w-full flex items-start gap-3 p-3 text-left"
                  >
                    <ImageWithFallback
                      src={getCropImage(crop.image_hint)}
                      alt={crop.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-sm text-foreground">{crop.name}</h3>
                          {crop.name_te && (
                            <p className="text-xs text-muted-foreground">{crop.name_te}</p>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBookmark(crop.id); }}
                          className="p-1.5 -mt-0.5 -mr-1 rounded-lg hover:bg-muted/50"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-[#4F8F4A]" />
                          ) : (
                            <Bookmark className="w-4 h-4 text-muted-foreground/40" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${diff.bg} ${diff.color}`}>
                          {diff.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />{crop.duration_days}d
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Droplets className="w-3 h-3" />{crop.water_need}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Sun className="w-3 h-3" />{crop.sunlight}
                        </span>
                      </div>

                      <p className="text-[10px] text-muted-foreground/70 mt-1.5 line-clamp-1">{crop.season.join(', ')}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30 mt-3 flex-shrink-0" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  // DETAIL VIEW
  // ═══════════════════════════════════════════
  const renderDetailView = () => {
    if (detailLoading || !cropDetail) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-[#4F8F4A]" />
        </div>
      );
    }

    const d = cropDetail;
    const diff = diffConfig[d.difficulty] || diffConfig.easy;
    const isBookmarked = bookmarks.includes(d.id);

    return (
      <div className="pb-28">
        {/* Hero */}
        <div className="relative h-52 overflow-hidden">
          <ImageWithFallback
            src={getCropImage(d.image_hint)}
            alt={d.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <button onClick={() => { setView('browse'); setCropDetail(null); }} className="p-2 rounded-xl bg-black/30 backdrop-blur-sm">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => handleBookmark(d.id)} className="p-2 rounded-xl bg-black/30 backdrop-blur-sm">
              {isBookmarked ? <BookmarkCheck className="w-5 h-5 text-yellow-400" /> : <Bookmark className="w-5 h-5 text-white" />}
            </button>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl font-bold text-white">{d.name}</h1>
            {d.name_te && <p className="text-white/70 text-sm">{d.name_te}</p>}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diff.bg} ${diff.color}`}>{diff.label}</span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />{d.duration_days} days
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm flex items-center gap-1">
                <Droplets className="w-3 h-3" />{d.water_need} water
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 -mt-1">
          <div className="bg-white rounded-2xl border border-border/40 p-3 grid grid-cols-3 gap-2 shadow-sm">
            <div className="text-center">
              <Sun className="w-5 h-5 mx-auto text-amber-500 mb-1" />
              <p className="text-xs font-bold text-foreground">{d.sunlight}</p>
              <p className="text-[10px] text-muted-foreground">Sunlight</p>
            </div>
            <div className="text-center">
              <Droplets className="w-5 h-5 mx-auto text-blue-500 mb-1" />
              <p className="text-xs font-bold text-foreground">{d.water_need}</p>
              <p className="text-[10px] text-muted-foreground">Water Need</p>
            </div>
            <div className="text-center">
              <Sprout className="w-5 h-5 mx-auto text-green-500 mb-1" />
              <p className="text-xs font-bold text-foreground">{d.spacing_cm}cm</p>
              <p className="text-[10px] text-muted-foreground">Spacing</p>
            </div>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="px-4 mt-3">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50 rounded-2xl p-3 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-purple-800 leading-relaxed">{d.fun_fact}</p>
          </div>
        </div>

        {/* Nutrition */}
        {d.nutrition && d.nutrition.length > 0 && (
          <div className="px-4 mt-3">
            <div className="flex gap-2 flex-wrap">
              {d.nutrition.map((n: string, i: number) => (
                <span key={i} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-4 mt-4 sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-2 -mx-0">
          <div className="flex gap-1.5 bg-muted/40 rounded-2xl p-1">
            {DETAIL_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-[#4F8F4A] shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 mt-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'grow' && renderGrowTab(d)}
              {activeTab === 'organic' && renderOrganicTab(d)}
              {activeTab === 'cycle' && renderCycleTab(d)}
              {activeTab === 'sell' && renderSellTab(d)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Notes Section */}
        <div className="px-4 mt-6">
          <div className="bg-white rounded-2xl border border-border/40 p-4">
            <div className="flex items-center gap-2 mb-3">
              <StickyNote className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm">My Notes</h3>
              <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{cropNotes.length}</span>
            </div>
            {cropNotes.map(note => (
              <div key={note.id} className="p-2.5 bg-amber-50/50 rounded-xl mb-2 border border-amber-100/50">
                <p className="text-xs text-foreground">{note.text}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{new Date(note.created_at).toLocaleDateString()}</p>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveNote()}
                placeholder="Add a note about this crop..."
                className="flex-1 px-3 py-2 bg-muted/30 rounded-xl text-xs border border-border/30 focus:outline-none focus:ring-2 focus:ring-[#4F8F4A]/30"
              />
              <button
                onClick={handleSaveNote}
                disabled={!userNote.trim()}
                className="p-2 rounded-xl bg-[#4F8F4A] text-white disabled:opacity-30 hover:bg-[#4F8F4A]/90 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Growing Tab ───
  const renderGrowTab = (d: any) => (
    <div className="space-y-4">
      {/* Soil Prep */}
      <DetailCard title="Soil Preparation" icon={<Sprout className="w-4 h-4 text-[#4F8F4A]" />}>
        {d.growing_guide.soil_preparation.map((tip: string, i: number) => (
          <div key={i} className="flex items-start gap-2 py-1.5">
            <CircleCheck className="w-3.5 h-3.5 text-[#4F8F4A] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground/80">{tip}</p>
          </div>
        ))}
      </DetailCard>

      {/* Sowing Info */}
      <DetailCard title="Sowing & Germination" icon={<Wheat className="w-4 h-4 text-amber-600" />}>
        <InfoRow label="Method" value={d.growing_guide.sowing_method} />
        {d.growing_guide.seed_treatment && <InfoRow label="Seed Treatment" value={d.growing_guide.seed_treatment} />}
        <InfoRow label="Germination" value={`${d.growing_guide.germination_days} days`} />
        {d.growing_guide.transplant_days && <InfoRow label="Transplant At" value={`${d.growing_guide.transplant_days} days`} />}
      </DetailCard>

      {/* Growth Stages */}
      <DetailCard title="Growth Stages" icon={<TrendingUp className="w-4 h-4 text-blue-500" />}>
        {d.growing_guide.key_stages.map((stage: any, i: number) => (
          <div key={i} className="border-l-2 border-[#4F8F4A]/20 pl-3 py-2 ml-1">
            <button
              onClick={() => setExpandedStage(expandedStage === i ? null : i)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#4F8F4A] -ml-[17px]" />
                <span className="text-xs font-bold text-foreground">{stage.name}</span>
                <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">Day {stage.day_range}</span>
              </div>
              <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${expandedStage === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedStage === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-1">
                    {stage.tips.map((tip: string, j: number) => (
                      <div key={j} className="flex items-start gap-1.5">
                        <Zap className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-foreground/70">{tip}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </DetailCard>

      {/* Companion Plants */}
      <DetailCard title="Companion Planting" icon={<Leaf className="w-4 h-4 text-green-500" />}>
        <div className="space-y-2">
          <div>
            <p className="text-[10px] font-semibold text-green-600 uppercase tracking-wider mb-1">Plant With</p>
            <div className="flex flex-wrap gap-1.5">
              {d.growing_guide.companion_plants.map((p: string, i: number) => (
                <span key={i} className="text-[10px] px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-200/50">{p}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider mb-1">Avoid Near</p>
            <div className="flex flex-wrap gap-1.5">
              {d.growing_guide.avoid_near.map((p: string, i: number) => (
                <span key={i} className="text-[10px] px-2 py-1 bg-red-50 text-red-600 rounded-full border border-red-200/50">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </DetailCard>

      {/* Soil & Climate */}
      <DetailCard title="Suitable Conditions" icon={<Info className="w-4 h-4 text-blue-400" />}>
        <InfoRow label="Soil Types" value={d.soil_types.join(', ')} />
        <InfoRow label="Climate Zones" value={d.climate_zones.join(', ')} />
        <InfoRow label="Season" value={d.season.join(', ')} />
      </DetailCard>
    </div>
  );

  // ─── Organic Tab ───
  const renderOrganicTab = (d: any) => (
    <div className="space-y-4">
      {/* Taste Enhancement */}
      <DetailCard title="Enhance Natural Taste" icon={<Sparkles className="w-4 h-4 text-amber-500" />} bgClass="bg-gradient-to-r from-amber-50/50 to-orange-50/50">
        {d.organic.taste_enhancement.map((tip: string, i: number) => (
          <div key={i} className="flex items-start gap-2 py-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground/80">{tip}</p>
          </div>
        ))}
      </DetailCard>

      {/* Natural Fertilizers */}
      <DetailCard title="Natural Fertilizers" icon={<Leaf className="w-4 h-4 text-green-600" />}>
        {d.organic.natural_fertilizers.map((fert: any, i: number) => (
          <div key={i} className="py-2 border-b border-border/20 last:border-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">{fert.name}</span>
              <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full">{fert.frequency}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{fert.how}</p>
          </div>
        ))}
      </DetailCard>

      {/* Pest Control */}
      <DetailCard title="Natural Pest Control" icon={<Bug className="w-4 h-4 text-red-500" />}>
        {d.organic.natural_pest_control.map((pc: any, i: number) => (
          <div key={i} className="py-2 border-b border-border/20 last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3 h-3 text-red-400" />
              <span className="text-xs font-bold text-red-600">{pc.pest}</span>
            </div>
            <p className="text-[11px] text-foreground/70 pl-5">{pc.remedy}</p>
          </div>
        ))}
      </DetailCard>

      {/* Mulching */}
      <DetailCard title="Mulching Tips" icon={<Sprout className="w-4 h-4 text-[#4F8F4A]" />}>
        {d.organic.mulching_tips.map((tip: string, i: number) => (
          <div key={i} className="flex items-start gap-2 py-1">
            <CircleCheck className="w-3.5 h-3.5 text-[#4F8F4A] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground/80">{tip}</p>
          </div>
        ))}
      </DetailCard>

      {/* Soil Health */}
      <DetailCard title="Soil Health Tips" icon={<TreePine className="w-4 h-4 text-emerald-600" />}>
        {d.organic.soil_health_tips.map((tip: string, i: number) => (
          <div key={i} className="flex items-start gap-2 py-1">
            <Zap className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground/80">{tip}</p>
          </div>
        ))}
      </DetailCard>
    </div>
  );

  // ─── Cycle Tab ───
  const renderCycleTab = (d: any) => (
    <div className="space-y-4">
      <DetailCard title="Crop Calendar" icon={<Calendar className="w-4 h-4 text-violet-500" />} bgClass="bg-gradient-to-r from-violet-50/50 to-purple-50/50">
        <InfoRow label="Sowing Window" value={d.crop_cycle.sowing_window} />
        <InfoRow label="Harvest Window" value={d.crop_cycle.harvest_window} />
        <InfoRow label="Total Duration" value={`${d.duration_days} days`} />
      </DetailCard>

      <DetailCard title="Yield & Production" icon={<TrendingUp className="w-4 h-4 text-green-600" />}>
        <InfoRow label="Expected Yield" value={d.crop_cycle.yield_per_plant} />
        <InfoRow label="Successive Sowing" value={d.crop_cycle.successive_sowing} />
      </DetailCard>

      <DetailCard title="Crop Rotation" icon={<Sprout className="w-4 h-4 text-blue-500" />}>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Best to rotate with:</p>
        <div className="flex flex-wrap gap-1.5">
          {d.crop_cycle.rotation_after.map((crop: string, i: number) => (
            <span key={i} className="text-[10px] px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200/50 font-medium">{crop}</span>
          ))}
        </div>
      </DetailCard>

      {/* Visual Timeline */}
      <DetailCard title="Growth Timeline" icon={<Clock className="w-4 h-4 text-amber-500" />}>
        <div className="relative">
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-green-300 via-yellow-300 to-red-300 rounded-full" />
          {d.growing_guide.key_stages.map((stage: any, i: number) => {
            const colors = ['bg-green-100 text-green-700', 'bg-blue-100 text-blue-700', 'bg-yellow-100 text-yellow-700', 'bg-orange-100 text-orange-700', 'bg-red-100 text-red-700'];
            return (
              <div key={i} className="flex items-center gap-3 py-2 ml-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${colors[i % colors.length]} z-10`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-foreground">{stage.name}</span>
                  <span className="text-[10px] text-muted-foreground ml-2">Day {stage.day_range}</span>
                </div>
              </div>
            );
          })}
        </div>
      </DetailCard>
    </div>
  );

  // ─── Selling Tab ───
  const renderSellTab = (d: any) => (
    <div className="space-y-4">
      {/* Price & Premium */}
      <DetailCard title="Price & Market" icon={<ShoppingCart className="w-4 h-4 text-[#812F0F]" />} bgClass="bg-gradient-to-r from-[#812F0F]/5 to-amber-50/50">
        <InfoRow label="Price Range" value={d.selling.avg_price_range} />
        <InfoRow label="Storage Life" value={`${d.selling.storage_days} days`} />
        <InfoRow label="Storage Method" value={d.selling.storage_method} />
        <div className="mt-2 p-2.5 bg-green-50 rounded-xl border border-green-200/50">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-green-600" />
            <span className="text-xs font-bold text-green-700">Organic Premium</span>
          </div>
          <p className="text-xs text-green-600 mt-1">{d.selling.organic_premium}</p>
        </div>
      </DetailCard>

      {/* Peak Months */}
      <DetailCard title="Best Selling Months" icon={<Calendar className="w-4 h-4 text-blue-500" />}>
        <div className="flex flex-wrap gap-1.5">
          {d.selling.peak_market_months.map((m: string, i: number) => (
            <span key={i} className="text-[10px] px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200/50 font-medium">{m}</span>
          ))}
        </div>
      </DetailCard>

      {/* Selling Tips */}
      <DetailCard title="Selling Strategies" icon={<TrendingUp className="w-4 h-4 text-green-600" />}>
        {d.selling.best_selling_tips.map((tip: string, i: number) => (
          <div key={i} className="flex items-start gap-2 py-1.5">
            <div className="w-5 h-5 rounded-full bg-[#812F0F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[9px] font-bold text-[#812F0F]">{i + 1}</span>
            </div>
            <p className="text-xs text-foreground/80">{tip}</p>
          </div>
        ))}
      </DetailCard>

      {/* Value Addition */}
      <DetailCard title="Value Addition Ideas" icon={<Zap className="w-4 h-4 text-amber-500" />} bgClass="bg-gradient-to-r from-amber-50/30 to-yellow-50/30">
        <div className="grid grid-cols-2 gap-2">
          {d.selling.value_addition.map((item: string, i: number) => (
            <div key={i} className="flex items-center gap-1.5 p-2 bg-white/80 rounded-xl border border-amber-200/30">
              <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span className="text-[10px] font-medium text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </DetailCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {view === 'browse' ? (
          <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
            {renderBrowseView()}
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            {renderDetailView()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Reusable Components ───

function DetailCard({ title, icon, children, bgClass }: { title: string; icon: React.ReactNode; children: React.ReactNode; bgClass?: string }) {
  return (
    <div className={`rounded-2xl border border-border/40 p-4 ${bgClass || 'bg-white'}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-bold text-sm text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 py-1.5 border-b border-border/10 last:border-0">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-24 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-xs text-foreground/80 flex-1">{value}</span>
    </div>
  );
}