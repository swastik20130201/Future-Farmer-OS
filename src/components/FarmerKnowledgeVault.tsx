import React, { useState } from 'react';
import {
  BookOpen,
  Mic,
  Video,
  FileText,
  Volume2,
  Play,
  Pause,
  Plus,
  Sparkles,
  UserCheck,
  Search,
  CheckCircle2,
  Cloud,
  ThumbsUp,
} from 'lucide-react';
import { VillageInfo, KnowledgeEntry } from '../types';
import { useCloudData } from '../context/CloudDataContext';
import { useAuth } from '../context/AuthContext';

interface FarmerKnowledgeVaultProps {
  village: VillageInfo;
  soundEnabled: boolean;
}

export const FarmerKnowledgeVault: React.FC<FarmerKnowledgeVaultProps> = ({
  village,
  soundEnabled,
}) => {
  const { knowledgeEntries, addKnowledgeEntry, likeKnowledgeEntry, isCloudConnected } = useCloudData();
  const { user } = useAuth();

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(user?.displayName || 'Elder Farmer ' + village.name);
  const [authorRole, setAuthorRole] = useState<'Experienced Farmer' | 'Agri Student' | 'Agronomist Specialist'>('Experienced Farmer');
  const [category, setCategory] = useState<KnowledgeEntry['category']>('Organic Farming');
  const [type, setType] = useState<KnowledgeEntry['type']>('Voice Note');
  const [content, setContent] = useState('');

  const handleTogglePlay = (item: KnowledgeEntry) => {
    if (playingId === item.id) {
      setPlayingId(null);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setPlayingId(item.id);
      if (soundEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`${item.title}. Audio experience shared by ${item.author}. ${item.content}`);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleAddContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !content) return;

    setIsSubmitting(true);
    try {
      await addKnowledgeEntry({
        title,
        author,
        authorRole,
        location: `${village.name}, ${village.district}`,
        category,
        type,
        duration: '2 min 30 sec',
        content,
      });

      setShowAddModal(false);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Failed to add knowledge post to cloud:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = knowledgeEntries.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 rounded-2xl border border-emerald-800/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <BookOpen className="w-3 h-3" /> Community Knowledge Vault
            </span>
            <span className="text-xs text-emerald-300 font-mono">
              Live Cloud Wisdom • Audio Voice Notes & Traditional Lore
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Farmer Knowledge Vault & Generational Wisdom
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Experienced farmers, agri students, and researchers share audio voice notes, biological pest solutions, and ancestral water harvesting lore saved across devices on Firestore.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Voice Note / Traditional Lore</span>
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {['All', 'Organic Farming', 'Pest Control', 'Traditional Irrigation', 'Soil Care'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search traditional wisdom, pest control..."
            className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 text-slate-100 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Knowledge Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase bg-slate-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {item.type === 'Voice Note' && <Mic className="w-3 h-3 text-emerald-400" />}
                  {item.type === 'Video Guide' && <Video className="w-3 h-3 text-cyan-400" />}
                  {item.type === 'Farming Story' && <FileText className="w-3 h-3 text-amber-400" />}
                  {item.type}
                </span>

                <span className="text-[10px] text-slate-400 font-mono">{item.duration || 'Article'}</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white leading-snug">{item.title}</h4>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    <strong>{item.author}</strong> ({item.authorRole}) • {item.location}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                "{item.content}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleTogglePlay(item)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  playingId === item.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950'
                    : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/40'
                }`}
              >
                {playingId === item.id ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Listen Voice Note</span>
                  </>
                )}
              </button>

              <button
                onClick={() => likeKnowledgeEntry(item.id)}
                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg"
              >
                <ThumbsUp className="w-3 h-3 text-emerald-400" />
                <span className="font-semibold">{item.likes} Helpful</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" /> Upload Voice Note / Traditional Lore
            </h3>

            <form onSubmit={handleAddContribution} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Knowledge Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Companion planting mustard with cabbage to deter pests"
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Author Name</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role / Profile</label>
                  <select
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
                  >
                    <option value="Experienced Farmer">Experienced Farmer</option>
                    <option value="Agri Student">Agri Student</option>
                    <option value="Agronomist Specialist">Agronomist Specialist</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
                  >
                    <option value="Organic Farming">Organic Farming</option>
                    <option value="Pest Control">Pest Control</option>
                    <option value="Traditional Irrigation">Traditional Irrigation</option>
                    <option value="Soil Care">Soil Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Format</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
                  >
                    <option value="Voice Note">Voice Note (TTS Playable)</option>
                    <option value="Video Guide">Video Guide</option>
                    <option value="Farming Story">Farming Story</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Practical Wisdom & Instructions</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe recipe ratios, application timing, traditional methods..."
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:border-emerald-500 h-24"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-950 cursor-pointer text-xs"
              >
                {isSubmitting ? 'Publishing to Cloud...' : 'Publish to Cloud Knowledge Vault'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
