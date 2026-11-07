"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Loader2,
  CheckCircle2,
  X,
  MapPin,
  Clock,
  ShoppingBag,
  Phone,
} from "lucide-react";

interface Address {
  _id?: string;
  tag: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  addresses: Address[];
  wishlist: string[];
  ordersCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface Metrics {
  totalUsers: number;
  adminCount: number;
  customerCount: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalUsers: 0,
    adminCount: 0,
    customerCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");

  // Selected User for Dossier Modal
  const [dossierUser, setDossierUser] = useState<UserRecord | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load user records");
      const data = await res.json();

      if (data.success) {
        setUsers(data.users || []);
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error fetching collectors";
      showToast(message);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const totalOrdersAcrossCollectors = users.reduce(
    (acc, u) => acc + (u.ordersCount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert (Strict Zero Red Policy) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C241E] text-[#FAF6F0] border border-[#DFCFC0] px-4 py-3 rounded-none shadow-xl text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={15} className="text-[#9D7E50]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-[28px] sm:text-[32px] text-[#2C241E] leading-tight font-medium">
            Collector & User Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6C5E] mt-0.5 font-light">
            Manage registered collectors, customer contact dossiers, and vault orders.
          </p>
        </div>
      </div>

      {/* 1. Metrics Cards (3-column grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Total Users */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#7A6C5E] font-medium block">
              Total Registered Collectors
            </span>
            <div className="font-serif text-[26px] font-semibold text-[#2C241E] mt-1">
              {metrics.totalUsers}
            </div>
            <span className="text-[11px] text-[#8C7A6B] block mt-1">
              Recorded in Horologe Vault
            </span>
          </div>
          <div className="w-11 h-11 rounded-none bg-[#DECFC0] flex items-center justify-center text-[#5C4529] shadow-2xs">
            <Users size={20} />
          </div>
        </div>

        {/* Metric 2: Active Clients */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#7A6C5E] font-medium block">
              Active Client Profiles
            </span>
            <div className="font-serif text-[26px] font-semibold text-[#2C241E] mt-1">
              {metrics.customerCount || metrics.totalUsers}
            </div>
            <span className="text-[11px] text-[#8C7A6B] block mt-1">
              Private Clients & Patrons
            </span>
          </div>
          <div className="w-11 h-11 rounded-none bg-[#DECFC0] flex items-center justify-center text-[#5C4529] shadow-2xs">
            <Phone size={20} />
          </div>
        </div>

        {/* Metric 3: Total Orders Placed */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#7A6C5E] font-medium block">
              Total Vault Acquisitions
            </span>
            <div className="font-serif text-[26px] font-semibold text-[#2C241E] mt-1">
              {totalOrdersAcrossCollectors}
            </div>
            <span className="text-[11px] text-[#8C7A6B] block mt-1">
              Certified Timepiece Orders
            </span>
          </div>
          <div className="w-11 h-11 rounded-none bg-[#2C241E] flex items-center justify-center text-[#FAF6F0] shadow-2xs">
            <ShoppingBag size={20} />
          </div>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-4 shadow-[0_8px_24px_rgba(80,60,40,0.03)] flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collector by name, email, or contact phone..."
            className="w-full bg-white/70 border border-[#DFCFC0] rounded-none pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#2C241E] placeholder:text-[#9E8D7E] focus:outline-none focus:border-[#5C4529] focus:bg-white transition-all font-sans"
          />
        </div>
      </div>

      {/* 3. Collector Directory Table */}
      <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none overflow-hidden shadow-[0_8px_24px_rgba(80,60,40,0.03)]">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 size={24} className="animate-spin text-[#5C4529]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#7A6C5E]">
              Loading Collectors...
            </span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Users size={32} className="mx-auto text-[#A89887] mb-3" />
            <p className="font-serif text-lg text-[#2C241E]">No Collectors Found</p>
            <p className="text-xs text-[#7A6C5E] mt-1 max-w-sm mx-auto">
              No registered user records match your search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#DFCFC0]/60 text-[11px] uppercase tracking-[0.18em] text-[#7A6C5E] bg-white/30">
                  <th className="py-3.5 px-5 font-semibold">Collector</th>
                  <th className="py-3.5 px-4 font-semibold">Contact Phone</th>
                  <th className="py-3.5 px-4 font-semibold">Saved Addresses</th>
                  <th className="py-3.5 px-4 font-semibold">Total Orders</th>
                  <th className="py-3.5 px-4 font-semibold">Joined</th>
                  <th className="py-3.5 px-5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFCFC0]/40">
                {users.map((u) => {
                  const initials = u.name
                    .split(" ")
                    .map((n) => n[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  const displayPhone =
                    u.phone ||
                    u.addresses?.find((a) => a.phone)?.phone ||
                    u.addresses?.[0]?.phone ||
                    "";

                  return (
                    <tr
                      key={u._id}
                      onClick={() => setDossierUser(u)}
                      className="hover:bg-white/50 transition-colors duration-150 cursor-pointer"
                    >
                      {/* Collector Profile: Name + Email */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-none bg-[#DECFC0] border border-[#DFCFC0] text-[#5C4529] font-medium flex items-center justify-center shrink-0 text-xs">
                            {initials || "U"}
                          </div>
                          <div>
                            <span className="font-semibold text-[#2C241E] block text-sm">
                              {u.name}
                            </span>
                            <span className="text-xs text-[#7A6C5E] block mt-0.5">
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Phone (Dark Espresso #2C241E) */}
                      <td className="py-4 px-4 text-[#2C241E] font-medium font-sans">
                        {displayPhone ? (
                          displayPhone
                        ) : (
                          <span className="text-[#A89887] font-normal">—</span>
                        )}
                      </td>

                      {/* Saved Addresses Count */}
                      <td className="py-4 px-4 text-[#5C4F42]">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#8C7A6B]" />
                          <span>{u.addresses?.length || 0}</span>
                        </span>
                      </td>

                      {/* Total Orders Placed */}
                      <td className="py-4 px-4 text-[#5C4F42]">
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#2C241E]">
                          <ShoppingBag size={13} className="text-[#8C7A6B]" />
                          <span>{u.ordersCount || 0}</span>
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 text-[#7A6C5E] text-xs whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={12} className="text-[#8C7A6B]" />
                          {new Date(u.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Actions: ONLY DOSSIER BUTTON */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setDossierUser(u)}
                            className="px-3.5 py-1.5 bg-white/70 hover:bg-white border border-[#DFCFC0] hover:border-[#5C4529] rounded-none text-xs font-semibold text-[#2C241E] transition-all cursor-pointer"
                          >
                            Dossier
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Collector Dossier Modal */}
      {dossierUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] border border-[#DFCFC0] rounded-none w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#DFCFC0] pb-4 mb-5">
              <div>
                <span className="text-[10px] tracking-[0.2em] font-semibold text-[#8C7A6B] uppercase block mb-1">
                  Collector Dossier
                </span>
                <h3 className="font-serif text-2xl text-[#2C241E]">{dossierUser.name}</h3>
                <p className="text-xs text-[#7A6C5E] mt-0.5">{dossierUser.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setDossierUser(null)}
                className="p-1 text-[#8C7A6B] hover:text-[#2C241E] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/60 p-4 rounded-none border border-[#DFCFC0] mb-5 text-xs">
              <div>
                <span className="text-[#8C7A6B] block uppercase text-[10px] tracking-wider mb-1">
                  Primary Phone
                </span>
                <span className="font-semibold text-[#2C241E]">
                  {dossierUser.phone ||
                    dossierUser.addresses?.find((a) => a.phone)?.phone ||
                    dossierUser.addresses?.[0]?.phone ||
                    "—"}
                </span>
              </div>
              <div>
                <span className="text-[#8C7A6B] block uppercase text-[10px] tracking-wider mb-1">
                  Saved Vault Destinations
                </span>
                <span className="font-semibold text-[#2C241E]">
                  {dossierUser.addresses?.length || 0}
                </span>
              </div>
              <div>
                <span className="text-[#8C7A6B] block uppercase text-[10px] tracking-wider mb-1">
                  Orders Placed
                </span>
                <span className="font-semibold text-[#2C241E]">
                  {dossierUser.ordersCount || 0}
                </span>
              </div>
            </div>

            {/* Registered Destinations List */}
            <div className="mb-6">
              <h4 className="font-serif text-base text-[#2C241E] mb-3 flex items-center gap-2">
                <MapPin size={15} className="text-[#5C4529]" />
                Registered Delivery Destinations
              </h4>
              {dossierUser.addresses && dossierUser.addresses.length > 0 ? (
                <div className="space-y-2.5">
                  {dossierUser.addresses.map((addr, idx) => (
                    <div
                      key={addr._id || idx}
                      className="p-3 bg-white/80 border border-[#DFCFC0] rounded-none text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#2C241E]">{addr.tag}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-[#EFE8DD] text-[#5C4529] px-2 py-0.5 rounded-none font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-[#5C4F42] leading-relaxed">
                        {addr.name} — {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} -{" "}
                        {addr.postalCode}, {addr.country}
                      </p>
                      <p className="text-[#7A6C5E] mt-1 font-sans">
                        Contact Tel: <span className="text-[#2C241E] font-medium">{addr.phone}</span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#8C7A6B] italic bg-white/40 p-3 rounded-none border border-[#DFCFC0]">
                  No delivery destinations have been registered to this collector account.
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-[#DFCFC0]">
              <button
                type="button"
                onClick={() => setDossierUser(null)}
                className="px-4 py-2 bg-white hover:bg-[#FAF6F0] border border-[#DFCFC0] rounded-none text-xs font-semibold text-[#2C241E] transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
