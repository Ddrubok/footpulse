"use client";

import React, { useState, useEffect } from "react";
import { Search, Globe, Shield, ExternalLink, Activity, X, Sparkles, Filter } from "lucide-react";

interface Club {
  id?: string;
  club_id?: string;
  name_ko?: string;
  name_en?: string;
  league?: string;
  country?: string;
  role?: string;
}

interface Article {
  id: string;
  source_name: string;
  source_url: string;
  tier: number;
  transfer_status: string;
  player_name?: string;
  published_at: string;
  title: string;
  summary: string;
  mentioned_clubs?: Club[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://tired-east-small-years.trycloudflare.com";

export default function Home() {
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Club[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("ko");

  // 추천 퀵 필터 구단
  const quickClubs = [
    { id: "LAFC", name: "로스앤젤레스 FC" },
    { id: "ATM", name: "아틀레티코" },
    { id: "TOT", name: "토트넘" },
    { id: "PSG", name: "파리 생제르맹" },
    { id: "MCI", name: "맨시티" },
    { id: "BAR", name: "바르셀로나" },
  ];

  // 구단 검색
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/clubs?q=${encodeURIComponent(searchQuery)}`);
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

  // 피드 로드
  const fetchFeed = async () => {
    setLoading(true);
    try {
      const clubsParam = selectedClubs.length > 0 ? `&clubs=${selectedClubs.join(",")}` : "";
      const res = await fetch(`${API_BASE}/api/feed?lang=${lang}${clubsParam}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (err) {
      console.error("Feed fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [selectedClubs, lang]);

  const toggleClub = (id?: string) => {
    if (!id) return;
    if (selectedClubs.includes(id)) {
      setSelectedClubs(selectedClubs.filter((c) => c !== id));
    } else {
      setSelectedClubs([...selectedClubs, id]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const getTierBadge = (tier: number) => {
    switch (tier) {
      case 1:
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-900/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-700/50">🟢 Tier 1 오피셜/외신</span>;
      case 2:
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-900/60 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-700/50">🟡 Tier 2 전담기자</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-gray-400 border border-gray-700">⚪ Tier 3 루머</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DONE_DEAL":
        return <span className="rounded bg-blue-600/30 px-2 py-0.5 text-xs font-bold text-blue-400 border border-blue-500/40">DONE DEAL</span>;
      case "HERE_WE_GO":
        return <span className="rounded bg-emerald-600/30 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/40">HERE WE GO</span>;
      case "TALKS":
        return <span className="rounded bg-indigo-600/30 px-2 py-0.5 text-xs font-bold text-indigo-400 border border-indigo-500/40">TALKS (협상 중)</span>;
      default:
        return <span className="rounded bg-gray-700/40 px-2 py-0.5 text-xs font-bold text-gray-300 border border-gray-600/40">RUMOR</span>;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 1. 상단 글로벌 헤더 */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Activity className="h-8 w-8 text-emerald-400" />
              Foot<span className="text-emerald-400">Pulse</span>
            </h1>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              S21U 엣지 서버 가동 중
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-400">전 세계 구단 교차 분석 및 실시간 축구 뉴스·이적 피드</p>
        </div>

        {/* 언어 선택기 */}
        <div className="flex items-center gap-2 rounded-lg bg-gray-900 p-1 border border-gray-800">
          <Globe className="ml-2 h-4 w-4 text-gray-400" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent pr-3 py-1 text-sm font-medium text-gray-300 focus:outline-none"
          >
            <option value="ko" className="bg-gray-900">🇰🇷 한국어</option>
            <option value="en" className="bg-gray-900">🇬🇧 English</option>
            <option value="es" className="bg-gray-900">🇪🇸 Español</option>
          </select>
        </div>
      </header>

      {/* 2. 스마트 구단 검색 및 필터 바 */}
      <section className="mb-8 space-y-4">
        <div className="relative">
          <div className="flex items-center rounded-xl bg-gray-900/90 px-4 py-3 border border-gray-800 shadow-inner focus-within:border-emerald-500/60 transition">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="구단 검색 (예: LAFC, 토트넘, 아틀레티코, 맨시티, 초성 ㅁㅅㅌ)..."
              className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* 검색 자동완성 드롭다운 */}
          {searchResults.length > 0 && (
            <div className="absolute z-20 mt-2 w-full rounded-xl bg-gray-900/95 p-2 shadow-2xl border border-gray-700 backdrop-blur-md">
              {searchResults.map((club) => {
                const cid = club.id || club.club_id;
                return (
                  <button
                    key={cid}
                    onClick={() => toggleClub(cid)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-gray-200 hover:bg-gray-800 transition"
                  >
                    <span className="font-semibold">{club.name_ko} ({club.name_en})</span>
                    <span className="text-xs text-gray-400">{club.league}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 퀵 필터 칩 */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 mr-1">
            <Filter className="h-3.5 w-3.5" /> 추천 구단:
          </span>
          {quickClubs.map((club) => {
            const isSelected = selectedClubs.includes(club.id);
            return (
              <button
                key={club.id}
                onClick={() => toggleClub(club.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  isSelected
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                    : "bg-gray-800/80 text-gray-300 hover:bg-gray-700 border border-gray-700/60"
                }`}
              >
                {club.name}
              </button>
            );
          })}
        </div>

        {/* 활성화된 필터 칩 */}
        {selectedClubs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-800/60">
            <span className="text-xs font-medium text-emerald-400">교차 필터 적용 중:</span>
            {selectedClubs.map((cid) => (
              <span
                key={cid}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/70 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-600/40"
              >
                {cid}
                <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => toggleClub(cid)} />
              </span>
            ))}
            <button
              onClick={() => setSelectedClubs([])}
              className="text-xs text-gray-500 hover:text-gray-300 underline ml-2"
            >
              초기화
            </button>
          </div>
        )}
      </section>

      {/* 3. 피드 카드 리스트 */}
      <main className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-gray-500">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-3 text-sm">S21 울트라 엣지 DB에서 피드 쿼리 중...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-800 p-12 text-center text-gray-400">
            <Sparkles className="mx-auto h-8 w-8 text-gray-600 mb-2" />
            <p className="font-medium">선택된 구단 조건에 일치하는 기사가 아직 없습니다.</p>
            <p className="text-xs text-gray-500 mt-1">외신 수집기(collector.py)가 계속해서 최신 뉴스를 감지하고 있습니다.</p>
          </div>
        ) : (
          articles.map((article) => (
            <article
              key={article.id}
              className="group rounded-2xl bg-[#111624] p-5 border border-gray-800/80 shadow-lg hover:border-gray-700 transition"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {getTierBadge(article.tier)}
                  {getStatusBadge(article.transfer_status)}
                  <span className="text-xs font-medium text-gray-400">{article.source_name}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {article.published_at ? new Date(article.published_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) : "방금 전"}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white group-hover:text-emerald-300 transition leading-snug">
                {article.title}
              </h2>

              <p className="mt-2 text-sm text-gray-300 leading-relaxed bg-gray-900/40 p-3 rounded-xl border border-gray-800/40">
                {article.summary}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-800/60 pt-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {article.mentioned_clubs &&
                    article.mentioned_clubs.map((c, idx) => {
                      const cid = c.club_id || c.id;
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleClub(cid)}
                          className="rounded-md bg-gray-800/70 px-2.5 py-1 text-xs font-semibold text-gray-300 hover:bg-emerald-900/40 hover:text-emerald-300 border border-gray-700/50 transition"
                        >
                          #{c.name_ko || cid}
                        </button>
                      );
                    })}
                </div>

                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition"
                >
                  원문 읽기 <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
}