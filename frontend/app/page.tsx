"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Globe, Star, MessageSquare, Newspaper, 
  Heart, ExternalLink, Activity, ArrowRight, Sparkles, Send
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
    hubTitle: "선수 중심 축구 인텔리전스 및 다국적 토크 커뮤니티",
    searchPlaceholder: "선수 검색 (초성 ㅅㅎㅁ, Son, Yamal, 바르셀로나, LAFC)...",
    trending: "주목받는 선수:",
    tabNews: "뉴스 및 이적",
    tabReactions: "해외 현지 반응",
    tabTalk: "글로벌 토크",
    favorite: "관심 선수 등록",
    favorited: "관심 선수",
    aiBriefing: "해외 여론 핵심 요약",
    viewOriginal: "원문 확인",
    viewTranslated: "번역문 확인",
    translatedFrom: "로 번역됨",
    originalLang: "원문 언어",
    writeComment: "모국어로 자유롭게 의견을 공유하세요",
    postComment: "등록",
    nicknamePlaceholder: "닉네임",
    commentPlaceholder: "선수의 최근 활약이나 이적에 대한 의견을 남겨주세요...",
    tier1: "Tier 1 공식 외신",
    tier2: "Tier 2 전담 기자",
    tier3: "Tier 3 이적 보도",
    readOriginal: "기사 원문 보기",
    emptyNews: "해당 선수의 최신 기사를 수집 동기화 중입니다.",
    emptyComments: "등록된 팬 코멘트가 없습니다. 첫 의견을 남겨보세요.",
  },
  en: {
    hubTitle: "Player-Centric Football Intelligence & Global Discussion",
    searchPlaceholder: "Search player (e.g., Son, Yamal, Barcelona, LAFC)...",
    trending: "Featured Players:",
    tabNews: "News & Transfers",
    tabReactions: "Global Consensus",
    tabTalk: "Global Talk",
    favorite: "Track Player",
    favorited: "Tracking",
    aiBriefing: "Global Consensus Summary",
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
    emptyComments: "No comments yet. Start the conversation.",
  },
  ja: {
    hubTitle: "選手特化型フットボールインテリジェンス＆多言語コミュニティ",
    searchPlaceholder: "選手検索 (例: ソン・フンミン, ヤマル, バルセロナ)...",
    trending: "注目選手:",
    tabNews: "ニュース・移籍",
    tabReactions: "海外現地反応",
    tabTalk: "グローバルトーク",
    favorite: "お気に入り",
    favorited: "登録済み",
    aiBriefing: "海外世論の要約",
    viewOriginal: "原文を見る",
    viewTranslated: "翻訳を見る",
    translatedFrom: "に翻訳",
    originalLang: "原文",
    writeComment: "母国語で世界のファンと意見を交わしましょう",
    postComment: "投稿",
    nicknamePlaceholder: "ニックネーム",
    commentPlaceholder: "選手のパフォーマンスや移籍に関する意見を共有...",
    tier1: "Tier 1 公式外信",
    tier2: "Tier 2 担当記者",
    tier3: "Tier 3 報道",
    readOriginal: "元記事を読む",
    emptyNews: "関連ニュースを同期中です...",
    emptyComments: "コメントがありません。最初の意見を投稿しましょう。",
  },
  zh: {
    hubTitle: "球员专属足球资讯中心与多语言球迷社群",
    searchPlaceholder: "搜索球员 (例如: 孙兴慜, 亚马尔, 巴萨, 皇马)...",
    trending: "聚焦球星:",
    tabNews: "新闻与转会",
    tabReactions: "海外舆情",
    tabTalk: "全球对话",
    favorite: "关注球员",
    favorited: "已关注",
    aiBriefing: "海外舆情要点",
    viewOriginal: "查看原文",
    viewTranslated: "查看翻译",
    translatedFrom: "已翻译为",
    originalLang: "原文语言",
    writeComment: "用母语与全球球迷直接交流",
    postComment: "发布",
    nicknamePlaceholder: "昵称",
    commentPlaceholder: "分享你对该球员表现或转会的看法...",
    tier1: "Tier 1 官方信源",
    tier2: "Tier 2 跟队记者",
    tier3: "Tier 3 媒体报道",
    readOriginal: "阅读原报道",
    emptyNews: "正在同步相关报道...",
    emptyComments: "暂无讨论，发表第一条评论吧。",
  },
  fr: {
    hubTitle: "Hub Joueurs Football & Espace de Discussion International",
    searchPlaceholder: "Rechercher un joueur (ex: Yamal, Mbappé, Son, Real)...",
    trending: "Joueurs à la une:",
    tabNews: "Actualités & Transferts",
    tabReactions: "Avis Internationaux",
    tabTalk: "Discussion Globale",
    favorite: "Suivre",
    favorited: "Suivi",
    aiBriefing: "Synthèse des réactions",
    viewOriginal: "Voir la version originale",
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
    emptyComments: "Aucun commentaire pour le moment.",
  },
  it: {
    hubTitle: "Hub Calciatori & Community di Discussione Multilingue",
    searchPlaceholder: "Cerca calciatore (es: Yamal, Son, Mbappé, Barcellona)...",
    trending: "In primo piano:",
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
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState<"news" | "reactions" | "talk">("news");
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [briefing, setBriefing] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const [authorName, setAuthorName] = useState("");
  const [authorCountry, setAuthorCountry] = useState("KR");
  const [newCommentText, setNewCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const [showOriginalMap, setShowOriginalMap] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<string[]>([]);

  const t = I18N[lang] || I18N.ko;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/players`);
        if (res.ok) {
          const data: Player[] = await res.json();
          setPlayers(data);
          if (data.length > 0 && !selectedPlayer) {
            setSelectedPlayer(data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load players:", err);
      }
    };
    fetchPlayers();
  }, []);

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
              v3.0 Hub
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

      {/* 2. 선수 통합 검색창 */}
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
        </div>

        {/* 검색 드롭다운 */}
        {searchResults.length > 0 && (
          <div className="absolute z-30 mt-1.5 w-full rounded-lg bg-neutral-900 p-1.5 border border-neutral-700 shadow-lg">
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
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{COUNTRY_FLAGS[player.nationality_code || ""] || "⚽"}</span>
                  <div>
                    <span className="font-semibold text-white text-sm">{player.name_ko} ({player.name_en})</span>
                    <span className="block text-xs text-neutral-400">{player.current_club_name} · {player.position}</span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-neutral-500" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. 주목받는 선수 바 (단정하고 일관된 뱃지) */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-neutral-400 whitespace-nowrap mr-1">
          {t.trending}
        </span>
        {players.map((p) => {
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
              <span>{COUNTRY_FLAGS[p.nationality_code || ""] || "⚽"}</span>
              {p.name_ko}
            </button>
          );
        })}
      </div>

      {/* 4. 선수 전용 허브 히어로 카드 (플랫 다크 서피스 + 1px 헤어라인) */}
      {selectedPlayer && (
        <div className="mb-6 rounded-lg bg-neutral-900 p-5 border border-neutral-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-md overflow-hidden border border-neutral-700 bg-neutral-800 flex-shrink-0">
                <img
                  src={selectedPlayer.photo_url || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400"}
                  alt={selectedPlayer.name_ko}
                  className="h-full w-full object-cover"
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

      {/* 5. 선수 허브 3대 탭 (단정한 분할 탭) */}
      <div className="mb-6 flex rounded-lg bg-neutral-900 p-1 border border-neutral-800">
        <button
          onClick={() => setActiveTab("news")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-xs sm:text-sm font-semibold transition ${
            activeTab === "news" ? "bg-neutral-800 text-white border border-neutral-700" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Newspaper className="h-3.5 w-3.5" />
          {t.tabNews}
        </button>
        <button
          onClick={() => setActiveTab("reactions")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-xs sm:text-sm font-semibold transition ${
            activeTab === "reactions" ? "bg-neutral-800 text-white border border-neutral-700" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {t.tabReactions}
        </button>
        <button
          onClick={() => setActiveTab("talk")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-xs sm:text-sm font-semibold transition ${
            activeTab === "talk" ? "bg-neutral-800 text-white border border-neutral-700" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          {t.tabTalk}
        </button>
      </div>

      {/* 6. 탭별 콘텐츠 */}
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
                        <span className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300 border border-neutral-700">
                          {article.transfer_status || "REPORT"}
                        </span>
                        <span className="text-neutral-400">{article.source_name}</span>
                      </div>
                      <span className="text-xs text-neutral-500 ">
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

          {/* [탭 2] 해외 핫 반응 (Reddit, X) + AI 여론 브리핑 */}
          {activeTab === "reactions" && (
            <div className="space-y-4">
              {/* 상단 AI 3줄 요약 카드 */}
              {briefing.length > 0 && (
                <div className="rounded-lg bg-neutral-900 p-4 border border-neutral-800">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Sparkles className="h-4 w-4 text-neutral-400" />
                    <h4 className="text-xs font-bold text-neutral-300">{t.aiBriefing}</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-300 list-disc list-inside font-normal">
                    {briefing.map((line, idx) => (
                      <li key={idx} className="leading-relaxed">{line}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 해외 베스트 댓글 목록 */}
              <div className="space-y-2.5">
                {reactions.map((r) => (
                  <div key={r.id} className="rounded-lg bg-neutral-900 p-4 border border-neutral-800">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="rounded bg-neutral-800 px-2 py-0.5 font-medium text-neutral-300 border border-neutral-700">
                          {r.platform}
                        </span>
                        <span className="text-neutral-400">{r.author_name || "현지 반응"}</span>
                      </div>
                      <span className="text-xs font-medium text-neutral-400">
                        ▲ {r.upvotes.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-neutral-100 mt-1 leading-relaxed">
                      "{r.translated_text || r.original_text}"
                    </p>

                    {r.translated_text && (
                      <p className="text-xs text-neutral-500 mt-1.5 font-normal">
                        Original: "{r.original_text}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* [탭 3] 글로벌 토크 (다국적 교차 번역 커뮤니티) */}
          {activeTab === "talk" && (
            <div className="space-y-5">
              {/* 댓글 작성 폼 */}
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

              {/* 글로벌 댓글 목록 */}
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
                            <span className="text-xs text-neutral-500 ">
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
