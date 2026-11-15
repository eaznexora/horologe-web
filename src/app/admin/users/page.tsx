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
  Trash2,
  ShieldAlert,
  ShieldCheck,
  FileText,
  AlertTriangle,
  MessageSquare,
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

interface AppealMessage {
  message: string;
  submittedAt?: string | null;
  status: "none" | "pending" | "reviewed";
}

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  status?: "active" | "blocked";
  blockedAt?: string | null;
  blockReason?: string;
  appealMessage?: AppealMessage;
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

interface ConfirmActionState {
  type: "block" | "unblock" | "delete";
  user: UserRecord;
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

  // Governance Confirmation Modal State
  const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(null);
  const [blockReasonInput, setBlockReasonInput] = useState("");
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      params.set("t", Date.now().toString());

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      });
      if (!res.ok) throw new Error("Failed to load user records from database");
      const data = await res.json();

      if (data.success) {
        setUsers(data.users || []);
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      } else {
        throw new Error(data.error || "Failed to load directory");
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

  // Execute Block / Unblock / Delete Actions
  const handleExecuteAction = async () => {
    if (!confirmAction) return;

    const { type, user } = confirmAction;
    setIsProcessingAction(true);

    try {
      if (type === "block" || type === "unblock") {
        const payload = {
          userId: user._id,
          action: type,
          reason:
            type === "block"
              ? blockReasonInput.trim() ||
                "Administrative review and portfolio verification in progress."
              : undefined,
        };

        const res = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || `Failed to update status in MongoDB`);
        }

        const updatedServerUser = data.user;
        const newStatus = updatedServerUser?.status || (type === "block" ? "blocked" : "active");
        const newReason =
          updatedServerUser?.blockReason ||
          (type === "block"
            ? blockReasonInput.trim() ||
              "Administrative review and portfolio verification in progress."
            : "");
        const newBlockedAt =
          updatedServerUser?.blockedAt || (type === "block" ? new Date().toISOString() : null);
        const newAppeal =
          updatedServerUser?.appealMessage ||
          (type === "unblock" && user.appealMessage
            ? { ...user.appealMessage, status: "reviewed" }
            : user.appealMessage);

        // Update local state ONLY after MongoDB confirms write success
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id
              ? {
                  ...u,
                  status: newStatus,
                  blockReason: newReason,
                  blockedAt: newBlockedAt,
                  appealMessage: newAppeal,
                }
              : u
          )
        );

        if (dossierUser && dossierUser._id === user._id) {
          setDossierUser((prev) =>
            prev
              ? {
                  ...prev,
                  status: newStatus,
                  blockReason: newReason,
                  blockedAt: newBlockedAt,
                  appealMessage: newAppeal,
                }
              : null
          );
        }

        showToast(
          type === "block"
            ? `Collector ${user.name} privileges suspended (Persisted in MongoDB).`
            : `Collector ${user.name} privileges reinstated (Persisted in MongoDB).`
        );

        // Immediate database synchronization
        fetchUsers();
      } else if (type === "delete") {
        const res = await fetch(`/api/admin/users?id=${user._id}`, {
          method: "DELETE",
          headers: { "Cache-Control": "no-cache" },
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to delete collector record");
        }

        // Immediate removal from table state
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        setMetrics((prev) => ({
          ...prev,
          totalUsers: Math.max(0, prev.totalUsers - 1),
          customerCount: Math.max(0, prev.customerCount - 1),
        }));

        if (dossierUser && dossierUser._id === user._id) {
          setDossierUser(null);
        }

        showToast(`Collector ${user.name} permanently deleted from vault.`);
        fetchUsers();
      }

      setConfirmAction(null);
      setBlockReasonInput("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Action failed";
      // Luxury bronze banner / notice on error, leaving table state completely unchanged
      showToast(`Failed to update status in MongoDB: ${msg}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const totalOrdersAcrossCollectors = users.reduce(
    (acc, u) => acc + (u.ordersCount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert (Strict Zero Red Policy: #2C241E / #FAF6F0 / #9D7E50) */}
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
            Live governance, collector status management, and vault order oversight.
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
            <div className="font-['Times_New_Roman',serif] text-[28px] font-semibold text-[#2C241E] mt-1">
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
            <div className="font-['Times_New_Roman',serif] text-[28px] font-semibold text-[#2C241E] mt-1">
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
            <div className="font-['Times_New_Roman',serif] text-[28px] font-semibold text-[#2C241E] mt-1">
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
                  <th className="py-3.5 px-4 font-semibold">Status</th>
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

                  const isBlocked = u.status === "blocked";
                  const hasPendingAppeal = u.appealMessage?.status === "pending";

                  return (
                    <tr
                      key={u._id}
                      onClick={() => setDossierUser(u)}
                      className={`hover:bg-white/50 transition-colors duration-150 cursor-pointer ${
                        isBlocked ? "bg-[#2C241E]/5" : ""
                      }`}
                    >
                      {/* Collector Profile: Name + Email */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-none border text-xs font-medium flex items-center justify-center shrink-0 ${
                              isBlocked
                                ? "bg-[#2C241E] border-[#2C241E] text-[#FAF6F0]"
                                : "bg-[#DECFC0] border-[#DFCFC0] text-[#5C4529]"
                            }`}
                          >
                            {initials || "U"}
                          </div>
                          <div>
                            <span className="font-semibold text-[#2C241E] block text-sm">
                              {u.name}
                            </span>
                            <span className="text-xs text-[#7A6C5E] block mt-0.5 font-sans">
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isBlocked ? (
                            <span className="px-2.5 py-1 text-[10px] tracking-wider uppercase font-semibold bg-[#2C241E] text-[#FAF6F0] border border-[#2C241E] rounded-none">
                              Suspended
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 text-[10px] tracking-wider uppercase font-semibold bg-[#5C4529]/10 text-[#5C4529] border border-[#5C4529]/30 rounded-none">
                              Active
                            </span>
                          )}
                          {hasPendingAppeal && (
                            <span className="px-2 py-0.5 text-[9px] tracking-wider uppercase font-semibold bg-[#9D7E50] text-[#FAF6F0] rounded-none animate-pulse">
                              Appeal
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Contact Phone (Times New Roman Numerics) */}
                      <td className="py-4 px-4 text-[#2C241E] font-medium font-['Times_New_Roman',serif] text-sm">
                        {displayPhone ? (
                          displayPhone
                        ) : (
                          <span className="text-[#A89887] font-normal font-sans text-xs">—</span>
                        )}
                      </td>

                      {/* Saved Addresses Count */}
                      <td className="py-4 px-4 text-[#5C4F42]">
                        <span className="inline-flex items-center gap-1.5 font-['Times_New_Roman',serif] text-sm">
                          <MapPin size={13} className="text-[#8C7A6B]" />
                          <span>{u.addresses?.length || 0}</span>
                        </span>
                      </td>

                      {/* Total Orders Placed */}
                      <td className="py-4 px-4 text-[#5C4F42]">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[#2C241E] font-['Times_New_Roman',serif] text-sm">
                          <ShoppingBag size={13} className="text-[#8C7A6B]" />
                          <span>{u.ordersCount || 0}</span>
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 text-[#7A6C5E] text-xs whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 font-['Times_New_Roman',serif]">
                          <Clock size={12} className="text-[#8C7A6B]" />
                          {new Date(u.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* 3 Sharp Action Buttons: Dossier, Block/Unblock, Delete */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* 1. Dossier */}
                          <button
                            type="button"
                            onClick={() => setDossierUser(u)}
                            className="px-2.5 py-1.5 bg-white/70 hover:bg-white border border-[#DFCFC0] hover:border-[#5C4529] rounded-none text-xs font-semibold text-[#2C241E] transition-all cursor-pointer flex items-center gap-1"
                            title="Open Collector Dossier"
                          >
                            <FileText size={13} />
                            <span>Dossier</span>
                          </button>

                          {/* 2. Block / Unblock Toggle */}
                          {isBlocked ? (
                            <button
                              type="button"
                              onClick={() => setConfirmAction({ type: "unblock", user: u })}
                              className="px-2.5 py-1.5 bg-[#9D7E50]/15 hover:bg-[#9D7E50] text-[#9D7E50] hover:text-[#FAF6F0] border border-[#9D7E50]/40 rounded-none text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                              title="Reinstate Collector Privileges"
                            >
                              <ShieldCheck size={13} />
                              <span>Unblock</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setBlockReasonInput("");
                                setConfirmAction({ type: "block", user: u });
                              }}
                              className="px-2.5 py-1.5 bg-[#5C4529]/10 hover:bg-[#2C241E] text-[#5C4529] hover:text-[#FAF6F0] border border-[#5C4529]/30 rounded-none text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                              title="Suspend Collector Privileges"
                            >
                              <ShieldAlert size={13} />
                              <span>Block</span>
                            </button>
                          )}

                          {/* 3. Delete */}
                          <button
                            type="button"
                            onClick={() => setConfirmAction({ type: "delete", user: u })}
                            className="p-1.5 bg-white/70 hover:bg-[#2C241E] text-[#7A6C5E] hover:text-[#FAF6F0] border border-[#DFCFC0] hover:border-[#2C241E] rounded-none transition-all cursor-pointer"
                            title="Permanently Delete Collector"
                          >
                            <Trash2 size={13} />
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

      {/* 4. Frosted Glass Action Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FAF6F0] border border-[#DFCFC0] rounded-none max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-none flex items-center justify-center shrink-0 ${
                  confirmAction.type === "delete"
                    ? "bg-[#2C241E] text-[#FAF6F0]"
                    : confirmAction.type === "block"
                    ? "bg-[#5C4529] text-[#FAF6F0]"
                    : "bg-[#9D7E50] text-[#FAF6F0]"
                }`}
              >
                {confirmAction.type === "delete" ? (
                  <AlertTriangle size={20} />
                ) : confirmAction.type === "block" ? (
                  <ShieldAlert size={20} />
                ) : (
                  <ShieldCheck size={20} />
                )}
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#2C241E]">
                  {confirmAction.type === "delete"
                    ? "Purge Collector Record"
                    : confirmAction.type === "block"
                    ? "Suspend Vault Privileges"
                    : "Reinstate Vault Privileges"}
                </h3>
                <p className="text-xs text-[#7A6C5E] mt-0.5">
                  Target: <span className="font-semibold text-[#2C241E]">{confirmAction.user.name}</span> ({confirmAction.user.email})
                </p>
              </div>
            </div>

            {confirmAction.type === "delete" && (
              <p className="text-xs text-[#5C4F42] leading-relaxed bg-[#EFE8DD]/70 border border-[#DFCFC0] p-3 rounded-none">
                Are you sure you wish to permanently delete this collector record? This action cannot be undone and will purge all saved destinations.
              </p>
            )}

            {confirmAction.type === "block" && (
              <div className="space-y-3">
                <p className="text-xs text-[#5C4F42] leading-relaxed">
                  Suspending this collector account will immediately revoke access to private checkout, vault ledgers, and profile modifications.
                </p>
                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#7A6E63] mb-1.5">
                    Suspension Reason (Visible to Concierge & Patron)
                  </label>
                  <input
                    type="text"
                    value={blockReasonInput}
                    onChange={(e) => setBlockReasonInput(e.target.value)}
                    placeholder="e.g. Identity verification pending or policy inquiry"
                    className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-3.5 py-2.5 text-xs outline-none focus:border-[#5C4529]"
                  />
                </div>
              </div>
            )}

            {confirmAction.type === "unblock" && (
              <p className="text-xs text-[#5C4F42] leading-relaxed bg-[#EFE8DD]/70 border border-[#DFCFC0] p-3 rounded-none">
                Reinstating this collector will restore full vault privileges, enabling timepiece reservations, order tracking, and profile updates.
              </p>
            )}

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#DFCFC0]">
              <button
                type="button"
                disabled={isProcessingAction}
                onClick={() => {
                  setConfirmAction(null);
                  setBlockReasonInput("");
                }}
                className="px-4 py-2 bg-white hover:bg-[#EFE8DD] border border-[#DFCFC0] rounded-none text-xs font-semibold text-[#2C241E] transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingAction}
                onClick={handleExecuteAction}
                className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] rounded-none transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 ${
                  confirmAction.type === "delete"
                    ? "bg-[#2C241E] hover:bg-black"
                    : confirmAction.type === "block"
                    ? "bg-[#5C4529] hover:bg-[#47341D]"
                    : "bg-[#5C4529] hover:bg-[#47341D]"
                }`}
              >
                {isProcessingAction && <Loader2 size={13} className="animate-spin" />}
                <span>
                  {confirmAction.type === "delete"
                    ? "Permanently Delete"
                    : confirmAction.type === "block"
                    ? "Confirm Suspension"
                    : "Confirm Reinstatement"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Collector Dossier Modal */}
      {dossierUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] border border-[#DFCFC0] rounded-none w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#DFCFC0] pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] tracking-[0.2em] font-semibold text-[#8C7A6B] uppercase">
                    Collector Dossier
                  </span>
                  {dossierUser.status === "blocked" ? (
                    <span className="px-2 py-0.5 text-[9px] tracking-wider uppercase font-semibold bg-[#2C241E] text-[#FAF6F0] rounded-none">
                      Suspended / Blocked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[9px] tracking-wider uppercase font-semibold bg-[#5C4529]/15 text-[#5C4529] rounded-none">
                      Active
                    </span>
                  )}
                </div>
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

            {/* Block Reason Warning if Suspended */}
            {dossierUser.status === "blocked" && (
              <div className="mb-5 p-3.5 bg-[#2C241E]/5 border border-[#2C241E]/20 rounded-none text-xs">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#2C241E] block mb-1">
                  Active Suspension Order
                </span>
                <p className="text-[#5C4F42] leading-relaxed">
                  {dossierUser.blockReason || "Vault privileges suspended by administrative decree."}
                </p>
                {dossierUser.blockedAt && (
                  <span className="text-[10px] text-[#8C7A6B] mt-1.5 block font-['Times_New_Roman',serif]">
                    Enacted: {new Date(dossierUser.blockedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            )}

            {/* Collector Appeal Card (if appeal submitted) */}
            {dossierUser.appealMessage?.message ? (
              <div className="mb-5 bg-[#EFE8DD] border border-[#DFCFC0] rounded-none p-4 text-xs font-['Times_New_Roman',serif]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-[#5C4529] font-medium font-sans">
                    <MessageSquare size={14} />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">
                      Collector Privilege Appeal
                    </span>
                  </div>
                  <span
                    className={`text-[9px] uppercase tracking-wider font-sans font-semibold px-2 py-0.5 rounded-none ${
                      dossierUser.appealMessage.status === "pending"
                        ? "bg-[#9D7E50] text-[#FAF6F0] animate-pulse"
                        : "bg-[#2C241E] text-[#FAF6F0]"
                    }`}
                  >
                    {dossierUser.appealMessage.status === "pending" ? "Pending Review" : "Reviewed"}
                  </span>
                </div>
                <blockquote className="italic text-[#2C241E] text-sm my-2 pl-3 border-l-2 border-[#5C4529] leading-relaxed">
                  &ldquo;{dossierUser.appealMessage.message}&rdquo;
                </blockquote>
                {dossierUser.appealMessage.submittedAt && (
                  <p className="text-[11px] text-[#7A6C5E] mt-2 font-['Times_New_Roman',serif]">
                    Submitted: {new Date(dossierUser.appealMessage.submittedAt).toLocaleString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
                {dossierUser.status === "blocked" && (
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmAction({ type: "unblock", user: dossierUser });
                    }}
                    className="mt-3 w-full bg-[#5C4529] hover:bg-[#47341D] text-[#FAF6F0] py-2 px-3 text-xs uppercase tracking-wider font-semibold font-sans rounded-none transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck size={14} />
                    <span>Reinstate Vault Access (Unblock)</span>
                  </button>
                )}
              </div>
            ) : null}

            {/* Profile Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/60 p-4 rounded-none border border-[#DFCFC0] mb-5 text-xs">
              <div>
                <span className="text-[#8C7A6B] block uppercase text-[10px] tracking-wider mb-1">
                  Primary Phone
                </span>
                <span className="font-['Times_New_Roman',serif] text-sm font-semibold text-[#2C241E]">
                  {dossierUser.phone ||
                    dossierUser.addresses?.find((a) => a.phone)?.phone ||
                    dossierUser.addresses?.[0]?.phone ||
                    "—"}
                </span>
              </div>
              <div>
                <span className="text-[#8C7A6B] block uppercase text-[10px] tracking-wider mb-1">
                  Saved Destinations
                </span>
                <span className="font-['Times_New_Roman',serif] text-sm font-semibold text-[#2C241E]">
                  {dossierUser.addresses?.length || 0}
                </span>
              </div>
              <div>
                <span className="text-[#8C7A6B] block uppercase text-[10px] tracking-wider mb-1">
                  Orders Placed
                </span>
                <span className="font-['Times_New_Roman',serif] text-sm font-semibold text-[#2C241E]">
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
                        <span className="font-['Times_New_Roman',serif]">{addr.postalCode}</span>, {addr.country}
                      </p>
                      <p className="text-[#7A6C5E] mt-1 font-sans">
                        Contact Tel: <span className="text-[#2C241E] font-medium font-['Times_New_Roman',serif]">{addr.phone}</span>
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
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#DFCFC0]">
              <div className="flex items-center gap-2">
                {dossierUser.status === "blocked" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmAction({ type: "unblock", user: dossierUser });
                    }}
                    className="px-3 py-1.5 bg-[#9D7E50]/15 hover:bg-[#9D7E50] text-[#9D7E50] hover:text-[#FAF6F0] border border-[#9D7E50]/40 rounded-none text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck size={13} />
                    <span>Unblock Collector</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setBlockReasonInput("");
                      setConfirmAction({ type: "block", user: dossierUser });
                    }}
                    className="px-3 py-1.5 bg-[#5C4529]/10 hover:bg-[#2C241E] text-[#5C4529] hover:text-[#FAF6F0] border border-[#5C4529]/30 rounded-none text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldAlert size={13} />
                    <span>Block Collector</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setConfirmAction({ type: "delete", user: dossierUser });
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-[#2C241E] text-[#7A6C5E] hover:text-[#FAF6F0] border border-[#DFCFC0] hover:border-[#2C241E] rounded-none text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>

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
