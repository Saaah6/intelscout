"use client";

import React, { useState, useEffect } from "react";
import { EnvelopeOpen, ShieldCheck, ArrowsCounterClockwise, CircleNotch, CalendarBlank, UserCheck } from "@phosphor-icons/react";

interface UserRecord {
  email: string;
  name: string;
  avatar: string;
  createdAt: string;
}

interface SubscriberRecord {
  email: string;
  subscribedAt: string;
}

export default function AudiencePanel() {
  const [activeSubTab, setActiveSubTab] = useState<"users" | "subscribers">("users");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch users
      const usersRes = await fetch("/api/auth/users");
      const usersData = await usersRes.json();

      // Fetch subscribers
      const subsRes = await fetch("/api/newsletter/subscribers");
      const subsData = await subsRes.json();

      if (usersRes.ok && usersData.success) {
        setUsers(usersData.users || []);
      } else {
        setError(usersData.error || "Failed to retrieve registered users.");
      }

      if (subsRes.ok && subsData.success) {
        setSubscribers(subsData.subscribers || []);
      } else {
        setError(subsData.error || "Failed to retrieve newsletter subscribers.");
      }
    } catch (err) {
      setError("Failed to fetch data from the server API. Confirm the server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5 shadow-lg flex-1 flex flex-col overflow-hidden max-w-4xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-850/60 mb-6">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">Stored Audience & Auth Logs</h3>
          <p className="text-[10px] text-zinc-400">Direct server-side view of registered Google users and newsletter subscribers stored in local JSON files.</p>
        </div>
        
        {/* Refresh */}
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-3.5 py-2 text-xs font-bold bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-zinc-350 hover:text-white rounded-xl flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <CircleNotch className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ArrowsCounterClockwise className="w-3.5 h-3.5" />
          )}
          <span>Refresh Data</span>
        </button>
      </div>

      {/* error banner */}
      {error && (
        <div className="mb-5 p-3.5 bg-red-950/20 border border-red-900/35 text-red-400 rounded-xl text-xs">
          {error}
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex items-center space-x-1.5 bg-zinc-950 p-1 border border-zinc-900 rounded-xl mb-5 w-fit">
        <button
          onClick={() => setActiveSubTab("users")}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
            activeSubTab === "users"
              ? "bg-violet-600 text-white shadow-md"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Google Registrations ({users.length})
        </button>
        <button
          onClick={() => setActiveSubTab("subscribers")}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
            activeSubTab === "subscribers"
              ? "bg-violet-600 text-white shadow-md"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Newsletter Subscribers ({subscribers.length})
        </button>
      </div>

      {/* Content Viewport */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-2.5">
            <CircleNotch className="w-8 h-8 text-violet-500 animate-spin" />
            <span className="text-xs text-zinc-500 font-semibold">Loading data logs from server...</span>
          </div>
        ) : activeSubTab === "users" ? (
          /* Users Table */
          users.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-zinc-850/60 rounded-xl text-center p-6">
              <ShieldCheck className="w-10 h-10 text-zinc-700 mb-3 animate-pulse" />
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">No Google Accounts Registered</p>
              <p className="text-[10px] text-zinc-550 max-w-xs mt-1 leading-relaxed">
                Log out and sign in using the simulated Google Account selector to see records appear here.
              </p>
            </div>
          ) : (
            <div className="border border-zinc-850/80 rounded-xl overflow-hidden bg-zinc-950/20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950 border-b border-zinc-850/80 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    <th className="p-3.5">User Profile</th>
                    <th className="p-3.5">Email Address</th>
                    <th className="p-3.5">Provider</th>
                    <th className="p-3.5">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850/50">
                  {users.map((u, i) => (
                    <tr key={i} className="hover:bg-zinc-900/20 text-xs transition duration-150">
                      <td className="p-3.5 flex items-center space-x-2.5">
                        <img 
                          src={u.avatar} 
                          alt={u.name} 
                          className="w-7 h-7 rounded-full border border-zinc-800 bg-zinc-950 p-0.5"
                        />
                        <span className="font-bold text-white leading-none">{u.name}</span>
                      </td>
                      <td className="p-3.5 font-medium text-zinc-350">{u.email}</td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-950/25 border border-emerald-900/30 text-emerald-400 rounded-md text-[9px] font-bold uppercase tracking-wider">
                          <UserCheck className="w-2.5 h-2.5" />
                          <span>Google</span>
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[10px] text-zinc-500">{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* Subscribers Table */
          subscribers.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-zinc-850/60 rounded-xl text-center p-6">
              <EnvelopeOpen className="w-10 h-10 text-zinc-700 mb-3 animate-pulse" />
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">No Newsletter Subscribers</p>
              <p className="text-[10px] text-zinc-550 max-w-xs mt-1 leading-relaxed">
                Subscribe via the Newsletter Form on the Landing Page to see subscribers list update.
              </p>
            </div>
          ) : (
            <div className="border border-zinc-850/80 rounded-xl overflow-hidden bg-zinc-950/20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950 border-b border-zinc-850/80 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    <th className="p-3.5">Subscriber Email</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Subscribed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850/50">
                  {subscribers.map((s, i) => (
                    <tr key={i} className="hover:bg-zinc-900/20 text-xs transition duration-150">
                      <td className="p-3.5 font-semibold text-zinc-200 flex items-center space-x-2">
                        <div className="p-1 bg-violet-950/30 border border-violet-900/30 text-violet-400 rounded-md">
                          <EnvelopeOpen className="w-3.5 h-3.5" />
                        </div>
                        <span>{s.email}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-950/25 border border-blue-900/30 text-blue-400 rounded-md text-[9px] font-bold uppercase tracking-wider">
                          <span>Active</span>
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[10px] text-zinc-500 flex items-center space-x-1.5 pt-4">
                        <CalendarBlank className="w-3.5 h-3.5 text-zinc-600" />
                        <span>{formatDate(s.subscribedAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

      </div>

    </div>
  );
}
