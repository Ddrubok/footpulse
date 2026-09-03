"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Globe, Star, MessageSquare, Newspaper, 
  Heart, ExternalLink, Activity, ArrowRight, Sparkles, Send, User
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
    hubTitle: "구글 트렌드 기반 선수 허브 & 글로벌 다국어 교차 번역 커뮤니티",
    searchPlaceholder: "선수 검색 (초성 ㅅㅎㅁ, Musiala, Guler, 바르셀로나, 뮌헨)...",
    trending: "오늘의 트렌딩 스타:",
    tabNews: "뉴스 & 이적",
    tabReactions: "해외 현지 반응",
    tabTalk: "글로벌 토크",
    favorite: "관심 선수 등록",
    favorited: "관심 선수",
    aiBriefing: "해외 현지 여론 핵심 요약",
    viewOriginal: "원문 확인",
    viewTranslated: "번역문 확인",
    translatedFrom: "로 번역됨",
    originalLang: "원문 언어",
    writeComment: "모국어로 자유롭게 의견을 공유하세요",
    postComment: "등록",
    nicknamePlaceholder: "닉네임",
    commentPlaceholder: "이 선수에 대한 의견이나 응원 메시지를 모국어로 자유롭게 남겨보세요...",
    tier1: "Tier 1 공식 외신",
    tier2: "Tier 2 전담 기자",
    tier3: "Tier 3 이적 보도",
    readOriginal: "기사 원문 보기",
    emptyNews: "해당 선수의 최신 기사를 수집 동기화 중입니다.",
    emptyReactions: "수집된 해외 현지 반응을 동기화 중입니다.",
    emptyComments: "등록된 자체 팬 코멘트가 없습니다. 첫 의견을 남겨보세요.",
  },
  en: {
    hubTitle: "Trend-Driven Football Player Hub & Cross-Language Community",
    searchPlaceholder: "Search player (e.g., Son, Musiala, Guler, Barcelona, Bayern)...",
    trending: "Trending Stars Today:",
    tabNews: "News & Transfers",
    tabReactions: "Global Reactions",
    tabTalk: "Global Talk",
    favorite: "Track Player",
    favorited: "Tracking",
    aiBriefing: "Overseas Consensus Summary",
    viewOriginal: "View original",
    viewTranslated: "View translation",
    translatedFrom: "Translated to",
    originalLang: "Original",
    writeComment: "Join the discussion in your native language",
    postComment: "Submit",
    nicknamePlaceholder: "Nickname",
    commentPlaceholder: "Share your perspective on this player...",
    tier1: "Tier 1 Official",
    tier2: "Tier 2 Beat Reporter",
    tier3: "Tier 3 Report",
    readOriginal: "Read source article",
    emptyNews: "Syncing verified football coverage for this player...",
    emptyReactions: "Syncing global fan reactions for this player...",
    emptyComments: "No community comments yet. Start the conversation.",
  },
  ja: {
    hubTitle: "Googleトレンド連動 選手専用ハブ＆多言語コミュニティ",
    searchPlaceholder: "選手検索 (例: ソン・フンミン, ムシアラ, レアル, バルサ)...",
    trending: "本日の急上昇選手:",
    tabNews: "ニュース＆移籍",
    tabReactions: "海外現地反応",
    tabTalk: "グローバルトーク",
    favorite: "お気に入り",
    favorited: "登録済み",
    aiBriefing: "海外世論の核心要約",
    viewOriginal: "原文を見る",
    viewTranslated: "翻訳を見る",
    translatedFrom: "に翻訳",
    originalLang: "原文",
    writeComment: "母国語で世界のファンと意見を交わしましょう",
    postComment: "投稿",
    nicknamePlaceholder: "ニックネーム",
    commentPlaceholder: "選手に関する意見を自由に投稿してください...",
    tier1: "Tier 1 公式外信",
    tier2: "Tier 2 担当記者",
    tier3: "Tier 3 報道",
    readOriginal: "元記事を読む",
    emptyNews: "関連ニュースを同期中です...",
    emptyReactions: "海外反応を同期中です...",
    emptyComments: "コメントがありません。最初の意見を投稿しましょう。",
  },
  zh: {
    hubTitle: "热搜驱动球员专属资讯中心与跨国球迷广场",
    searchPlaceholder: "搜索球员 (例如: 孙兴慜, 居莱尔, 穆西亚拉, 皇马, 拜仁)...",
    trending: "今日热搜榜:",
    tabNews: "新闻与转会",
    tabReactions: "海外热议",
    tabTalk: "全球对话",
    favorite: "关注球员",
    favorited: "已关注",
    aiBriefing: "海外舆论核心速递",
    viewOriginal: "查看原文",
    viewTranslated: "查看翻译",
    translatedFrom: "已翻译为",
    originalLang: "原文语言",
    writeComment: "用母语与全球球迷直接交流",
    postComment: "发布",
    nicknamePlaceholder: "昵称",
    commentPlaceholder: "分享你对该球员的看法...",
    tier1: "Tier 1 官方信源",
    tier2: "Tier 2 跟队记者",
    tier3: "Tier 3 媒体报道",
    readOriginal: "阅读原报道",
    emptyNews: "正在同步相关报道...",
    emptyReactions: "正在同步海外热议...",
    emptyComments: "暂无讨论，发表第一条评论吧。",
  },
  fr: {
    hubTitle: "Hub Joueurs Football Tendance & Espace International",
    searchPlaceholder: "Rechercher un joueur (ex: Yamal, Musiala, Son, Real)...",
    trending: "Joueurs en tendance:",
    tabNews: "Actualités & Transferts",
    tabReactions: "Avis Internationaux",
    tabTalk: "Discussion Globale",
    favorite: "Suivre",
    favorited: "Suivi",
    aiBriefing: "Synthèse des avis internationaux",
    viewOriginal: "Voir l'original",
    viewTranslated: "Voir la traduction",
    translatedFrom: "Traduit en",
    originalLang: "Langue source",
    writeComment: "Participez au débat dans votre propre langue",
    postComment: "Publier",
    nicknamePlaceholder: "Pseudo",
    commentPlaceholder: "Partagez votre analyse sur ce joueur...",
    tier1: "Tier 1 Source Officielle",
    tier2: "Tier 2 Journaliste Spécialisé",
    tier3: "Tier 3 Rumeur",
    readOriginal: "Lire la source",
    emptyNews: "Synchronisation des articles en cours...",
    emptyReactions: "Synchronisation des réactions...",
    emptyComments: "Aucun commentaire pour le moment.",
  },
  it: {
    hubTitle: "Hub Calciatori Top Trend & Community Multilingue",
    searchPlaceholder: "Cerca calciatore (es: Yamal, Musiala, Son, Barcellona)...",
    trending: "Top Calciatori del giorno:",
    tabNews: "Notizie & Mercato",
    tabReactions: "Reazioni Estere",
    tabTalk: "Discussione Globale",
    favorite: "Segui",
    favorited: "Seguito",
    aiBriefing: "Sintesi opinioni internazionali",
    viewOriginal: "Mostra originale",
    viewTranslated: "Mostra traduzione",
    translatedFrom: "Tradotto in",
    originalLang: "Lingua originale",
    writeComment: "Interagisci nella tua lingua con i tifosi del mondo",
    postComment: "Invia",
    nicknamePlaceholder: "Nickname",
    commentPlaceholder: "Condividi la tua analisi su questo calciatore...",
    tier1: "Tier 1 Fonte Ufficiale",
    tier2: "Tier 2 Inviato Accreditato",
    tier3: "Tier 3 Indiscrezione",
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
  const [aiSummary, setAiSummary] = useState<string>("");
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
          setAiSummary(data.ai_summary || "");
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
    <div className="mx-auto max-w-4xl px-4 py-8 text-neutral-100 antialiased font-sans">
      {/* 1. 상단 글로벌 헤더 */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Activity className="h-6 w-6 text-emerald-500" />
              <span>FootPulse</span>
            </h1>
            <span className="rounded bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-300 border border-neutral-700">
              v3.2 Hub
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400 font-normal">{t.hubTitle}</p>
        </div>

        {/* 6개 국어 언어 셀렉터 */}
        <div className="flex items-center gap-2 rounded-md bg-neutral-900 px-2.5 py-1.5 border border-neutral-800">
          <Globe className="h-4 w-4 text-neutral-400" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-xs font-semibold text-neutral-200 focus:outline-none cursor-pointer"
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

      {/* 2. 스마트 검색창 (온디맨드 자동 등록 지원) */}
      <div className="relative mb-5">
        <div className="flex items-center rounded-lg bg-neutral-900 px-3.5 py-2.5 border border-neutral-800 focus-within:border-neutral-600 transition">
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
          <div className="absolute z-30 mt-1.5 w-full rounded-lg bg-neutral-900 p-1.5 border border-neutral-700 shadow-lg max-h-80 overflow-y-auto">
            {searchResults.map((player) => (
              <button
                key={player.id}
                onClick={() => {
                  setSelectedPlayer(player);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-neutral-800 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md overflow-hidden bg-neutral-800 border border-neutral-700 flex-shrink-0 flex items-center justify-center">
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
                <div className="flex items-center gap-2">
                  {player.trend_score ? (
                    <span className="text-[11px] font-semibold text-neutral-400">
                      Score {player.trend_score}
                    </span>
                  ) : null}
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-500" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. 오늘 트렌딩 스타 랭킹 바 (Top 15) */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-neutral-400 whitespace-nowrap mr-1 flex items-center gap-1">
          {t.trending}
        </span>
        {trendingPlayers.map((p, index) => {
          const isSelected = selectedPlayer?.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPlayer(p)}
              className={`rounded-md px-3 py-1 text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                isSelected
                  ? "bg-neutral-100 text-neutral-900 border border-neutral-100"
                  : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
              }`}
            >
              <span className="text-[11px] font-bold text-neutral-400">{index + 1}.</span>
              <span>{COUNTRY_FLAGS[p.nationality_code || ""] || "⚽"}</span>
              {p.name_ko}
            </button>
          );
        })}
      </div>

      {/* 4. 선수 전용 허브 히어로 카드 (자체 에지 CDN 사진 100% 로딩) */}
      {selectedPlayer && (
        <div className="mb-6 rounded-lg bg-neutral-900 p-5 border border-neutral-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-md overflow-hidden border border-neutral-700 bg-neutral-800 flex-shrink-0 flex items-center justify-center">
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
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">{selectedPlayer.name_ko}</h2>
                  <span className="text-sm">{COUNTRY_FLAGS[selectedPlayer.nationality_code || ""] || "⚽"}</span>
                </div>
                <p className="text-xs font-normal text-neutral-400">{selectedPlayer.name_en}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded bg-neutral-800 px-2 py-0.5 font-semibold text-neutral-200 border border-neutral-700">
                    {selectedPlayer.current_club_name}
                  </span>
                  <span className="rounded bg-neutral-800 px-2 py-0.5 font-normal text-neutral-300 border border-neutral-700">
                    {selectedPlayer.position}
                  </span>
                  <span className="text-neutral-400 font-normal">
                    {selectedPlayer.nationality}
                  </span>
                  {selectedPlayer.trend_score ? (
                    <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[11px] font-semibold text-neutral-300 border border-neutral-700">
                      Trend {selectedPlayer.trend_score}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* 관심 선수 등록 버튼 */}
            <button
              onClick={() => toggleFavorite(selectedPlayer.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition border ${
                favorites.includes(selectedPlayer.id)
                  ? "bg-neutral-800 text-amber-300 border-neutral-600"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border-neutral-700"
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${favorites.includes(selectedPlayer.id) ? "fill-amber-400 text-amber-400" : ""}`} />
              {favorites.includes(selectedPlayer.id) ? t.favorited : t.favorite}
            </button>
          </div>
        </div>
      )}

      {/* 5. 선수 허브 3대 독립 탭 (카운트 뱃지 포함) */}
      <div className="mb-6 flex rounded-lg bg-neutral-900 p-1 border border-neutral-800">
        <button
          onClick={() => setActiveTab("news")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-xs sm:text-sm font-semibold transition ${
            activeTab === "news" ? "bg-neutral-800 text-white border border-neutral-700" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Newspaper className="h-3.5 w-3.5" />
          <span>{t.tabNews}</span>
          <span className="rounded-full bg-neutral-950 px-1.5 py-0.2 text-[10px] text-neutral-400 border border-neutral-800">
            {articles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("reactions")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-xs sm:text-sm font-semibold transition ${
            activeTab === "reactions" ? "bg-neutral-800 text-white border border-neutral-700" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{t.tabReactions}</span>
          <span className="rounded-full bg-neutral-950 px-1.5 py-0.2 text-[10px] text-neutral-400 border border-neutral-800">
            {reactions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("talk")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-xs sm:text-sm font-semibold transition ${
            activeTab === "talk" ? "bg-neutral-800 text-white border border-neutral-700" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{t.tabTalk}</span>
          <span className="rounded-full bg-neutral-950 px-1.5 py-0.2 text-[10px] text-neutral-400 border border-neutral-800">
            {comments.length}
          </span>
        </button>
      </div>

      {/* 6. 탭별 독립 콘텐츠 렌더링 */}
      {loading ? (
        <div className="py-16 text-center text-neutral-500">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent"></div>
        </div>
      ) : (
        <div>
          {/* [탭 1] 실시간 뉴스 & 이적 피드 */}
          {activeTab === "news" && (
            <div className="space-y-3">
              {articles.length === 0 ? (
                <div className="rounded-lg border border-dashed border-neutral-800 p-10 text-center text-neutral-400">
                  <p className="text-sm font-normal">{t.emptyNews}</p>
                </div>
              ) : (
                articles.map((article) => (
                  <article
                    key={article.id}
                    className="rounded-lg bg-neutral-900 p-4 sm:p-5 border border-neutral-800 hover:border-neutral-700 transition"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="rounded bg-neutral-800 px-2 py-0.5 font-medium text-neutral-300 border border-neutral-700">
                          {article.tier === 1 ? t.tier1 : article.tier === 2 ? t.tier2 : t.tier3}
                        </span>
                        <span className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] font-semibold text-neutral-300 border border-neutral-700">
                          {article.transfer_status || "REPORT"}
                        </span>
                        <span className="text-neutral-400">{article.source_name}</span>
                      </div>
                      <span className="text-xs text-neutral-500">
                        {article.published_at ? new Date(article.published_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) : "최신"}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 leading-snug">
                      {stripHtml(article.title)}
                    </h3>

                    <p className="text-sm text-neutral-300 leading-relaxed bg-neutral-950/60 p-3 rounded border border-neutral-800/80 font-normal">
                      {stripHtml(article.summary)}
                    </p>

                    <div className="mt-3 flex justify-end border-t border-neutral-800/80 pt-2.5">
                      <a
                        href={article.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-neutral-300 hover:text-white transition"
                      >
                        {t.readOriginal} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}

          {/* [탭 2] 해외 현지 반응 (Reddit r/soccer, X 수집 데이터 전용) */}
          {activeTab === "reactions" && (
            <div className="space-y-4">
              {/* 동적 AI 핵심 요약: 텍스트가 존재할 때만 조건부 렌더링 */}
              {aiSummary && aiSummary.trim().length > 0 && (
                <div className="rounded-lg bg-neutral-900 p-4 border border-emerald-900/60">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-emerald-300">{t.aiBriefing}</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal whitespace-pre-line">
                    {aiSummary}
                  </p>
                </div>
              )}

              {/* 외부 수집 댓글 목록 */}
              {reactions.length === 0 ? (
                <div className="rounded-lg border border-dashed border-neutral-800 p-10 text-center text-neutral-400">
                  <p className="text-sm font-normal">{t.emptyReactions}</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {reactions.map((r) => (
                    <div key={r.id} className="rounded-lg bg-neutral-900 p-4 border border-neutral-800">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="rounded bg-orange-950/40 px-2 py-0.5 font-semibold text-orange-400 border border-orange-900/60">
                            {r.platform}
                          </span>
                          <span className="text-neutral-400">{r.author_name || "현지 팬"}</span>
                        </div>
                        <span className="text-xs font-medium text-emerald-400">
                          ▲ {r.upvotes.toLocaleString()} 추천
                        </span>
                      </div>

                      <p className="text-sm font-medium text-neutral-100 mt-1 leading-relaxed">
                        "{r.translated_text || r.original_text}"
                      </p>

                      {r.translated_text && (
                        <p className="text-xs text-neutral-500 mt-1.5 font-normal italic">
                          Original: "{r.original_text}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* [탭 3] 글로벌 토크 (FootPulse 사이트 자체 유저 댓글 전용) */}
          {activeTab === "talk" && (
            <div className="space-y-5">
              {/* 유저 댓글 작성 폼 */}
              <form onSubmit={handleCommentSubmit} className="rounded-lg bg-neutral-900 p-4 border border-neutral-800">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-semibold text-neutral-300">{t.writeComment}</h4>
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
                  className="w-full rounded bg-neutral-950 p-2.5 text-sm text-white placeholder-neutral-500 border border-neutral-800 focus:border-neutral-600 focus:outline-none transition"
                />

                <div className="mt-2.5 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingComment || !newCommentText.trim()}
                    className="flex items-center gap-1.5 rounded bg-neutral-100 px-4 py-1.5 text-xs font-bold text-neutral-900 hover:bg-white disabled:opacity-40 transition"
                  >
                    <Send className="h-3 w-3" />
                    {submittingComment ? "..." : t.postComment}
                  </button>
                </div>
              </form>

              {/* 유저 댓글 목록 */}
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-neutral-800 p-10 text-center text-neutral-400">
                    <p className="text-sm font-normal">{t.emptyComments}</p>
                  </div>
                ) : (
                  comments.map((c) => {
                    const isShowingOriginal = !!showOriginalMap[c.id];
                    const flag = COUNTRY_FLAGS[c.author_country] || "⚽";
                    const srcLangName = LANG_NAMES[c.source_lang] || c.source_lang;

                    return (
                      <div key={c.id} className="rounded-lg bg-neutral-900 p-4 border border-neutral-800">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{flag}</span>
                            <span className="text-sm font-semibold text-white">{c.author_name}</span>
                            <span className="text-xs text-neutral-500">
                              {new Date(c.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <button
                            onClick={() => handleLike(c.id)}
                            className="flex items-center gap-1 rounded bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-300 hover:text-red-400 transition border border-neutral-700"
                          >
                            <Heart className="h-3 w-3 text-neutral-400 hover:text-red-400" />
                            {c.likes_count}
                          </button>
                        </div>

                        {/* 댓글 본문 */}
                        <p className="text-sm text-neutral-200 leading-relaxed font-normal">
                          {isShowingOriginal ? c.original_text : c.display_text}
                        </p>

                        {/* 번역 메타 정보 및 원문 토글 */}
                        {c.is_translated && (
                          <div className="mt-2.5 flex items-center justify-between border-t border-neutral-800/80 pt-2 text-xs">
                            <span className="text-neutral-500 font-normal">
                              {LANG_NAMES[lang]} {t.translatedFrom} ({t.originalLang}: {srcLangName})
                            </span>
                            <button
                              onClick={() => toggleOriginal(c.id)}
                              className="font-medium text-neutral-400 hover:text-neutral-200 underline transition"
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
