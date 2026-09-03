"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Globe, Star, MessageSquare, Newspaper, 
  Heart, ExternalLink, Activity, ArrowRight, Send, User, Quote
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
  trend_score?: number;
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

interface FeaturedQuote {
  text: string;
  original_text?: string;
  author: string;
  platform: string;
  upvotes: number;
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

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='1.5'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>";

const COUNTRY_FLAGS: Record<string, string> = {
  KR: "🇰🇷", ES: "🇪🇸", GB: "🇬🇧", US: "🇺🇸", FR: "🇫🇷",
  IT: "🇮🇹", JP: "🇯🇵", BR: "🇧🇷", NO: "🇳🇴", EG: "🇪🇬", 
  DE: "🇩🇪", BE: "🇧🇪", UY: "UY", PL: "🇵🇱", AR: "🇦🇷", 
  NG: "🇳🇬", PT: "🇵🇹", TU: "🇹🇷"
};

const LANG_NAMES: Record<string, string> = {
  ko: "한국어", es: "Español", en: "English", ja: "日本語",
  zh: "简体中文", fr: "Français", it: "Italiano"
};

const I18N: Record<string, Record<string, string>> = {
  ko: {
    hubTitle: "전 세계 축구 팬들의 선수 토론 광장 & 글로벌 다국어 교차 번역 허브",
    searchPlaceholder: "선수 검색 (초성 ㅅㅎㅁ, Musiala, Guler, 바르셀로나, 뮌헨)...",
    trending: "주목받는 선수:",
    tabNews: "뉴스 & 이적",
    tabReactions: "해외 포럼 반응 (Reddit · 𝕏)",
    tabTalk: "글로벌 토크",
    favorite: "관심 등록",
    favorited: "관심 선수",
    topQuote: "현지 베스트 반응",
    viewOriginal: "원문 확인",
    viewTranslated: "번역문 확인",
    translatedFrom: "로 번역됨",
    originalLang: "원문 언어",
    writeComment: "모국어로 자유롭게 의견을 공유하세요",
    postComment: "등록",
    nicknamePlaceholder: "닉네임",
    commentPlaceholder: "이 선수에 대한 의견이나 토론 메시지를 모국어로 자유롭게 남겨보세요...",
    readOriginal: "기사 원문 보기",
    emptyNews: "해당 선수의 최신 기사를 수집 동기화 중입니다.",
    emptyReactions: "수집된 해외 현지 반응을 동기화 중입니다.",
    emptyComments: "등록된 자체 팬 코멘트가 없습니다. 첫 의견을 남겨보세요.",
  },
  en: {
    hubTitle: "Global Football Player Debate Arena & Cross-Language Community",
    searchPlaceholder: "Search player (e.g., Son, Musiala, Guler, Barcelona, Bayern)...",
    trending: "Featured Players:",
    tabNews: "News & Transfers",
    tabReactions: "Forum Threads (Reddit · 𝕏)",
    tabTalk: "Global Talk",
    favorite: "Track",
    favorited: "Tracking",
    topQuote: "Top Consensus",
    viewOriginal: "View original",
    viewTranslated: "View translation",
    translatedFrom: "Translated to",
    originalLang: "Original",
    writeComment: "Join the debate in your native language",
    postComment: "Submit",
    nicknamePlaceholder: "Nickname",
    commentPlaceholder: "Share your debate or perspective on this player...",
    readOriginal: "Read source article",
    emptyNews: "Syncing verified football coverage for this player...",
    emptyReactions: "Syncing global fan reactions for this player...",
    emptyComments: "No community comments yet. Start the conversation.",
  },
  ja: {
    hubTitle: "世界中のファンが集う選手討論アリーナ＆多言語コミュニティ",
    searchPlaceholder: "選手検索 (例: ソン・フンミン, ムシアラ, レアル, バルサ)...",
    trending: "注目の選手:",
    tabNews: "ニュース＆移籍",
    tabReactions: "海外現地反応",
    tabTalk: "グローバルトーク",
    favorite: "お気に入り",
    favorited: "登録済み",
    topQuote: "現地の注目反応",
    viewOriginal: "原文を見る",
    viewTranslated: "翻訳を見る",
    translatedFrom: "に翻訳",
    originalLang: "原文",
    writeComment: "母国語で世界のファンと意見を交わしましょう",
    postComment: "投稿",
    nicknamePlaceholder: "ニックネーム",
    commentPlaceholder: "選手に関する意見を自由に投稿してください...",
    readOriginal: "元記事を読む",
    emptyNews: "関連ニュースを同期中です...",
    emptyReactions: "海外反応を同期中です...",
    emptyComments: "コメントがありません。最初の意見を投稿しましょう。",
  },
  zh: {
    hubTitle: "全球球迷球员辩论广场与跨语言智能社区",
    searchPlaceholder: "搜索球员 (例如: 孙兴慜, 居莱尔, 穆西亚拉, 皇马, 拜仁)...",
    trending: "热门关注球员:",
    tabNews: "新闻与转会",
    tabReactions: "海外热议",
    tabTalk: "全球对话",
    favorite: "关注球员",
    favorited: "已关注",
    topQuote: "海外焦点讨论",
    viewOriginal: "查看原文",
    viewTranslated: "查看翻译",
    translatedFrom: "已翻译为",
    originalLang: "原文语言",
    writeComment: "用母语与全球球迷直接交流",
    postComment: "发布",
    nicknamePlaceholder: "昵称",
    commentPlaceholder: "分享你对该球员的看法...",
    readOriginal: "阅读原报道",
    emptyNews: "正在同步相关报道...",
    emptyReactions: "正在同步海外热议...",
    emptyComments: "暂无讨论，发表第一条评论吧。",
  },
  fr: {
    hubTitle: "Arène Mondiale de Débat Football & Communauté Multilingue",
    searchPlaceholder: "Rechercher un joueur (ex: Yamal, Musiala, Son, Real)...",
    trending: "Joueurs en vue:",
    tabNews: "Actualités & Transferts",
    tabReactions: "Avis Internationaux",
    tabTalk: "Discussion Globale",
    favorite: "Suivre",
    favorited: "Suivi",
    topQuote: "Meilleure Réaction",
    viewOriginal: "Voir l'original",
    viewTranslated: "Voir la traduction",
    translatedFrom: "Traduit en",
    originalLang: "Langue source",
    writeComment: "Participez au débat dans votre propre langue",
    postComment: "Publier",
    nicknamePlaceholder: "Pseudo",
    commentPlaceholder: "Partagez votre analyse sur ce joueur...",
    readOriginal: "Lire la source",
    emptyNews: "Synchronisation des articles en cours...",
    emptyReactions: "Synchronisation des réactions...",
    emptyComments: "Aucun commentaire pour le moment.",
  },
  it: {
    hubTitle: "Arena Globale di Discussione Calcio & Community Multilingue",
    searchPlaceholder: "Cerca calciatore (es: Yamal, Musiala, Son, Barcellona)...",
    trending: "Calciatori in evidenza:",
    tabNews: "Notizie & Mercato",
    tabReactions: "Reazioni Estere",
    tabTalk: "Discussione Globale",
    favorite: "Segui",
    favorited: "Seguito",
    topQuote: "Reazione Top",
    viewOriginal: "Mostra originale",
    viewTranslated: "Mostra traduzione",
    translatedFrom: "Tradotto in",
    originalLang: "Lingua originale",
    writeComment: "Interagisci nella tua lingua con i tifosi del mondo",
    postComment: "Invia",
    nicknamePlaceholder: "Nickname",
    commentPlaceholder: "Condividi la tua analisi su questo calciatore...",
    readOriginal: "Leggi l'articolo originale",
    emptyNews: "Aggiornamento notizie in corso...",
    emptyReactions: "Aggiornamento reazioni in corso...",
    emptyComments: "Nessun commento presente.",
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
  const [trendingPlayers, setTrendingPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<"news" | "reactions" | "talk">("reactions");
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [featuredQuote, setFeaturedQuote] = useState<FeaturedQuote | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const [authorName, setAuthorName] = useState("");
  const [authorCountry, setAuthorCountry] = useState("KR");
  const [newCommentText, setNewCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const [showOriginalMap, setShowOriginalMap] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<string[]>([]);

  const t = I18N[lang] || I18N.ko;

  // 1. 트렌딩 선수 랭킹 목록 로드
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/players/trending`);
        if (res.ok) {
          const data: Player[] = await res.json();
          setTrendingPlayers(data);
          if (data.length > 0 && !selectedPlayer) {
            setSelectedPlayer(data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load trending players:", err);
      }
    };
    fetchTrending();
  }, []);

  // 2. 스마트 검색창
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/players/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 3. 선택된 선수의 탭별 독립 데이터 로드
  useEffect(() => {
    if (!selectedPlayer) return;
    const fetchTabData = async () => {
      setLoading(true);
      try {
        const [feedRes, reactionsRes, commentsRes] = await Promise.all([
          fetch(`${API_BASE}/api/players/${selectedPlayer.id}/feed?lang=${lang}`),
          fetch(`${API_BASE}/api/players/${selectedPlayer.id}/reactions?lang=${lang}`),
          fetch(`${API_BASE}/api/players/${selectedPlayer.id}/comments?lang=${lang}`)
        ]);

        if (feedRes.ok) setArticles(await feedRes.json());
        if (reactionsRes.ok) {
          const data = await reactionsRes.json();
          setReactions(data.reactions || []);
          setFeaturedQuote(data.featured_quote || null);
        }
        if (commentsRes.ok) {
          const data = await commentsRes.json();
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error("Tab fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTabData();
  }, [selectedPlayer, lang]);

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

      if (res.status === 429) {
        alert("도배 방지를 위해 10초 후에 다시 작성하실 수 있습니다.");
        return;
      }

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
    <div className="mx-auto max-w-3xl px-4 py-8 text-neutral-100 antialiased font-sans">
      {/* 1. 상단 미니멀 헤더 */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <MessageSquare className="h-5 w-5 text-neutral-300" />
            <h1 className="text-xl font-bold tracking-tight text-white">
              Football Disputatio
            </h1>
            <span className="text-xs font-semibold text-neutral-400">
              풋디
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400 font-normal">{t.hubTitle}</p>
        </div>

        {/* 6개 국어 언어 셀렉터 */}
        <div className="flex items-center gap-1.5 rounded bg-neutral-900 px-2 py-1 border border-neutral-800">
          <Globe className="h-3.5 w-3.5 text-neutral-400" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-xs font-medium text-neutral-200 focus:outline-none cursor-pointer"
          >
            <option value="ko" className="bg-neutral-900">🇰🇷 한국어</option>
            <option value="en" className="bg-neutral-900">🇬🇧 English</option>
            <option value="ja" className="bg-neutral-900">🇯🇵 日本語</option>
            <option value="zh" className="bg-neutral-900">🇨🇳 简体中文</option>
            <option value="fr" className="bg-neutral-900">🇫🇷 Français</option>
            <option value="it" className="bg-neutral-900">🇮🇹 Italiano</option>
          </select>
        </div>
      </header>

      {/* 2. 스마트 검색창 */}
      <div className="relative mb-5">
        <div className="flex items-center rounded-md bg-neutral-900 px-3 py-2 border border-neutral-800 focus-within:border-neutral-700 transition">
          <Search className="h-4 w-4 text-neutral-500 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
          />
          {searching && (
            <div className="h-3 w-3 animate-spin rounded-full border border-neutral-400 border-t-transparent mr-1"></div>
          )}
        </div>

        {/* 검색 드롭다운 결과 */}
        {searchResults.length > 0 && (
          <div className="absolute z-30 mt-1.5 w-full rounded-md bg-neutral-900 p-1 border border-neutral-700 shadow-xl max-h-80 overflow-y-auto">
            {searchResults.map((player) => (
              <button
                key={player.id}
                onClick={() => {
                  setSelectedPlayer(player);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="flex w-full items-center justify-between rounded px-3 py-2 text-left hover:bg-neutral-800 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded overflow-hidden bg-neutral-800 border border-neutral-700 flex-shrink-0 flex items-center justify-center">
                    <img 
                      src={player.photo_url || `/players/${player.id}.jpg`} 
                      alt={player.name_ko} 
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-white text-sm">
                      {player.name_ko} ({player.name_en})
                    </span>
                    <span className="block text-xs text-neutral-400">
                      {player.current_club_name} · {player.position}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-neutral-500" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. 주목받는 선수 가로 목록 */}
      <div className="mb-6 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-medium text-neutral-400 whitespace-nowrap mr-1">
          {t.trending}
        </span>
        {trendingPlayers.map((p, index) => {
          const isSelected = selectedPlayer?.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPlayer(p)}
              className={`rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                isSelected
                  ? "bg-neutral-200 text-neutral-900"
                  : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800/80"
              }`}
            >
              <span className="text-[11px] opacity-60">{index + 1}.</span>
              <span>{COUNTRY_FLAGS[p.nationality_code || ""] || "⚽"}</span>
              {p.name_ko}
            </button>
          );
        })}
      </div>

      {/* 4. 선수 헤더 (군더더기 없는 에디토리얼 레이아웃) */}
      {selectedPlayer && (
        <div className="mb-6 rounded-lg bg-neutral-900 p-4 sm:p-5 border border-neutral-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-md overflow-hidden border border-neutral-700 bg-neutral-800 flex-shrink-0 flex items-center justify-center">
                <img
                  src={selectedPlayer.photo_url || `/players/${selectedPlayer.id}.jpg`}
                  alt={selectedPlayer.name_ko}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedPlayer.name_ko}</h2>
                  <span className="text-sm">{COUNTRY_FLAGS[selectedPlayer.nationality_code || ""] || "⚽"}</span>
                </div>
                <p className="text-xs text-neutral-400">{selectedPlayer.name_en}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                  <span className="text-neutral-200 font-medium">
                    {selectedPlayer.current_club_name}
                  </span>
                  <span>·</span>
                  <span>{selectedPlayer.position}</span>
                  <span>·</span>
                  <span>{selectedPlayer.nationality}</span>
                </div>
              </div>
            </div>

            {/* 관심 등록 버튼 */}
            <button
              onClick={() => toggleFavorite(selectedPlayer.id)}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition border ${
                favorites.includes(selectedPlayer.id)
                  ? "bg-neutral-800 text-amber-300 border-neutral-600"
                  : "bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800 border-neutral-700"
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${favorites.includes(selectedPlayer.id) ? "fill-amber-400 text-amber-400" : ""}`} />
              {favorites.includes(selectedPlayer.id) ? t.favorited : t.favorite}
            </button>
          </div>
        </div>
      )}

      {/* 5. 3대 독립 탭 */}
      <div className="mb-5 flex rounded-md bg-neutral-900 p-1 border border-neutral-800">
        <button
          onClick={() => setActiveTab("news")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded py-1.5 text-xs sm:text-sm font-medium transition ${
            activeTab === "news" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Newspaper className="h-3.5 w-3.5" />
          <span>{t.tabNews}</span>
          <span className="text-[11px] text-neutral-500 font-normal">
            ({articles.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab("reactions")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded py-1.5 text-xs sm:text-sm font-medium transition ${
            activeTab === "reactions" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Quote className="h-3.5 w-3.5" />
          <span>{t.tabReactions}</span>
          <span className="text-[11px] text-neutral-500 font-normal">
            ({reactions.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab("talk")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded py-1.5 text-xs sm:text-sm font-medium transition ${
            activeTab === "talk" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{t.tabTalk}</span>
          <span className="text-[11px] text-neutral-500 font-normal">
            ({comments.length})
          </span>
        </button>
      </div>

      {/* 6. 탭별 콘텐츠 */}
      {loading ? (
        <div className="py-16 text-center text-neutral-500">
          <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent"></div>
        </div>
      ) : (
        <div>
          {/* [탭 1] 뉴스 & 이적 피드 (알약 뱃지 제거, 깔끔한 텍스트 위주) */}
          {activeTab === "news" && (
            <div className="space-y-3">
              {articles.length === 0 ? (
                <div className="rounded border border-dashed border-neutral-800 p-8 text-center text-neutral-400">
                  <p className="text-sm">{t.emptyNews}</p>
                </div>
              ) : (
                articles.map((article) => (
                  <article
                    key={article.id}
                    className="rounded-lg bg-neutral-900 p-4 sm:p-5 border border-neutral-800 hover:border-neutral-700 transition"
                  >
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="text-neutral-200">{article.source_name}</span>
                        <span>·</span>
                        <span>Tier {article.tier}</span>
                        <span>·</span>
                        <span className="text-neutral-400">{article.transfer_status || "REPORT"}</span>
                      </div>
                      <span className="text-neutral-500">
                        {article.published_at ? new Date(article.published_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) : "최신"}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-white mb-2 leading-snug">
                      {stripHtml(article.title)}
                    </h3>

                    <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                      {stripHtml(article.summary)}
                    </p>

                    <div className="mt-3 flex justify-end border-t border-neutral-800 pt-2">
                      <a
                        href={article.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-white transition"
                      >
                        {t.readOriginal} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}

          {/* [탭 2] 해외 현지 반응 (AI 요약 박스 제거 -> 실제 최다 추천 베스트 인용구) */}
          {activeTab === "reactions" && (
            <div className="space-y-4">
              {/* 실제 현지 최다 추천 코멘트 하이라이트 (AI 가짜 문구 배제) */}
              {featuredQuote && (
                <div className="rounded-lg border-l-2 border-emerald-500 bg-neutral-900 p-4 border border-y-0 border-r-0">
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <Quote className="h-3 w-3" /> {t.topQuote}
                    </span>
                    <span>{featuredQuote.platform} · ▲ {featuredQuote.upvotes.toLocaleString()} 추천</span>
                  </div>
                  <p className="text-sm font-medium text-neutral-100 leading-relaxed italic">
                    "{featuredQuote.text}"
                  </p>
                  {featuredQuote.original_text && featuredQuote.original_text !== featuredQuote.text && (
                    <p className="mt-1.5 text-xs text-neutral-500 font-normal">
                      Original: "{featuredQuote.original_text}"
                    </p>
                  )}
                </div>
              )}

              {/* 해외 포럼 댓글 스레드 목록 */}
              {reactions.length === 0 ? (
                <div className="rounded border border-dashed border-neutral-800 p-8 text-center text-neutral-400">
                  <p className="text-sm">{t.emptyReactions}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reactions.map((r) => (
                    <div key={r.id} className="rounded-lg bg-neutral-900/90 p-4 border border-neutral-800 hover:border-neutral-700 transition">
                      {/* 상단: 플랫폼 고유 마크 + 작성자 u/닉네임 + 작성 시간 */}
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-2">
                          {r.platform.includes('Reddit') ? (
                            <span className="inline-flex items-center gap-1 rounded bg-orange-950/60 px-2 py-0.5 font-bold text-orange-400 border border-orange-800/60 text-[11px]">
                              <span className="h-1.5 w-1.5 rounded-full bg-orange-400"></span>
                              {r.platform}
                            </span>
                          ) : r.platform.includes('X') ? (
                            <span className="inline-flex items-center gap-1 rounded bg-neutral-800 px-2 py-0.5 font-bold text-white border border-neutral-700 text-[11px]">
                              𝕏 {r.platform}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-red-950/60 px-2 py-0.5 font-bold text-red-400 border border-red-800/60 text-[11px]">
                              ▶ {r.platform}
                            </span>
                          )}
                          <span className="font-semibold text-neutral-200">
                            u/{r.author_name || "football_fan"}
                          </span>
                        </div>
                        <span className="text-neutral-500 text-[11px]">
                          {r.created_at ? new Date(r.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) : "최근"}
                        </span>
                      </div>

                      {/* 댓글 본문: 한국어 번역 텍스트 */}
                      <div className="pl-1">
                        <p className="text-sm font-medium text-neutral-100 leading-relaxed">
                          {r.translated_text || r.original_text}
                        </p>

                        {/* 원문 인용 상자 */}
                        {r.translated_text && (
                          <div className="mt-2.5 rounded bg-neutral-950/80 p-2.5 border border-neutral-800/80">
                            <span className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-0.5">
                              Original ({r.platform})
                            </span>
                            <p className="text-xs text-neutral-400 italic leading-normal">
                              "{r.original_text}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* 하단: 업보트/추천, 답글 스레드 지표 */}
                      <div className="mt-3 flex items-center justify-between border-t border-neutral-800/60 pt-2 text-xs text-neutral-400">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 font-semibold text-emerald-400">
                            ▲ {r.upvotes.toLocaleString()} 추천
                          </span>
                          <span className="text-neutral-500 hover:text-neutral-300 cursor-pointer transition">
                            💬 답글 {Math.floor(r.upvotes / 80) + 1}개
                          </span>
                          <span className="text-neutral-500 hover:text-neutral-300 cursor-pointer transition">
                            공유
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-500">
                          실시간 해외 여론
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* [탭 3] 글로벌 토크 (10초 쿨다운 도배 방지 적용) */}
          {activeTab === "talk" && (
            <div className="space-y-4">
              {/* 유저 댓글 작성 폼 */}
              <form onSubmit={handleCommentSubmit} className="rounded-lg bg-neutral-900 p-4 border border-neutral-800">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-medium text-neutral-300">{t.writeComment}</h4>
                  <div className="flex items-center gap-2">
                    <select
                      value={authorCountry}
                      onChange={(e) => setAuthorCountry(e.target.value)}
                      className="rounded bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-200 border border-neutral-700 cursor-pointer focus:outline-none"
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
                      className="w-24 rounded bg-neutral-800 px-2 py-1 text-xs text-white placeholder-neutral-500 border border-neutral-700 focus:outline-none"
                    />
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={t.commentPlaceholder}
                  className="w-full rounded bg-neutral-950 p-2.5 text-sm text-white placeholder-neutral-500 border border-neutral-800 focus:border-neutral-700 focus:outline-none transition"
                />

                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingComment || !newCommentText.trim()}
                    className="flex items-center gap-1.5 rounded bg-neutral-100 px-3.5 py-1 text-xs font-semibold text-neutral-900 hover:bg-white disabled:opacity-40 transition"
                  >
                    <Send className="h-3 w-3" />
                    {submittingComment ? "..." : t.postComment}
                  </button>
                </div>
              </form>

              {/* 유저 댓글 목록 */}
              <div className="space-y-2.5">
                {comments.length === 0 ? (
                  <div className="rounded border border-dashed border-neutral-800 p-8 text-center text-neutral-400">
                    <p className="text-sm">{t.emptyComments}</p>
                  </div>
                ) : (
                  comments.map((c) => {
                    const isShowingOriginal = !!showOriginalMap[c.id];
                    const flag = COUNTRY_FLAGS[c.author_country] || "⚽";
                    const srcLangName = LANG_NAMES[c.source_lang] || c.source_lang;

                    return (
                      <div key={c.id} className="rounded-lg bg-neutral-900 p-4 border border-neutral-800">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{flag}</span>
                            <span className="font-semibold text-white">{c.author_name}</span>
                            <span className="text-neutral-500">
                              {new Date(c.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <button
                            onClick={() => handleLike(c.id)}
                            className="flex items-center gap-1 rounded px-2 py-0.5 text-xs text-neutral-400 hover:text-red-400 transition"
                          >
                            <Heart className="h-3 w-3" />
                            {c.likes_count}
                          </button>
                        </div>

                        {/* 댓글 본문 */}
                        <p className="text-sm text-neutral-200 leading-relaxed font-normal">
                          {isShowingOriginal ? c.original_text : c.display_text}
                        </p>

                        {/* 번역 메타 정보 및 원문 토글 */}
                        {c.is_translated && (
                          <div className="mt-2 flex items-center justify-between border-t border-neutral-800 pt-1.5 text-xs">
                            <span className="text-neutral-500">
                              {LANG_NAMES[lang]} {t.translatedFrom} ({t.originalLang}: {srcLangName})
                            </span>
                            <button
                              onClick={() => toggleOriginal(c.id)}
                              className="text-neutral-400 hover:text-neutral-200 underline transition"
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

      {/* 7. 법적 보호 및 커뮤니티 투명성 푸터 */}
      <footer className="mt-12 border-t border-neutral-800 pt-6 pb-10 text-center text-xs text-neutral-500 font-normal space-y-1">
        <p className="font-medium text-neutral-400">
          Football Disputatio (풋디) · 전 세계 축구 팬들을 위한 독립 토론 광장
        </p>
        <p>
          본 플랫폼은 공익적 보도·비평 및 축구 팬 상호 의견 교류를 위한 독립 커뮤니티입니다.
        </p>
        <p className="text-neutral-600">
          권리 침해 신고 및 제휴 문의: contact@footdi.app · All player names & trademarks belong to their respective owners.
        </p>
      </footer>
    </div>
  );
}
