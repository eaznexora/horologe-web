"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronDown,
  RotateCcw,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  X,
  Layers,
  FolderTree,
  Eye,
  EyeOff,
} from "lucide-react";

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  parentId: string;
  rank: number;
  isTopCategory?: boolean;
  status: "active" | "inactive";
  createdAt: string;
}

interface CategoryParent {
  _id: string;
  name: string;
  slug: string;
  parentId: string | null;
  rank: number;
  isTopCategory?: boolean;
  status: "active" | "inactive";
  createdAt: string;
  subcategories: SubCategory[];
}

interface WatchCategoryItem {
  _id: string;
  name: string;
  slug: string;
  rank: number;
  status: "active" | "inactive";
  createdAt: string;
}

function RankInput({
  initialRank,
  onCommit,
  className = "",
}: {
  initialRank: number;
  onCommit: (newRank: number) => void;
  className?: string;
}) {
  const [val, setVal] = useState<string>(String(initialRank ?? 0));

  useEffect(() => {
    setVal(String(initialRank ?? 0));
  }, [initialRank]);

  const handleBlur = () => {
    const trimmed = val.trim();
    const parsed =
      trimmed === "" || isNaN(Number(trimmed))
        ? 0
        : Math.max(0, parseInt(trimmed, 10));
    setVal(String(parsed));
    if (parsed !== initialRank) {
      onCommit(parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <input
      type="number"
      min={0}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
    />
  );
}

export default function AdminCategoriesPage() {
  // Navigation Tab: "all" (Storefront Mega-Menu) vs "watch" (Catalog Filter Tabs)
  const [activeTab, setActiveTab] = useState<"all" | "watch">("all");

  // State for All Categories (Mega-Menu)
  const [categories, setCategories] = useState<CategoryParent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // State for Watch Categories (Filter Tabs)
  const [watchCategories, setWatchCategories] = useState<WatchCategoryItem[]>([]);
  const [isWatchLoading, setIsWatchLoading] = useState(false);
  const [selectedWatchIds, setSelectedWatchIds] = useState<string[]>([]);

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rank");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add / Edit Modal State for Mega-Menu Categories
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    parentId: string;
    rank: number;
  } | null>(null);

  const [modalForm, setModalForm] = useState<{
    name: string;
    parentId: string;
    rank: number | string;
  }>({
    name: "",
    parentId: "",
    rank: 1,
  });

  // Add / Edit Modal State for Watch Categories
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
  const [editingWatchCategory, setEditingWatchCategory] = useState<WatchCategoryItem | null>(null);
  const [watchModalForm, setWatchModalForm] = useState<{
    name: string;
    rank: number | string;
  }>({
    name: "",
    rank: 1,
  });

  // Custom Luxury Frosted-Glass Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
    isSub?: boolean;
    parentId?: string;
    isBulk?: boolean;
    count?: number;
    isWatchCategory?: boolean;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Fetch hierarchical categories
  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/categories?admin=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
        if (expandedIds.length === 0 && data.categories.length > 0) {
          setExpandedIds([data.categories[0]._id]);
        }
      }
    } catch {
      showToast("Could not load categories from database");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch watch categories
  const loadWatchCategories = async () => {
    try {
      setIsWatchLoading(true);
      const res = await fetch("/api/admin/watch-categories?admin=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setWatchCategories(data.categories);
      }
    } catch {
      showToast("Could not load watch categories from database");
    } finally {
      setIsWatchLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadWatchCategories();
  }, []);

  // --- MEGA-MENU CATEGORIES ACTIONS ---
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRankChange = async (id: string, newRank: number, isSub = false, parentId?: string) => {
    if (isSub && parentId) {
      setCategories((prev) =>
        prev.map((parent) => {
          if (parent._id !== parentId) return parent;
          return {
            ...parent,
            subcategories: (parent.subcategories || []).map((s) =>
              s._id === id ? { ...s, rank: newRank } : s
            ),
          };
        })
      );
    } else {
      setCategories((prev) =>
        prev.map((cat) => (cat._id === id ? { ...cat, rank: newRank } : cat))
      );
    }

    try {
      await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, rank: newRank }),
      });
      showToast("Rank updated");
    } catch {
      // Ignore
    }
  };

  const toggleCategoryStatus = async (
    id: string,
    currentStatus: "active" | "inactive",
    isSub = false,
    parentId?: string
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    if (isSub && parentId) {
      setCategories((prev) =>
        prev.map((p) => {
          if (p._id !== parentId) return p;
          return {
            ...p,
            subcategories: (p.subcategories || []).map((s) =>
              s._id === id ? { ...s, status: newStatus } : s
            ),
          };
        })
      );
    } else {
      setCategories((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
    }

    showToast(`Visibility set to ${newStatus}`);

    try {
      await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch {
      loadCategories();
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === categories.length && categories.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map((c) => c._id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // --- WATCH CATEGORIES ACTIONS ---
  const handleWatchRankChange = async (id: string, newRank: number) => {
    setWatchCategories((prev) =>
      prev.map((c) => (c._id === id ? { ...c, rank: newRank } : c))
    );
    try {
      await fetch("/api/admin/watch-categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, rank: newRank }),
      });
      showToast("Watch category rank updated");
    } catch {
      loadWatchCategories();
    }
  };

  const toggleWatchStatus = async (id: string, currentStatus: "active" | "inactive") => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setWatchCategories((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
    );
    showToast(`Watch category set to ${newStatus}`);
    try {
      await fetch("/api/admin/watch-categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch {
      loadWatchCategories();
    }
  };

  const handleSelectAllWatch = () => {
    if (selectedWatchIds.length === filteredWatchCategories.length && filteredWatchCategories.length > 0) {
      setSelectedWatchIds([]);
    } else {
      setSelectedWatchIds(filteredWatchCategories.map((c) => c._id));
    }
  };

  const toggleSelectWatchRow = (id: string) => {
    setSelectedWatchIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getWatchProductCount = (name: string, slug: string) => {
    const n = name.toLowerCase();
    const s = slug.toLowerCase();
    if (n.includes("rolex") || s.includes("rolex")) return 3;
    if (n.includes("omega") || s.includes("omega")) return 3;
    if (n.includes("casio") || s.includes("casio")) return 3;
    if (n.includes("nexora") || s.includes("nexora")) return 3;
    if (n.includes("patek") || s.includes("patek")) return 2;
    if (n.includes("audemars") || s.includes("ap")) return 2;
    return 1;
  };

  // --- MODAL OPENERS ---
  const openAddModal = () => {
    setEditingCategory(null);
    setModalForm({
      name: "",
      parentId: "",
      rank: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const openAddModalWithParent = (parentId: string, parentName: string) => {
    setEditingCategory(null);
    const parent = categories.find((c) => c._id === parentId);
    setModalForm({
      name: "",
      parentId: parentId,
      rank: (parent?.subcategories?.length || 0) + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryParent | SubCategory, isParent: boolean) => {
    setEditingCategory({
      id: cat._id,
      name: cat.name,
      parentId: isParent ? "" : cat.parentId || "",
      rank: cat.rank ?? 0,
    });
    setModalForm({
      name: cat.name,
      parentId: isParent ? "" : cat.parentId || "",
      rank: cat.rank ?? 0,
    });
    setIsModalOpen(true);
  };

  const openAddWatchModal = () => {
    setEditingWatchCategory(null);
    setWatchModalForm({
      name: "",
      rank: watchCategories.length + 1,
    });
    setIsWatchModalOpen(true);
  };

  const openEditWatchModal = (cat: WatchCategoryItem) => {
    setEditingWatchCategory(cat);
    setWatchModalForm({
      name: cat.name,
      rank: cat.rank ?? 0,
    });
    setIsWatchModalOpen(true);
  };

  // Modal Submissions
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.name.trim()) {
      showToast("Category name is required");
      return;
    }

    const rankVal =
      String(modalForm.rank).trim() === "" || isNaN(Number(modalForm.rank))
        ? 0
        : Math.max(0, parseInt(String(modalForm.rank), 10));

    try {
      if (editingCategory) {
        const res = await fetch("/api/admin/categories", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCategory.id,
            name: modalForm.name.trim(),
            rank: rankVal,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Updated "${modalForm.name}"`);
          setIsModalOpen(false);
          loadCategories();
        }
      } else {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: modalForm.name.trim(),
            parentId: modalForm.parentId || null,
            rank: rankVal,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Created category "${modalForm.name}"`);
          setIsModalOpen(false);
          loadCategories();
        }
      }
    } catch {
      showToast("Error saving category");
    }
  };

  const handleWatchModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!watchModalForm.name.trim()) {
      showToast("Category name is required");
      return;
    }

    const rankVal =
      String(watchModalForm.rank).trim() === "" || isNaN(Number(watchModalForm.rank))
        ? 0
        : Math.max(0, parseInt(String(watchModalForm.rank), 10));

    try {
      if (editingWatchCategory) {
        const res = await fetch("/api/admin/watch-categories", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingWatchCategory._id,
            name: watchModalForm.name.trim(),
            rank: rankVal,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Updated watch category "${watchModalForm.name}"`);
          setIsWatchModalOpen(false);
          loadWatchCategories();
        }
      } else {
        const res = await fetch("/api/admin/watch-categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: watchModalForm.name.trim(),
            rank: rankVal,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Created watch category "${watchModalForm.name}"`);
          setIsWatchModalOpen(false);
          loadWatchCategories();
        }
      }
    } catch {
      showToast("Error saving watch category");
    }
  };

  // --- DELETE CONFIRMATION MODALS ---
  const requestDelete = (id: string, name: string, isSub?: boolean, parentId?: string) => {
    setDeleteTarget({ id, name, isSub, parentId, isWatchCategory: false });
  };

  const requestBulkDelete = () => {
    if (selectedIds.length === 0) {
      showToast("Select at least one category to delete");
      return;
    }
    setDeleteTarget({
      id: "bulk",
      name: `${selectedIds.length} selected categories`,
      isBulk: true,
      count: selectedIds.length,
      isWatchCategory: false,
    });
  };

  const requestDeleteWatch = (id: string, name: string) => {
    setDeleteTarget({ id, name, isWatchCategory: true });
  };

  const requestBulkDeleteWatch = () => {
    if (selectedWatchIds.length === 0) {
      showToast("Select at least one watch category to delete");
      return;
    }
    setDeleteTarget({
      id: "bulk-watch",
      name: `${selectedWatchIds.length} selected watch categories`,
      isBulk: true,
      count: selectedWatchIds.length,
      isWatchCategory: true,
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    // Handle Watch Categories Deletion
    if (deleteTarget.isWatchCategory) {
      if (deleteTarget.isBulk) {
        const ids = [...selectedWatchIds];
        setDeleteTarget(null);
        for (const id of ids) {
          try {
            await fetch(`/api/admin/watch-categories?id=${id}`, { method: "DELETE" });
          } catch {
            // Ignore loop errors
          }
        }
        setSelectedWatchIds([]);
        showToast("Bulk deletion completed");
        loadWatchCategories();
        return;
      }

      const { id, name } = deleteTarget;
      setDeleteTarget(null);
      setWatchCategories((prev) => prev.filter((c) => c._id !== id));
      showToast(`Removed "${name}"`);

      try {
        await fetch(`/api/admin/watch-categories?id=${id}`, { method: "DELETE" });
        loadWatchCategories();
      } catch {
        loadWatchCategories();
        showToast("Error deleting watch category");
      }
      return;
    }

    // Handle Mega-Menu Categories Deletion
    if (deleteTarget.isBulk) {
      const idsToDelete = [...selectedIds];
      setDeleteTarget(null);
      for (const id of idsToDelete) {
        try {
          await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
        } catch {
          // Ignore loop errors
        }
      }
      setSelectedIds([]);
      showToast("Bulk deletion completed");
      loadCategories();
      return;
    }

    const { id, name, isSub, parentId } = deleteTarget;
    setDeleteTarget(null);

    if (isSub && parentId) {
      setCategories((prev) =>
        prev.map((parent) => {
          if (parent._id !== parentId) return parent;
          return {
            ...parent,
            subcategories: (parent.subcategories || []).filter((s) => s._id !== id),
          };
        })
      );
    } else {
      setCategories((prev) => prev.filter((c) => c._id !== id));
    }
    showToast(`Removed "${name}"`);

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        loadCategories();
        showToast(data.error || "Failed to delete");
      }
    } catch {
      loadCategories();
      showToast("Error deleting category");
    }
  };

  // Filtered & Sorted Lists
  const filteredCategories = categories
    .filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.subcategories?.some((s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (statusFilter === "active") return matchesSearch && cat.status === "active";
      if (statusFilter === "inactive") return matchesSearch && cat.status === "inactive";
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "rank") return a.rank - b.rank;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const filteredWatchCategories = watchCategories
    .filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase());

      if (statusFilter === "active") return matchesSearch && cat.status === "active";
      if (statusFilter === "inactive") return matchesSearch && cat.status === "inactive";
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "rank") return a.rank - b.rank;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  // Metrics
  const totalCategories = categories.length;
  const allSubcategories = categories.flatMap((c) => c.subcategories || []);
  const totalSubCategories = allSubcategories.length;
  const activeCategories = categories.filter((c) => c.status === "active").length;
  const activeSubCategories = allSubcategories.filter((s) => s.status === "active").length;

  const totalWatchCategories = watchCategories.length;
  const activeWatchCategories = watchCategories.filter((c) => c.status === "active").length;
  const inactiveWatchCategories = watchCategories.filter((c) => c.status === "inactive").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#2C241E] text-[#FAF6F0] px-4 py-2.5 rounded-xl shadow-xl border border-[#D4C6B3]/60 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={15} className="text-[#3B71CA]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Bar */}
      <div className="flex items-center mb-6">
        <Link
          href="/admin"
          className="w-9 h-9 bg-white/45 backdrop-blur-md border border-white/60 rounded-xl flex items-center justify-center text-[#2C241E] hover:bg-white/70 transition-all shadow-sm cursor-pointer"
          aria-label="Back to Dashboard"
        >
          <ChevronLeft size={18} />
        </Link>
        <h1 className="font-serif text-[24px] lg:text-[28px] font-medium text-[#2C241E] ml-3 tracking-tight">
          Categories
        </h1>
      </div>

      {/* 2. Metric Summary Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {activeTab === "all" ? (
          <>
            <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#7A6C5E] font-medium mb-1 block">
                Total Categories
              </span>
              <div className="font-serif text-[28px] font-semibold text-[#2C241E] leading-tight">
                {totalCategories}
              </div>
            </div>

            <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#7A6C5E] font-medium mb-1 block">
                Total Sub-Categories
              </span>
              <div className="font-serif text-[28px] font-semibold text-[#2C241E] leading-tight">
                {totalSubCategories}
              </div>
            </div>

            <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#7A6C5E] font-medium mb-1 block">
                Active Categories
              </span>
              <div className="font-serif text-[28px] font-semibold text-[#2C241E] leading-tight">
                {activeCategories}
              </div>
            </div>

            <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#7A6C5E] font-medium mb-1 block">
                Active Sub-Categories
              </span>
              <div className="font-serif text-[28px] font-semibold text-[#2C241E] leading-tight">
                {activeSubCategories}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#7A6C5E] font-medium mb-1 block">
                Total Products
              </span>
              <div className="font-serif text-[28px] font-semibold text-[#2C241E] leading-tight">
                1380
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#7A6C5E] font-medium mb-1 block">
                Watch Categories
              </span>
              <div className="font-serif text-[28px] font-semibold text-[#2C241E] leading-tight">
                {totalWatchCategories}
              </div>
            </div>

            <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#7A6C5E] font-medium mb-1 block">
                Active Filters
              </span>
              <div className="font-serif text-[28px] font-semibold text-[#2C241E] leading-tight">
                {activeWatchCategories}
              </div>
            </div>

            <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#7A6C5E] font-medium mb-1 block">
                Hidden Filters
              </span>
              <div className="font-serif text-[28px] font-semibold text-[#2C241E] leading-tight">
                {inactiveWatchCategories}
              </div>
            </div>

            <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#7A6C5E] font-medium mb-1 block">
                Catalog Filter Pills
              </span>
              <div className="font-serif text-[28px] font-semibold text-[#2C241E] leading-tight">
                {activeWatchCategories + 1}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#7A6C5E] font-medium mb-1 block">
                Total Products
              </span>
              <div className="font-serif text-[28px] font-semibold text-[#2C241E] leading-tight">
                1380
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. Search & Filter Panel */}
      <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          {/* Search */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] uppercase tracking-[0.14em] text-[#7A6C5E] font-medium block">
                {activeTab === "all" ? "Search Categories" : "Search Watch Categories"}
              </label>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[#8C7A6B] hover:text-[#2C241E] transition-colors p-0.5 cursor-pointer"
                title="Reset search"
              >
                <RotateCcw size={13} />
              </button>
            </div>
            <input
              type="text"
              placeholder={activeTab === "all" ? "Enter Category Name" : "Search ROLEX, OMEGA..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs transition-colors"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-[11px] uppercase tracking-[0.14em] text-[#7A6C5E] font-medium mb-1.5 block">
              Visibility Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-8 shadow-xs focus:border-[#5C4529]/60 transition-colors"
              >
                <option value="all">All Visibility Status ⌵</option>
                <option value="active">Active (Visible in Storefront)</option>
                <option value="inactive">Inactive (Hidden from Storefront)</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[11px] uppercase tracking-[0.14em] text-[#7A6C5E] font-medium mb-1.5 block">
              Sort By
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-8 shadow-xs focus:border-[#5C4529]/60 transition-colors"
              >
                <option value="rank">Display Rank (0, 1, 2...) ⌵</option>
                <option value="name">Alphabetical</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Top Glass Navigation Tabs Directly Above Table */}
      <div className="flex items-center gap-6 sm:gap-8 border-b border-[#D4C6B3]/60 px-2 pt-1">
        <button
          type="button"
          onClick={() => {
            setActiveTab("all");
            setSelectedIds([]);
          }}
          className={
            activeTab === "all"
              ? "border-b-2 border-[#2C241E] text-[#2C241E] font-medium text-sm pb-2.5 cursor-pointer transition-all flex items-center gap-2"
              : "text-[#8C7A6B] hover:text-[#2C241E] text-sm pb-2.5 cursor-pointer transition-all flex items-center gap-2"
          }
        >
          <Layers size={16} />
          <span>All Categories (Storefront Mega-Menu)</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("watch");
            setSelectedWatchIds([]);
          }}
          className={
            activeTab === "watch"
              ? "border-b-2 border-[#2C241E] text-[#2C241E] font-medium text-sm pb-2.5 cursor-pointer transition-all flex items-center gap-2"
              : "text-[#8C7A6B] hover:text-[#2C241E] text-sm pb-2.5 cursor-pointer transition-all flex items-center gap-2"
          }
        >
          <FolderTree size={16} />
          <span>Watch Categories (Catalog Filter Tabs)</span>
        </button>
      </div>

      {/* 5. Full-Width Action CTA */}
      {activeTab === "all" ? (
        <button
          type="button"
          onClick={openAddModal}
          className="w-full bg-[#5C4529] hover:bg-[#47341D] text-white text-xs sm:text-sm font-semibold tracking-wide py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>+ Add a new Category</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={openAddWatchModal}
          className="w-full bg-[#5C4529] hover:bg-[#47341D] text-white text-xs sm:text-sm font-semibold tracking-wide py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>+ Add Watch Category</span>
        </button>
      )}

      {/* 6. Categories Table Section */}
      <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
        {activeTab === "all" ? (
          /* TAB 1: Hierarchical Mega-Menu Categories Table */
          <>
            {/* Section Toolbar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#D4C6B3]/60">
              <div className="inline-block border-b-2 border-[#2C241E] pb-2">
                <span className="text-sm font-semibold text-[#2C241E]">
                  All Categories
                </span>
              </div>
              <button
                type="button"
                onClick={requestBulkDelete}
                className="text-xs text-[#8C7A6B] hover:text-[#5C4529] transition-colors cursor-pointer font-medium"
              >
                Bulk Actions: Delete ({selectedIds.length})
              </button>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.16em] text-[#786B5D] border-b border-[#D4C6B3]/60">
                    <th className="py-3 pl-1 pr-3 w-8">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === categories.length &&
                          categories.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 accent-[#5C4529] cursor-pointer"
                        aria-label="Select all categories"
                      />
                    </th>
                    <th className="py-3 px-3 font-semibold text-center w-16">Rank</th>
                    <th className="py-3 px-4 font-semibold">Category Name</th>
                    <th className="py-3 px-3 font-semibold text-center">Placement</th>
                    <th className="py-3 px-3 font-semibold text-center">
                      Subcategories
                    </th>
                    <th className="py-3 pl-4 pr-1 text-right font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#D4C6B3]/40">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#7A6C5E]">
                        Loading categories from database...
                      </td>
                    </tr>
                  ) : filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#7A6C5E]">
                        No categories found. Click &quot;+ Add a new Category&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((cat) => {
                      const isExpanded = expandedIds.includes(cat._id);
                      const isSelected = selectedIds.includes(cat._id);
                      const subs = cat.subcategories || [];

                      return (
                        <React.Fragment key={cat._id}>
                          {/* Parent Category Row */}
                          <tr
                            className={`hover:bg-white/40 transition-colors group ${
                              isSelected ? "bg-white/30" : ""
                            } ${cat.status === "inactive" ? "opacity-60" : ""}`}
                          >
                            <td className="py-3.5 pl-1 pr-3">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(cat._id)}
                                  className="p-1 hover:bg-white/60 rounded text-[#7A6C5E] hover:text-[#2C241E] transition-colors cursor-pointer"
                                  aria-label={
                                    isExpanded
                                      ? "Collapse subcategories"
                                      : "Expand subcategories"
                                  }
                                >
                                  <ChevronDown
                                    size={15}
                                    className={`transition-transform duration-200 ${
                                      isExpanded ? "rotate-180 text-[#5C4529]" : ""
                                    }`}
                                  />
                                </button>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectRow(cat._id)}
                                  className="w-4 h-4 rounded border-gray-300 accent-[#5C4529] cursor-pointer"
                                  aria-label={`Select ${cat.name}`}
                                />
                              </div>
                            </td>

                            <td className="py-3.5 px-3 text-center">
                              <RankInput
                                initialRank={cat.rank}
                                onCommit={(newRank) => handleRankChange(cat._id, newRank)}
                                className="w-12 text-center bg-white/60 backdrop-blur-md border border-white/70 rounded-lg py-1 text-xs font-mono text-[#2C241E] focus:outline-none focus:border-[#5C4529]/60 shadow-2xs"
                              />
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-[#2C241E] text-xs">
                                  {cat.name}
                                </span>
                                <span className="text-[10px] text-[#7A6C5E] font-mono bg-white/60 px-1.5 py-0.5 rounded border border-white/70">
                                  /{cat.slug}
                                </span>
                              </div>
                            </td>

                            <td className="py-3.5 px-3 text-center">
                              <span className="text-[11px] font-mono bg-[#EFE7DE] border border-[#D4C6B3]/60 px-2.5 py-0.5 rounded-full text-[#5C4529] font-medium">
                                Left Mega-Menu
                              </span>
                            </td>

                            <td className="py-3.5 px-3 text-center">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/60 border border-white/70 text-[11px] font-mono text-[#7A6C5E]">
                                <span>{subs.length}</span>
                                <span className="text-[10px]">items</span>
                              </span>
                            </td>

                            <td className="py-3.5 pl-4 pr-1 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => toggleCategoryStatus(cat._id, cat.status)}
                                  className="w-7 h-7 rounded-lg border border-white/60 bg-white/50 hover:bg-white text-[#7A6C5E] hover:text-[#5C4529] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                  title={cat.status === "active" ? "Visible in Mega-Menu (Click to Hide)" : "Hidden in Mega-Menu (Click to Show)"}
                                >
                                  {cat.status === "active" ? (
                                    <Eye size={15} className="text-[#5C4529]" />
                                  ) : (
                                    <EyeOff size={15} className="text-[#8C7A6B]" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openEditModal(cat, true)}
                                  className="w-7 h-7 rounded-lg border border-white/60 bg-white/50 hover:bg-white text-[#7A6C5E] hover:text-[#2C241E] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                  title="Edit Category"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => requestDelete(cat._id, cat.name)}
                                  className="w-7 h-7 rounded-lg border border-white/60 bg-white/50 hover:bg-black/5 text-[#8C7A6B] hover:text-[#5C4529] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                  title="Delete Category"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Subcategories (Expanded) */}
                          {isExpanded && (
                            <>
                              {subs.map((sub) => (
                                <tr
                                  key={sub._id}
                                  className={`bg-white/20 hover:bg-white/35 transition-colors ${
                                    sub.status === "inactive" ? "opacity-60" : ""
                                  }`}
                                >
                                  <td className="py-2.5 pl-7 pr-3">
                                    <div className="w-2.5 h-2.5 border-l-2 border-b-2 border-[#5C4529]/40 ml-1 rounded-bl-sm" />
                                  </td>

                                  <td className="py-2.5 px-3 text-center">
                                    <RankInput
                                      initialRank={sub.rank}
                                      onCommit={(newRank) =>
                                        handleRankChange(sub._id, newRank, true, cat._id)
                                      }
                                      className="w-10 text-center bg-white/70 backdrop-blur-md border border-white/70 rounded-md py-0.5 text-[11px] font-mono text-[#2C241E] focus:outline-none focus:border-[#5C4529]/60 shadow-2xs"
                                    />
                                  </td>

                                  <td className="py-2.5 px-4 pl-8">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[#3D332A] text-xs font-normal">
                                        {sub.name}
                                      </span>
                                      <span className="text-[10px] text-[#8C7A6B] font-mono">
                                        /{sub.slug}
                                      </span>
                                    </div>
                                  </td>

                                  <td className="py-2.5 px-3 text-center">
                                    <span className="text-[10px] font-mono text-[#8C7A6B]">
                                      Right Flyout
                                    </span>
                                  </td>

                                  <td className="py-2.5 px-3 text-center">
                                    <span className="text-[10px] text-[#8C7A6B] font-mono">
                                      Leaf item
                                    </span>
                                  </td>

                                  <td className="py-2.5 pl-4 pr-1 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleCategoryStatus(sub._id, sub.status, true, cat._id)
                                        }
                                        className="w-6 h-6 rounded-md border border-white/50 bg-white/40 hover:bg-white text-[#7A6C5E] hover:text-[#5C4529] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                        title={
                                          sub.status === "active"
                                            ? "Visible in Storefront (Click to Hide)"
                                            : "Hidden in Storefront (Click to Show)"
                                        }
                                      >
                                        {sub.status === "active" ? (
                                          <Eye size={13} className="text-[#5C4529]" />
                                        ) : (
                                          <EyeOff size={13} className="text-[#8C7A6B]" />
                                        )}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => openEditModal(sub, false)}
                                        className="w-6 h-6 rounded-md border border-white/50 bg-white/40 hover:bg-white text-[#7A6C5E] hover:text-[#2C241E] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                        title="Edit Subcategory"
                                      >
                                        <Pencil size={12} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => requestDelete(sub._id, sub.name, true, cat._id)}
                                        className="w-6 h-6 rounded-md border border-white/50 bg-white/40 hover:bg-black/5 text-[#8C7A6B] hover:text-[#5C4529] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                        title="Delete Subcategory"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}

                              {/* Inline full-width + Add Subcategory action button */}
                              <tr key={`add-sub-${cat._id}`} className="bg-white/10">
                                <td colSpan={6} className="py-1 px-4 sm:px-6">
                                  <button
                                    type="button"
                                    onClick={() => openAddModalWithParent(cat._id, cat.name)}
                                    className="w-full py-2.5 my-2 border border-dashed border-[#5C4529]/40 hover:border-[#5C4529] bg-white/30 hover:bg-white/60 text-[#5C4529] text-xs font-medium rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>+ Add Subcategory to {cat.name}</span>
                                  </button>
                                </td>
                              </tr>
                            </>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* TAB 2: Watch Categories (Catalog Filter Tabs) Table - Flat structure */
          <>
            {/* Section Toolbar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#D4C6B3]/60">
              <div className="inline-block border-b-2 border-[#2C241E] pb-2">
                <span className="text-sm font-semibold text-[#2C241E]">
                  Watch Categories (Storefront Filter Pills)
                </span>
              </div>
              <button
                type="button"
                onClick={requestBulkDeleteWatch}
                className="text-xs text-[#8C7A6B] hover:text-[#5C4529] transition-colors cursor-pointer font-medium"
              >
                Bulk Actions: Delete ({selectedWatchIds.length})
              </button>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.16em] text-[#786B5D] border-b border-[#D4C6B3]/60">
                    <th className="py-3 pl-2 pr-3 w-8">
                      <input
                        type="checkbox"
                        checked={
                          selectedWatchIds.length === filteredWatchCategories.length &&
                          filteredWatchCategories.length > 0
                        }
                        onChange={handleSelectAllWatch}
                        className="w-4 h-4 rounded border-gray-300 accent-[#5C4529] cursor-pointer"
                        aria-label="Select all watch categories"
                      />
                    </th>
                    <th className="py-3 px-3 font-semibold text-center w-20">Rank</th>
                    <th className="py-3 px-4 font-semibold">Category Name</th>
                    <th className="py-3 px-4 font-semibold text-center">Products Count</th>
                    <th className="py-3 pl-4 pr-2 text-right font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#D4C6B3]/40">
                  {isWatchLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-[#7A6C5E]">
                        Loading watch categories from database...
                      </td>
                    </tr>
                  ) : filteredWatchCategories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-[#7A6C5E]">
                        No watch categories found. Click &quot;+ Add Watch Category&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    filteredWatchCategories.map((cat) => {
                      const isSelected = selectedWatchIds.includes(cat._id);
                      const isInactive = cat.status === "inactive";

                      return (
                        <tr
                          key={cat._id}
                          className={`hover:bg-white/40 transition-colors group ${
                            isSelected ? "bg-white/30" : ""
                          } ${isInactive ? "opacity-60" : ""}`}
                        >
                          <td className="py-3.5 pl-2 pr-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectWatchRow(cat._id)}
                              className="w-4 h-4 rounded border-gray-300 accent-[#5C4529] cursor-pointer"
                              aria-label={`Select ${cat.name}`}
                            />
                          </td>

                          <td className="py-3.5 px-3 text-center">
                            <RankInput
                              initialRank={cat.rank}
                              onCommit={(newRank) => handleWatchRankChange(cat._id, newRank)}
                              className="w-12 text-center bg-white/60 backdrop-blur-md border border-white/70 rounded-lg py-1 text-xs font-mono text-[#2C241E] focus:outline-none focus:border-[#5C4529]/60 shadow-2xs"
                            />
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#2C241E] text-xs uppercase tracking-wider">
                                {cat.name}
                              </span>
                              <span className="text-[10px] text-[#7A6C5E] font-mono bg-white/60 px-1.5 py-0.5 rounded border border-white/70">
                                /{cat.slug}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFE7DE] border border-[#D4C6B3]/60 text-xs font-medium text-[#5C4529]">
                              <span>{getWatchProductCount(cat.name, cat.slug)}</span>
                              <span className="text-[10px] text-[#8C7A6B]">watches</span>
                            </span>
                          </td>

                          <td className="py-3.5 pl-4 pr-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => toggleWatchStatus(cat._id, cat.status)}
                                className="w-7 h-7 rounded-lg border border-white/60 bg-white/50 hover:bg-white text-[#7A6C5E] hover:text-[#5C4529] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                title={
                                  cat.status === "active"
                                    ? "Visible in Collections (Click to Hide)"
                                    : "Hidden in Collections (Click to Show)"
                                }
                              >
                                {cat.status === "active" ? (
                                  <Eye size={15} className="text-[#5C4529]" />
                                ) : (
                                  <EyeOff size={15} className="text-[#8C7A6B]" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditWatchModal(cat)}
                                className="w-7 h-7 rounded-lg border border-white/60 bg-white/50 hover:bg-white text-[#7A6C5E] hover:text-[#2C241E] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                title="Edit Category"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => requestDeleteWatch(cat._id, cat.name)}
                                className="w-7 h-7 rounded-lg border border-white/60 bg-white/50 hover:bg-black/5 text-[#8C7A6B] hover:text-[#5C4529] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                title="Delete Category"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* 7. Interactive Modal (+ Add / Edit Mega-Menu Category) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#2C241E]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-[#F5EDE4]/95 backdrop-blur-2xl border border-white/80 rounded-2xl p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#D4C6B3]/60">
              <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                {editingCategory
                  ? "Edit Category"
                  : modalForm.parentId
                  ? `Add Subcategory to ${categories.find((c) => c._id === modalForm.parentId)?.name || "Parent"}`
                  : "Add a New Category"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#7A6C5E] hover:text-[#2C241E] bg-white/60 rounded-lg border border-white/70 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Category Name <span className="text-[#5C4529]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pre-Owned or Men's Collection"
                  value={modalForm.name}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, name: e.target.value })
                  }
                  required
                  className="w-full bg-white/70 backdrop-blur-md border border-white/70 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Parent Category
                </label>
                <div className="relative">
                  <select
                    value={modalForm.parentId}
                    onChange={(e) => {
                      const val = e.target.value;
                      const nextRank = val
                        ? (categories.find((c) => c._id === val)?.subcategories?.length || 0) + 1
                        : categories.length + 1;
                      setModalForm({
                        ...modalForm,
                        parentId: val,
                        rank: nextRank,
                      });
                    }}
                    disabled={!!editingCategory}
                    className="w-full bg-white/70 backdrop-blur-md border border-white/70 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-8 shadow-xs disabled:opacity-60"
                  >
                    <option value="">None (Top-Level Primary Left Category)</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name} (Parent)
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
                  />
                </div>
                <p className="text-[11px] text-[#7A6C5E] mt-1">
                  Top-level categories appear on the left column of the storefront mega menu. Subcategories appear on the right column when hovered.
                </p>
              </div>

              <div className="pt-1">
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Display Rank (0, 1, 2...)
                </label>
                <input
                  type="number"
                  min={0}
                  value={modalForm.rank}
                  onChange={(e) =>
                    setModalForm({
                      ...modalForm,
                      rank: e.target.value,
                    })
                  }
                  onBlur={() => {
                    const r = String(modalForm.rank).trim();
                    const parsed = r === "" || isNaN(Number(r)) ? 0 : Math.max(0, parseInt(r, 10));
                    setModalForm((prev) => ({ ...prev, rank: parsed }));
                  }}
                  className="w-full bg-white/70 backdrop-blur-md border border-white/70 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] outline-none shadow-xs font-mono"
                />
                <p className="text-[11px] text-[#7A6C5E] mt-1">
                  Controls order of appearance (0 displays first).
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4C6B3]/60 mt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#7A6C5E] hover:text-[#2C241E] bg-white/50 border border-white/70 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#5C4529] hover:bg-[#47341D] rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  {editingCategory
                    ? "Save Changes"
                    : modalForm.parentId
                    ? "Create Subcategory"
                    : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Interactive Modal (+ Add / Edit Watch Category) */}
      {isWatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#2C241E]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsWatchModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-[#F5EDE4]/95 backdrop-blur-2xl border border-white/80 rounded-2xl p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#D4C6B3]/60">
              <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                {editingWatchCategory ? "Edit Watch Category" : "Add Watch Category"}
              </h2>
              <button
                type="button"
                onClick={() => setIsWatchModalOpen(false)}
                className="p-1.5 text-[#7A6C5E] hover:text-[#2C241E] bg-white/60 rounded-lg border border-white/70 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleWatchModalSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Category Name <span className="text-[#5C4529]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rolex, Patek Philippe, Casio"
                  value={watchModalForm.name}
                  onChange={(e) =>
                    setWatchModalForm({ ...watchModalForm, name: e.target.value })
                  }
                  required
                  className="w-full bg-white/70 backdrop-blur-md border border-white/70 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs uppercase font-medium"
                />
                <p className="text-[11px] text-[#7A6C5E] mt-1">
                  Corresponds to the collection filter pills on the Storefront.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Display Rank (0, 1, 2...)
                </label>
                <input
                  type="number"
                  min={0}
                  value={watchModalForm.rank}
                  onChange={(e) =>
                    setWatchModalForm({ ...watchModalForm, rank: e.target.value })
                  }
                  onBlur={() => {
                    const r = String(watchModalForm.rank).trim();
                    const parsed = r === "" || isNaN(Number(r)) ? 0 : Math.max(0, parseInt(r, 10));
                    setWatchModalForm((prev) => ({ ...prev, rank: parsed }));
                  }}
                  className="w-full bg-white/70 backdrop-blur-md border border-white/70 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] outline-none shadow-xs font-mono"
                />
                <p className="text-[11px] text-[#7A6C5E] mt-1">
                  Determines the horizontal order of the filter pills (0 displays first).
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4C6B3]/60 mt-5">
                <button
                  type="button"
                  onClick={() => setIsWatchModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#7A6C5E] hover:text-[#2C241E] bg-white/50 border border-white/70 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#5C4529] hover:bg-[#47341D] rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  {editingWatchCategory ? "Save Changes" : "Create Watch Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Custom Luxury Frosted-Glass Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-[#2C241E]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#EFE7DE]/90 backdrop-blur-2xl border border-white/80 rounded-2xl p-6 max-w-md w-full shadow-[0_20px_60px_rgba(44,36,30,0.18)]">
            <h3 className="font-serif text-lg font-medium text-[#2C241E] mb-2">
              {deleteTarget.isBulk ? "Delete Categories" : "Delete Category"}
            </h3>
            <p className="text-xs text-[#7A6C5E] leading-relaxed mb-6">
              {deleteTarget.isBulk ? (
                <>
                  Are you sure you want to delete <span className="font-semibold text-[#2C241E]">{deleteTarget.count} selected categories</span>? This action cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to delete <span className="font-semibold text-[#2C241E]">&ldquo;{deleteTarget.name}&rdquo;</span>? {!deleteTarget.isSub && !deleteTarget.isWatchCategory && "Any associated subcategories will also be permanently removed."}
                </>
              )}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-medium text-[#7A6C5E] hover:text-[#2C241E] bg-white/40 hover:bg-white/70 border border-white/60 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2 text-xs font-medium text-[#F9F5EF] bg-[#5C4529] hover:bg-[#47341D] rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
