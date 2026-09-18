"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePulse } from "@/lib/pulse-context";
import {
  Briefcase,
  PlusCircle,
  ChevronDown,
  Sparkles,
  Layers,
  FileText,
  CheckCircle,
  UserCheck,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function Navbar() {
  const {
    currentUser,
    currentRole,
    allUsers,
    switchRole,
    switchUser,
    activeView,
    setActiveView,
    setIsPostWizardOpen,
  } = usePulse();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-500/15 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setActiveView("marketplace")}
            className="flex items-center space-x-2.5 group text-left focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 p-[1px] shadow-glow-blue transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-background rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-sky-400" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-bold tracking-tight text-white font-sans">
                  Pulse<span className="text-blue-400">Connect</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-blue-950/70 text-blue-300 rounded-md border border-blue-500/30">
                  PRO
                </span>
              </div>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveView("marketplace")}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === "marketplace"
                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-blue-950/30"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Marketplace</span>
              </div>
            </button>

            {currentRole === "CLIENT" ? (
              <button
                onClick={() => setActiveView("my-projects")}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeView === "my-projects"
                    ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-blue-950/30"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>Client Board</span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setActiveView("freelancer-bids")}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeView === "freelancer-bids"
                    ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-blue-950/30"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>My Proposals</span>
                </div>
              </button>
            )}
          </nav>
        </div>

        {/* Right Section: Role Switcher & User Profile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Dual Role Switcher Pill */}
          <div className="flex items-center bg-[#070D1F] p-1 rounded-full border border-blue-500/20 shadow-inner">
            <button
              onClick={() => switchRole("CLIENT")}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                currentRole === "CLIENT"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-glow-blue font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              Client (Hire)
            </button>
            <button
              onClick={() => switchRole("FREELANCER")}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                currentRole === "FREELANCER"
                  ? "bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold shadow-glow-cyan"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              Freelancer (Work)
            </button>
          </div>

          {/* Action CTA */}
          {currentRole === "CLIENT" ? (
            <button
              onClick={() => setIsPostWizardOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Project</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveView("marketplace")}
              className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-blue-950/40 hover:bg-blue-900/50 text-blue-200 border border-blue-500/30 transition-all"
            >
              <Briefcase className="w-4 h-4 text-sky-400" />
              <span>Browse Jobs</span>
            </button>
          )}

          {/* Small Notification Button with Number Badge */}
          <NotificationBell />

          {/* User Persona Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center space-x-2.5 p-1.5 pl-2 rounded-xl border border-blue-500/20 bg-background-card hover:bg-background-cardHover hover:border-blue-500/40 transition-all focus:outline-none"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/30"
              />
              <div className="hidden lg:block text-left pr-1">
                <p className="text-xs font-semibold text-white leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[110px]">
                  {currentUser.company || currentUser.headline || currentUser.role}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
            </button>

            {/* Dropdown Menu */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-background-card/95 border border-blue-500/30 shadow-glass backdrop-blur-xl p-2 animate-slide-up z-50">
                <div className="p-2.5 border-b border-blue-500/15 mb-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-blue-300">
                      Active Persona
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                        currentUser.role === "CLIENT"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white">{currentUser.name}</p>
                  <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <div className="px-2 py-1 text-[11px] font-mono text-slate-400 uppercase">
                    Switch Test Persona
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {allUsers.map((u) => {
                      const isCurrent = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setIsUserDropdownOpen(false);
                          }}
                          className={`w-full flex items-center space-x-2.5 p-2 rounded-xl text-left transition-colors ${
                            isCurrent
                              ? "bg-blue-600/20 border border-blue-500/40"
                              : "hover:bg-blue-950/40"
                          }`}
                        >
                          <img
                            src={u.avatarUrl}
                            alt={u.name}
                            className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/10"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-white truncate">
                                {u.name}
                              </span>
                              <span
                                className={`text-[9px] font-mono uppercase px-1 rounded ${
                                  u.role === "CLIENT"
                                    ? "text-blue-300 bg-blue-500/15"
                                    : "text-sky-300 bg-sky-500/15"
                                }`}
                              >
                                {u.role === "CLIENT" ? "Client" : "Dev"}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">
                              {u.company || u.headline}
                            </p>
                          </div>
                          {isCurrent && (
                            <CheckCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
