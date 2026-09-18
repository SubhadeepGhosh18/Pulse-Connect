"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePulse } from "@/lib/pulse-context";
import { formatRelativeTime } from "@/lib/utils";
import { Project } from "@/types";
import { Bell, CheckCheck, Sparkles, ArrowRight, X, ExternalLink } from "lucide-react";

export function NotificationBell() {
  const { projects, setSelectedProject, setIsProjectModalOpen } = usePulse();
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Notifications based on active client projects seeking talent
  const notifications = projects
    .filter((p) => p.status === "OPEN")
    .map((p) => ({
      id: p.id,
      title: p.title,
      clientName: p.client?.name || "Verified Client",
      clientCompany: p.client?.company || "Tech Company",
      clientAvatar: p.client?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
      createdAt: p.createdAt,
      budget: p.budgetType === "FIXED" ? `$${p.budgetMax.toLocaleString()}` : `$${p.budgetMax}/hr`,
      project: p,
    }));

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const handleNotificationClick = (project: Project, id: string) => {
    setReadIds((prev) => [...prev, id]);
    setSelectedProject(project);
    setIsProjectModalOpen(true);
    setIsOpen(false);
  };

  const handleMarkAllRead = () => {
    setReadIds(notifications.map((n) => n.id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Small Notification Button with Number Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-background-card border border-blue-500/25 hover:border-blue-400/60 hover:bg-blue-950/40 text-slate-300 hover:text-white transition-all focus:outline-none shadow-sm"
        title="Client Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-blue-300" />

        {/* Number Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-mono font-bold text-white bg-blue-600 rounded-full border border-blue-400/60 shadow-glow-blue animate-fade-in">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Sleek Notification Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-background-card/95 border border-blue-500/30 shadow-glass backdrop-blur-xl p-3 animate-slide-up z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-blue-500/15 mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Notifications
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-blue-950 border border-blue-400/40 text-sky-300">
                {unreadCount} new
              </span>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-blue-400 hover:text-sky-200 flex items-center space-x-1 transition-colors"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List of Client Notifications */}
          <div className="max-h-72 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No notifications right now
              </div>
            ) : (
              notifications.map((item) => {
                const isRead = readIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item.project, item.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-2.5 ${
                      isRead
                        ? "bg-background-secondary/40 border-border-subtle opacity-70 hover:opacity-100"
                        : "bg-blue-950/40 border-blue-500/25 hover:border-blue-400/50 hover:bg-blue-900/30 shadow-sm"
                    }`}
                  >
                    <img
                      src={item.clientAvatar}
                      alt={item.clientName}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-blue-500/30 flex-shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-white truncate">
                          {item.clientName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-1 font-medium mt-0.5">
                        {item.title}
                      </p>
                      <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                        <span className="text-slate-400">{item.clientCompany}</span>
                        <span className="text-sky-300 font-bold">{item.budget}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
