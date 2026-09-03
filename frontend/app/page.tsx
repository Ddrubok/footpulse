"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Globe, Star, Flame, MessageSquare, Newspaper, 
  Share2, Heart, ExternalLink, Activity, ArrowRight, Check, Sparkles, RefreshCw, Send, ChevronDown
} from "lucide-react";

interface Player {
  id: string;
  name_ko: string;
  name_en: string;
  aliases?: string[];
  current_club_id?: string;
  current_club_name?: string;
  nationality?: string;
  nationality_code?: string;
  position?: string;
  photo_url?: string;
}

interface Article {
  id: string;
  source_name: string;
  source_url: string;
  tier: number;
  transfer_status: string;
  published_at: string;
  title: string;
  summary: string;
}

interface Reaction {
  id: string;
  platform: string;
  author_name?: string;
  original_text: string;
  translated_text?: string;
  upvotes: number;
  created_at: string;
}

interface Comment {
  id: string;
  player_id: string;
  author_name: string;
  author_country: string;
  source_lang: string;
  original_text: string;
  display_text: string;
  is_translated: boolean;
  likes_count: number;
  created_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://tired-east-small-years.trycloudflare.com";

const COUNTRY_FLAGS: Record<string, string> = {
  KR: "🇰🇷", ES: "🇪🇸", GB: "🇬🇧", US: "🇺🇸", FR: "🇫🇷",
  IT: "🇮🇹", JP: "🇯🇵", BR: "🇧🇷", NO: "🇳🇴", EG: "🇪🇬", DE: "🇩🇪"
};

const LANG_NAMES: Record<string, string> = {
  ko: "한국어", es: "Español", en: "English", ja: "日本語",
  zh: "简体中文", fr: "Français", it: "Italiano"
};

const I18N: Record<string, Record<string, string>> = {
  ko: {
    hubTitle: "선수 전용 허브 & 글로벌 크로스 번역 광장",
    searchPlaceholder: "선수 검색 (초성 ㅅㅎㅁ, Son, Yamal, 바르셀로나, LAFC)...",
    trending: "🔥 지금 핫한 스타:",
    tabNews: "뉴스 & 이적 피드",
    tabReactions: "해외 핫 반응",
    tabTalk: "글로벌 토크 💬",
    favorite: "즐겨찾기",
    favorited: "즐겨찾는 선수",
    aiBriefing: "AI 해외 여론 3줄 브리핑",
    viewOriginal: "원문 보기",
    viewTranslated: "번역문 보기",
    translatedFrom: "로 번역됨",
    originalLang: "원문",
    writeComment: "전 세계 팬들과 나만의 언어로 소통해보세요",
    postComment: "댓글 등록",
    nicknamePlaceholder: "닉네임",
    commentPlaceholder: "선수에 대한 생각이나 응원 메시지를 자유롭게 남겨보세요...",
    like: "좋아요",
    tier1: "🟢 Tier 1 오피셜/외신",
    tier2: "🟡 Tier 2 전담기자",
    tier3: "⚪ Tier 3 루머",
    readOriginal: "원문 읽기",
    emptyNews: "해당 선수의 최신 기사를 수집 동기화 중입니다.",
    emptyComments: "첫 번째 글로벌 팬 코멘트를 남겨보세요!",
  },
  en: {
    hubTitle: "Global Player Hub & Real-time Cross-Translation Community",
    searchPlaceholder: "Search player (e.g., Son, Yamal, Barcelona, LAFC)...",
    trending: "🔥 Trending Stars:",
    tabNews: "News & Transfers",
    tabReactions: "Global Reactions",
    tabTalk: "Global Talk 💬",
    favorite: "Favorite",
    favorited: "Favorited",
    aiBriefing: "AI Consensus 3-Line Briefing",
    viewOriginal: "View Original",
    viewTranslated: "View Translation",
    translatedFrom: "Translated to",
    originalLang: "Original",
    writeComment: "Talk with global fans in your own language",
    postComment: "Post Comment",
    nicknamePlaceholder: "Nickname",
    commentPlaceholder: "Share your thoughts or messages for this player...",
    like: "Like",
    tier1: "🟢 Tier 1 Official/Major",
    tier2: "🟡 Tier 2 Verified Source",
    tier3: "⚪ Tier 3 Rumor",
    readOriginal: "Read Original",
    emptyNews: "Syncing latest football articles for this player...",
    emptyComments: "Be the first to leave a comment!",
  },
  ja: {
    hubTitle: "選手専用ハブ＆リアルタイム交差翻訳コミュニティ",
    searchPlaceholder: "選手検索 (例: ソン・フンミン, ヤマル, バルセロナ)...",
    trending: "🔥 話題のスター選手:",
    tabNews: "ニュース＆移籍",
    tabReactions: "海外ホット反応",
    tabTalk: "グローバルトーク 💬",
    favorite: "お気に入り",
    favorited: "登録済み",
    aiBriefing: "AI海外世論3行要約",
    viewOriginal: "原文を表示",
    viewTranslated: "翻訳を表示",
    translatedFrom: "に翻訳されました",
    originalLang: "原文",
    writeComment: "世界中のファンと自分の言語で語り合いましょう",
    postComment: "コメント投稿",
    nicknamePlaceholder: "ニックネーム",
    commentPlaceholder: "選手への応援や感想を自由に投稿してください...",
    like: "いいね",
    tier1: "🟢 Tier 1 公式・有力外信",
    tier2: "🟡 Tier 2 有力筋",
    tier3: "⚪ Tier 3 噂・メディア",
    readOriginal: "原文を読む",
    emptyNews: "最新ニュースを同期中です...",
    emptyComments: "最初のコメントを投稿してみましょう！",
  },
  zh: {
    hubTitle: "球员专属中心与实时跨国交友广场",
    searchPlaceholder: "搜索球员 (例如: 孙兴慜, 亚马尔, 巴萨, 皇马)...",
    trending: "🔥 热门球星:",
    tabNews: "新闻与转会",
    tabReactions: "海外热议",
    tabTalk: "全球对话 💬",
    favorite: "关注",
    favorited: "已关注",
    aiBriefing: "AI海外舆情3行速递",
    viewOriginal: "查看原文",
    viewTranslated: "查看翻译",
    translatedFrom: "已翻译为",
    originalLang: "原文",
    writeComment: "用你自己的母语与全球球迷无障碍交流",
    postComment: "发表评论",
    nicknamePlaceholder: "昵称",
    commentPlaceholder: "自由分享你对这位球员的看法或支持...",
    like: "点赞",
    tier1: "🟢 Tier 1 官方/权威",
    tier2: "🟡 Tier 2 随队跟进",
    tier3: "⚪ Tier 3 转会传闻",
    readOriginal: "阅读原文",
    emptyNews: "正在同步最新相关资讯...",
    emptyComments: "留下第一条全球评论吧！",
  },
  fr: {
    hubTitle: "Hub Joueurs & Communauté de Traduction Croisée en Direct",
    searchPlaceholder: "Rechercher un joueur (ex: Yamal, Mbappé, Son, Real)...",
    trending: "🔥 Joueurs du moment:",
    tabNews: "Actus & Transferts",
    tabReactions: "Réactions Globales",
    tabTalk: "Global Talk 💬",
    favorite: "Favoris",
    favorited: "Favori ajouté",
    aiBriefing: "Synthèse IA des avis internationaux",
    viewOriginal: "Voir l'original",
    viewTranslated: "Voir la traduction",
    translatedFrom: "Traduit en",
    originalLang: "Original",
    writeComment: "Échangez avec les fans du monde entier dans votre langue",
    postComment: "Publier",
    nicknamePlaceholder: "Pseudo",
    commentPlaceholder: "Partagez votre avis sur ce joueur...",
    like: "J'aime",
    tier1: "🟢 Tier 1 Officiel / Fiable",
    tier2: "🟡 Tier 2 Journaliste dédié",
    tier3: "⚪ Tier 3 Rumeur",
    readOriginal: "Lire l'original",
    emptyNews: "Synchronisation des actualités en cours...",
    emptyComments: "Soyez le premier à commenter !",
  },
  it: {
    hubTitle: "Hub Calciatori & Community con Traduzione Incrociata in Tempo Reale",
    searchPlaceholder: "Cerca calciatore (es: Yamal, Son, Mbappé, Barcellona)...",
    trending: "🔥 Stelle del momento:",
    tabNews: "Notizie & Calciomercato",
    tabReactions: "Reazioni dall'Estero",
    tabTalk: "Global Talk 💬",
    favorite: "Preferito",
    favorited: "Aggiunto ai preferiti",
    aiBriefing: "Briefing IA sulle opinioni internazionali",
    viewOriginal: "Mostra originale",
    viewTranslated: "Mostra traduzione",
    translatedFrom: "Tradotto in",
    originalLang: "Originale",
    writeComment: "Comunica con tifosi di tutto il mondo nella tua lingua",
    postComment: "Invia commento",
    nicknamePlaceholder: "Nickname",
    commentPlaceholder: "Condividi un pensiero o un messaggio per questo giocatore...",
    like: "Mi piace",
    tier1: "🟢 Tier 1 Ufficiale",
    tier2: "🟡 Tier 2 Fonti attendibili",
    tier3: "⚪ Tier 3 Indiscrezione",
    readOriginal: "Leggi l'originale",
    emptyNews: "Sincronizzazione notizie in corso...",
    emptyComments: "Lascia il primo commento globale!",
  }
};

const stripHtml = (str?: string) => {
  if (!str) return "";
  return str
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
};

export default function Home() {
  const [lang, setLang] = useState("ko");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState<"news" | "reactions" | "talk">("news");
  
  // 탭별 데이터 상태
  const [articles, setArticles] = useState<Article[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [briefing, setBriefing] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  // 댓글 작성 폼 상태
  const [authorName, setAuthorName] = useState("");
  const [authorCountry, setAuthorCountry] = useState("KR");
  const [newCommentText, setNewCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // 원문 토글 상태 관리: commentId -> boolean
  const [showOriginalMap, setShowOriginalMap] = useState<Record<string, boolean>>({});

  // 즐겨찾기 상태
  const [favorites, setFavorites] = useState<string[]>([]);

  const t = I18N[lang] || I18N.ko;

  // 1. 초기 선수 목록 로드
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/players`);
        if (res.ok) {
          const data: Player[] = await res.json();
          setPlayers(data);
          if (data.length > 0 && !selectedPlayer) {
            setSelectedPlayer(data[0]); // 기본: 첫 번째 트렌딩 스타 (라민 야말)
          }
        }
      } catch (err) {
        console.error("Failed to load players:", err);
      }
    };
    fetchPlayers();
  }, []);

  // 2. 선수 검색 자동완성
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/players?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 3. 선택된 선수의 탭 데이터 로드
  useEffect(() => {
    if (!selectedPlayer) return;
    const fetchTabData = async () => {
      setLoading(true);
      try {
        if (activeTab === "news") {
          const res = await fetch(`${API_BASE}/api/players/${selectedPlayer.id}/feed?lang=${lang}`);
          if (res.ok) setArticles(await res.json());
        } else if (activeTab === "reactions") {
          const res = await fetch(`${API_BASE}/api/players/${selectedPlayer.id}/reactions?lang=${lang}`);
          if (res.ok) {
            const data = await res.json();
            setReactions(data.reactions || []);
            setBriefing(data.briefing || []);
          }
        } else if (activeTab === "talk") {
          const res = await fetch(`${API_BASE}/api/players/${selectedPlayer.id}/comments?lang=${lang}`);
          if (res.ok) setComments(await res.json());
        }
      } catch (err) {
        console.error("Tab fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTabData();
  }, [selectedPlayer, activeTab, lang]);

  // 댓글 등록 처리
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer || !newCommentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`${API_BASE}/api/players/${selectedPlayer.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: authorName.trim() || "축구팬",
          author_country: authorCountry,
          source_lang: lang,
          text: newCommentText.trim(),
        }),
      });
      if (res.ok) {
        const created: Comment = await res.json();
        setComments([created, ...comments]);
        setNewCommentText("");
      }
    } catch (err) {
      console.error("Comment submit error:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // 댓글 좋아요 처리
  const handleLike = async (commentId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/comments/${commentId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.map((c) => (c.id === commentId ? { ...c, likes_count: data.likes_count } : c)));
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const toggleFavorite = (playerId: string) => {
    if (favorites.includes(playerId)) {
      setFavorites(favorites.filter((id) => id !== playerId));
    } else {
      setFavorites([...favorites, playerId]);
    }
  };

  const toggleOriginal = (commentId: string) => {
    setShowOriginalMap((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 1. 메인 글로벌 헤더 */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-800/80 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Activity className="h-8 w-8 text-emerald-400" />
              Foot<span className="text-emerald-400">Pulse</span>
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              v3.0 Player Hub
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-400">{t.hubTitle}</p>
        </div>

        {/* 6개 국어 다국어 선택기 */}
        <div className="flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-1.5 border border-gray-800 shadow-sm">
          <Globe className="h-4 w-4 text-emerald-400" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-sm font-bold text-gray-200 focus:outline-none cursor-pointer"
          >
            <option value="ko" className="bg-gray-900">🇰🇷 한국어</option>
            <option value="en" className="bg-gray-900">🇬🇧 English</option>
            <option value="ja" className="bg-gray-900">🇯🇵 日本語</option>
            <option value="zh" className="bg-gray-900">🇨🇳 简体中文</option>
            <option value="fr" className="bg-gray-900">🇫🇷 Français</option>
            <option value="it" className="bg-gray-900">🇮🇹 Italiano</option>
          </select>
        </div>
      </header>

      {/* 2. 선수 통합 검색창 */}
      <div className="relative mb-6">
        <div className="flex items-center rounded-2xl bg-gray-900/90 px-4 py-3.5 border border-gray-800 shadow-lg focus-within:border-emerald-500/60 transition">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* 검색 드롭다운 */}
        {searchResults.length > 0 && (
          <div className="absolute z-30 mt-2 w-full rounded-2xl bg-gray-900/95 p-2 shadow-2xl border border-gray-700 backdrop-blur-md">
            {searchResults.map((player) => (
              <button
                key={player.id}
                onClick={() => {
                  setSelectedPlayer(player);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left hover:bg-gray-800 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{COUNTRY_FLAGS[player.nationality_code || ""] || "⚽"}</span>
                  <div>
                    <span className="font-bold text-white text-sm">{player.name_ko} ({player.name_en})</span>
                    <span className="block text-xs text-emerald-400">{player.current_club_name} · {player.position}</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-500" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. 트렌딩 선수 퀵 바 (가로 스크롤) */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-gray-400 whitespace-nowrap flex items-center gap-1">
          {t.trending}
        </span>
        {players.map((p) => {
          const isSelected = selectedPlayer?.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPlayer(p)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                isSelected
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 scale-105"
                  : "bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800"
              }`}
            >
              <span>{COUNTRY_FLAGS[p.nationality_code || ""] || "⚽"}</span>
              {p.name_ko}
            </button>
          );
        })}
      </div>

      {/* 4. 선수 전용 허브 (Player Hub) 히어로 카드 */}
      {selectedPlayer && (
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-[#121829] via-[#0f1422] to-[#090d16] p-6 border border-gray-800 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl bg-gray-800 flex-shrink-0">
                <img
                  src={selectedPlayer.photo_url || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400"}
                  alt={selectedPlayer.name_ko}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedPlayer.name_ko}</h2>
                  <span className="text-base">{COUNTRY_FLAGS[selectedPlayer.nationality_code || ""] || "⚽"}</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-400">{selectedPlayer.name_en}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 font-bold text-emerald-300 border border-emerald-500/30">
                    {selectedPlayer.current_club_name}
                  </span>
                  <span className="rounded-lg bg-gray-800 px-2.5 py-1 font-semibold text-gray-300">
                    {selectedPlayer.position}
                  </span>
                  <span className="rounded-lg bg-gray-800 px-2.5 py-1 font-semibold text-gray-400">
                    {selectedPlayer.nationality}
                  </span>
                </div>
              </div>
            </div>

            {/* 즐겨찾기 버튼 */}
            <button
              onClick={() => toggleFavorite(selectedPlayer.id)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition border ${
                favorites.includes(selectedPlayer.id)
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-gray-800/80 text-gray-300 hover:bg-gray-700 border-gray-700"
              }`}
            >
              <Star className={`h-4 w-4 ${favorites.includes(selectedPlayer.id) ? "fill-amber-400 text-amber-400" : ""}`} />
              {favorites.includes(selectedPlayer.id) ? t.favorited : t.favorite}
            </button>
          </div>
        </div>
      )}

      {/* 5. 선수 허브 3대 탭 네비게이션 */}
      <div className="mb-6 flex rounded-2xl bg-gray-900/90 p-1.5 border border-gray-800">
        <button
          onClick={() => setActiveTab("news")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition ${
            activeTab === "news" ? "bg-emerald-500 text-black shadow-md" : "text-gray-400 hover:text-white"
          }`}
        >
          <Newspaper className="h-4 w-4" />
          {t.tabNews}
        </button>
        <button
          onClick={() => setActiveTab("reactions")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition ${
            activeTab === "reactions" ? "bg-emerald-500 text-black shadow-md" : "text-gray-400 hover:text-white"
          }`}
        >
          <Flame className="h-4 w-4" />
          {t.tabReactions}
        </button>
        <button
          onClick={() => setActiveTab("talk")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition ${
            activeTab === "talk" ? "bg-emerald-500 text-black shadow-md" : "text-gray-400 hover:text-white"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          {t.tabTalk}
        </button>
      </div>

      {/* 6. 탭별 컨텐츠 렌더링 */}
      {loading ? (
        <div className="py-20 text-center text-gray-500">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : (
        <div>
          {/* [탭 1] 실시간 뉴스 & 이적 피드 */}
          {activeTab === "news" && (
            <div className="space-y-4">
              {articles.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-800 p-12 text-center text-gray-400">
                  <Sparkles className="mx-auto h-8 w-8 text-gray-600 mb-2" />
                  <p className="text-sm font-medium">{t.emptyNews}</p>
                </div>
              ) : (
                articles.map((article) => (
                  <article
                    key={article.id}
                    className="rounded-2xl bg-[#111624] p-5 border border-gray-800 shadow-md hover:border-gray-700 transition"
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-900/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-700/50">
                          {article.tier === 1 ? t.tier1 : article.tier === 2 ? t.tier2 : t.tier3}
                        </span>
                        <span className="rounded bg-indigo-600/30 px-2 py-0.5 text-xs font-bold text-indigo-400 border border-indigo-500/40">
                          {article.transfer_status || "REPORT"}
                        </span>
                        <span className="text-xs font-medium text-gray-400">{article.source_name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {article.published_at ? new Date(article.published_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) : "방금 전"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                      {stripHtml(article.title)}
                    </h3>

                    <p className="text-sm text-gray-300 leading-relaxed bg-gray-900/40 p-3.5 rounded-xl border border-gray-800/40">
                      {stripHtml(article.summary)}
                    </p>

                    <div className="mt-4 flex justify-end border-t border-gray-800/60 pt-3">
                      <a
                        href={article.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
                      >
                        {t.readOriginal} <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}

          {/* [탭 2] 해외 핫 반응 (Reddit, X) + AI 여론 브리핑 */}
          {activeTab === "reactions" && (
            <div className="space-y-5">
              {/* 상단 AI 3줄 브리핑 카드 */}
              {briefing.length > 0 && (
                <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-gray-900 to-indigo-950/40 p-5 border border-emerald-500/30 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-emerald-400" />
                    <h4 className="text-sm font-black text-emerald-300">{t.aiBriefing}</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-gray-300 list-disc list-inside">
                    {briefing.map((line, idx) => (
                      <li key={idx} className="leading-relaxed">{line}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 해외 베스트 댓글 목록 */}
              <div className="space-y-3">
                {reactions.map((r) => (
                  <div key={r.id} className="rounded-2xl bg-[#111624] p-5 border border-gray-800 shadow-md">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-orange-600/20 px-2 py-0.5 text-xs font-bold text-orange-400 border border-orange-500/30">
                          {r.platform}
                        </span>
                        <span className="text-xs font-semibold text-gray-400">{r.author_name || "현지팬"}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                        ▲ {r.upvotes.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-white mt-1 leading-relaxed">
                      "{r.translated_text || r.original_text}"
                    </p>

                    {r.translated_text && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        Original: "{r.original_text}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* [탭 3] 글로벌 토크 💬 (다국적 교차 번역 커뮤니티) */}
          {activeTab === "talk" && (
            <div className="space-y-6">
              {/* 댓글 작성 폼 */}
              <form onSubmit={handleCommentSubmit} className="rounded-2xl bg-gray-900/90 p-4 sm:p-5 border border-gray-800 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-200">{t.writeComment}</h4>
                  <div className="flex items-center gap-2">
                    <select
                      value={authorCountry}
                      onChange={(e) => setAuthorCountry(e.target.value)}
                      className="rounded-lg bg-gray-800 px-2.5 py-1 text-xs font-bold text-gray-200 border border-gray-700 cursor-pointer"
                    >
                      <option value="KR">🇰🇷 한국</option>
                      <option value="ES">🇪🇸 España</option>
                      <option value="GB">🇬🇧 UK</option>
                      <option value="US">🇺🇸 USA</option>
                      <option value="FR">🇫🇷 France</option>
                      <option value="IT">🇮🇹 Italia</option>
                      <option value="JP">🇯🇵 日本</option>
                    </select>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder={t.nicknamePlaceholder}
                      className="w-28 rounded-lg bg-gray-800 px-2.5 py-1 text-xs text-white placeholder-gray-500 border border-gray-700 focus:outline-none"
                    />
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={t.commentPlaceholder}
                  className="w-full rounded-xl bg-gray-950/80 p-3 text-sm text-white placeholder-gray-500 border border-gray-800 focus:border-emerald-500/60 focus:outline-none transition"
                />

                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingComment || !newCommentText.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-black hover:bg-emerald-400 disabled:opacity-50 transition shadow-lg shadow-emerald-500/20"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {submittingComment ? "..." : t.postComment}
                  </button>
                </div>
              </form>

              {/* 글로벌 댓글 목록 */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-800 p-12 text-center text-gray-400">
                    <MessageSquare className="mx-auto h-8 w-8 text-gray-600 mb-2" />
                    <p className="text-sm font-medium">{t.emptyComments}</p>
                  </div>
                ) : (
                  comments.map((c) => {
                    const isShowingOriginal = !!showOriginalMap[c.id];
                    const flag = COUNTRY_FLAGS[c.author_country] || "⚽";
                    const srcLangName = LANG_NAMES[c.source_lang] || c.source_lang;

                    return (
                      <div key={c.id} className="rounded-2xl bg-[#111624] p-5 border border-gray-800 shadow-md">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{flag}</span>
                            <span className="text-sm font-bold text-white">{c.author_name}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(c.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <button
                            onClick={() => handleLike(c.id)}
                            className="flex items-center gap-1.5 rounded-lg bg-gray-800/80 px-2.5 py-1 text-xs font-bold text-gray-300 hover:text-red-400 transition"
                          >
                            <Heart className="h-3.5 w-3.5 fill-red-500/20 text-red-400" />
                            {c.likes_count}
                          </button>
                        </div>

                        {/* 댓글 본문 (번역문 또는 원문) */}
                        <p className="text-sm text-gray-200 leading-relaxed font-medium">
                          {isShowingOriginal ? c.original_text : c.display_text}
                        </p>

                        {/* 번역 상태 표시 및 원문 보기 토글 */}
                        {c.is_translated && (
                          <div className="mt-3 flex items-center justify-between border-t border-gray-800/60 pt-2.5">
                            <span className="text-xs font-medium text-emerald-400/80 flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {LANG_NAMES[lang]} {t.translatedFrom} ({t.originalLang}: {srcLangName})
                            </span>
                            <button
                              onClick={() => toggleOriginal(c.id)}
                              className="text-xs font-bold text-gray-400 hover:text-white underline transition"
                            >
                              {isShowingOriginal ? t.viewTranslated : t.viewOriginal}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
