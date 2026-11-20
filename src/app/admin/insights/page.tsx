"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Upload,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  Eye,
  FileText,
  Clock,
  Calendar,
} from "lucide-react";

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  rank: number;
}

interface ArticleItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  author: string;
  pullQuote: string;
  content: string[];
  featured: boolean;
  status: "published" | "draft";
  createdAt: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTodayEditorialDate(): string {
  const d = new Date();
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  ];
  const month = months[d.getMonth()];
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
}

export default function AdminInsightsDeskPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Category Manager State
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [creatingCategory, setCreatingCategory] = useState<boolean>(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  // Article Composer State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState<string>(getTodayEditorialDate());
  const [readTime, setReadTime] = useState<string>("5 MIN READ");
  const [excerpt, setExcerpt] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [author, setAuthor] = useState<string>("Horologe Royale Editorial Desk");
  const [pullQuote, setPullQuote] = useState<string>("");
  const [contentBody, setContentBody] = useState<string>("");
  const [featured, setFeatured] = useState<boolean>(false);
  const [status, setStatus] = useState<"published" | "draft">("published");

  // Media Upload State
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);

  // Load Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/insights?includeDrafts=1", {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
        setArticles(data.articles || []);
        if (!category && data.categories && data.categories.length > 0) {
          setCategory(data.categories[0].name);
        }
      } else {
        setFeedback({ type: "error", text: data.error || "Failed to load insights." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to connect to database." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Title changes auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(slugify(val));
    }
  };

  // Add Category Handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setCreatingCategory(true);
      const res = await fetch("/api/admin/insights/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          text: `Category "${data.category.name}" created and synced to MongoDB.`,
        });
        setNewCategoryName("");
        await fetchData();
        setCategory(data.category.name);
      } else {
        setFeedback({ type: "error", text: data.error || "Failed to create category." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Network error creating category." });
    } finally {
      setCreatingCategory(false);
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (catId: string, catName: string) => {
    if (!window.confirm(`Are you sure you want to remove category "${catName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/insights/categories?id=${catId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", text: `Category "${catName}" deleted.` });
        await fetchData();
      } else {
        setFeedback({ type: "error", text: data.error || "Failed to delete category." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Network error deleting category." });
    }
  };

  // Cover Image File Upload (VPS Safe /api/admin/upload-media with folder=insights)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "insights");

      const res = await fetch("/api/admin/upload-media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setImage(data.url);
        setFeedback({
          type: "success",
          text: "Cover photograph uploaded and saved to VPS storage.",
        });
      } else {
        setFeedback({ type: "error", text: data.error || "Upload failed." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Network error during upload." });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Reset Composer Form
  const resetForm = () => {
    setEditingArticleId(null);
    setTitle("");
    setSlug("");
    setSlugManuallyEdited(false);
    if (categories.length > 0) {
      setCategory(categories[0].name);
    }
    setDate(getTodayEditorialDate());
    setReadTime("5 MIN READ");
    setExcerpt("");
    setImage("");
    setAuthor("Horologe Royale Editorial Desk");
    setPullQuote("");
    setContentBody("");
    setFeatured(false);
    setStatus("published");
  };

  // Populate Form for Editing
  const handleEditArticle = (art: ArticleItem) => {
    setEditingArticleId(art._id);
    setTitle(art.title);
    setSlug(art.slug);
    setSlugManuallyEdited(true);
    setCategory(art.category);
    setDate(art.date);
    setReadTime(art.readTime);
    setExcerpt(art.excerpt);
    setImage(art.image);
    setAuthor(art.author || "Horologe Royale Editorial Desk");
    setPullQuote(art.pullQuote || "");
    setContentBody(art.content ? art.content.join("\n\n") : "");
    setFeatured(Boolean(art.featured));
    setStatus(art.status || "published");

    // Scroll smoothly to composer
    if (composerRef.current) {
      composerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Submit Article (Create or Update)
  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setFeedback({ type: "error", text: "Please enter an article title." });
      return;
    }
    if (!category.trim()) {
      setFeedback({ type: "error", text: "Please select an editorial category." });
      return;
    }
    if (!excerpt.trim()) {
      setFeedback({ type: "error", text: "Please write a summary excerpt." });
      return;
    }
    if (!image.trim()) {
      setFeedback({ type: "error", text: "Please provide or upload a cover image." });
      return;
    }

    try {
      setActionLoading(true);

      const payload = {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        category: category.trim().toUpperCase(),
        date: date.trim() || getTodayEditorialDate(),
        readTime: readTime.trim() || "5 MIN READ",
        excerpt: excerpt.trim(),
        image: image.trim(),
        author: author.trim() || "Horologe Royale Editorial Desk",
        pullQuote: pullQuote.trim(),
        content: contentBody,
        featured,
        status,
      };

      let res: Response;
      if (editingArticleId) {
        res = await fetch("/api/admin/insights", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingArticleId, ...payload }),
        });
      } else {
        res = await fetch("/api/admin/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          text: editingArticleId
            ? `Article "${title}" updated successfully.`
            : `Article "${title}" published and live in vault.`,
        });
        resetForm();
        await fetchData();
      } else {
        setFeedback({ type: "error", text: data.error || "Failed to save article." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Network error saving article." });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Article Handler
  const handleDeleteArticle = async (id: string, artTitle: string) => {
    if (!window.confirm(`Permanently remove article "${artTitle}" from archives?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/insights?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", text: `Article "${artTitle}" removed.` });
        await fetchData();
        if (editingArticleId === id) {
          resetForm();
        }
      } else {
        setFeedback({ type: "error", text: data.error || "Failed to delete article." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Network error deleting article." });
    }
  };

  // Filtered Articles
  const filteredArticles = articles.filter((art) => {
    const matchesCategory =
      filterCategory === "ALL" || art.category === filterCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.slug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Numerical Counts
  const totalCount = articles.length;
  const publishedCount = articles.filter((a) => a.status === "published").length;
  const draftCount = articles.filter((a) => a.status === "draft").length;
  const featuredArticle = articles.find((a) => a.featured);

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* ========================================================================= */}
      {/* 1. EDITORIAL HEADER & METRICS STRIP                                       */}
      {/* ========================================================================= */}
      <div className="bg-[#FAF6F0] border border-[#DFCFC0] p-6 lg:p-8 rounded-none shadow-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#9D7E50] font-semibold mb-2">
              <BookOpen size={15} />
              <span>EDITORIAL ARCHIVE &amp; INSIGHTS DESK</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#2C241E] uppercase tracking-tight">
              The Art of Time Journal
            </h1>
            <p className="text-xs sm:text-sm text-[#7A6C5E] mt-1.5 max-w-2xl leading-relaxed">
              Curate mechanical watch guides, artisanal finishing essays, and dynamic
              editorial categories published directly to{" "}
              <Link
                href="/insights"
                target="_blank"
                className="text-[#5C4529] font-medium underline inline-flex items-center gap-1"
              >
                /insights <ExternalLink size={11} />
              </Link>
              .
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="border border-[#DFCFC0] bg-[#F3ECE2]/60 px-4 py-3 rounded-none">
              <span className="text-[10px] uppercase tracking-wider text-[#7A6C5E] block">
                Total Stories
              </span>
              <span className="font-['Times_New_Roman',serif] text-2xl font-bold text-[#2C241E]">
                {loading ? "—" : String(totalCount).padStart(2, "0")}
              </span>
            </div>
            <div className="border border-[#DFCFC0] bg-[#F3ECE2]/60 px-4 py-3 rounded-none">
              <span className="text-[10px] uppercase tracking-wider text-[#7A6C5E] block">
                Published
              </span>
              <span className="font-['Times_New_Roman',serif] text-2xl font-bold text-[#5C4529]">
                {loading ? "—" : String(publishedCount).padStart(2, "0")}
              </span>
            </div>
            <div className="border border-[#DFCFC0] bg-[#F3ECE2]/60 px-4 py-3 rounded-none">
              <span className="text-[10px] uppercase tracking-wider text-[#7A6C5E] block">
                Drafts
              </span>
              <span className="font-['Times_New_Roman',serif] text-2xl font-bold text-[#7A6C5E]">
                {loading ? "—" : String(draftCount).padStart(2, "0")}
              </span>
            </div>
            <div className="border border-[#DFCFC0] bg-[#F3ECE2]/60 px-4 py-3 rounded-none">
              <span className="text-[10px] uppercase tracking-wider text-[#7A6C5E] block">
                Lead Story
              </span>
              <span className="font-['Times_New_Roman',serif] text-xs font-semibold text-[#2C241E] truncate block max-w-[110px] mx-auto mt-1">
                {featuredArticle ? featuredArticle.title.slice(0, 15) + "..." : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* System Feedback Banner */}
        {feedback && (
          <div
            className={`mt-5 p-3.5 flex items-center justify-between text-xs tracking-wide rounded-none border ${
              feedback.type === "success"
                ? "bg-[#EFE8DD] text-[#2C241E] border-[#9D7E50]"
                : "bg-[#F3ECE2] text-[#2C241E] border-[#2C241E]"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#5C4529] shrink-0" />
              <span>{feedback.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-[#7A6C5E] hover:text-[#2C241E] p-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. JOURNAL CATEGORY MANAGER (DYNAMIC ALL STORIES BAR)                     */}
      {/* ========================================================================= */}
      <div className="bg-[#FAF6F0] border border-[#DFCFC0] p-6 lg:p-7 rounded-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-[#DFCFC0]">
          <div>
            <h2 className="font-serif text-lg sm:text-xl text-[#2C241E] uppercase tracking-tight">
              Journal Category Manager
            </h2>
            <p className="text-xs text-[#7A6C5E] mt-0.5">
              Categories created here automatically populate the top filter bar on{" "}
              <span className="font-semibold text-[#5C4529]">/insights</span>.
            </p>
          </div>

          {/* Inline Add Category Form */}
          <form
            onSubmit={handleAddCategory}
            className="flex items-center gap-2 self-start sm:self-auto"
          >
            <input
              type="text"
              placeholder="e.g. WATCH HISTORY"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="bg-white border border-[#DFCFC0] px-3 py-2 text-xs uppercase tracking-wider rounded-none focus:outline-none focus:border-[#5C4529] w-44 sm:w-56 text-[#2C241E]"
            />
            <button
              type="submit"
              disabled={creatingCategory || !newCategoryName.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5C4529] hover:bg-[#47341D] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-none transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Plus size={13} />
              <span>{creatingCategory ? "Adding..." : "Add Category"}</span>
            </button>
          </form>
        </div>

        {/* Category Pills List */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {/* Static ALL STORIES reference */}
          <span className="px-3.5 py-1.5 bg-[#EFE8DD] border border-[#DFCFC0] text-xs font-bold uppercase tracking-[0.18em] text-[#2C241E] select-none rounded-none">
            ALL STORIES (Global)
          </span>

          {categories.map((cat) => (
            <div
              key={cat._id}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#DFCFC0] text-xs uppercase tracking-[0.16em] text-[#2C241E] rounded-none group hover:border-[#9D7E50] transition-colors"
            >
              <span className="font-medium">{cat.name}</span>
              <button
                type="button"
                onClick={() => handleDeleteCategory(cat._id, cat.name)}
                title={`Delete ${cat.name}`}
                className="text-[#9D7E50] hover:text-[#2C241E] transition-colors p-0.5 cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>
          ))}

          {categories.length === 0 && !loading && (
            <span className="text-xs text-[#7A6C5E] italic">
              No custom categories yet. Add one above.
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ARTICLE COMPOSER / EDITOR CARD                                         */}
      {/* ========================================================================= */}
      <div
        ref={composerRef}
        className="bg-[#FAF6F0] border border-[#DFCFC0] p-6 lg:p-8 rounded-none"
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#DFCFC0]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#9D7E50] font-semibold">
              <FileText size={14} />
              <span>
                {editingArticleId ? "EDITING ARCHIVED ESSAY" : "PUBLISH NEW INSIGHT"}
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#2C241E] uppercase tracking-tight mt-1">
              {editingArticleId ? `Edit: ${title || "Story"}` : "Compose Editorial Story"}
            </h2>
          </div>

          {editingArticleId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-[#DFCFC0] bg-white text-xs uppercase tracking-wider text-[#7A6C5E] hover:text-[#2C241E] rounded-none transition-colors cursor-pointer"
            >
              <X size={13} />
              <span>Cancel Edit</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmitArticle} className="space-y-6">
          {/* Row 1: Title & Category */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8">
              <label className="block text-xs uppercase tracking-wider text-[#2C241E] font-semibold mb-1.5">
                Article Title <span className="text-[#9D7E50]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. A GUIDE TO THE WORLD OF MECHANICAL WATCHES"
                value={title}
                onChange={handleTitleChange}
                required
                className="w-full bg-white border border-[#DFCFC0] px-3.5 py-2.5 text-sm text-[#2C241E] rounded-none focus:outline-none focus:border-[#5C4529]"
              />
            </div>

            <div className="lg:col-span-4">
              <label className="block text-xs uppercase tracking-wider text-[#2C241E] font-semibold mb-1.5">
                Category <span className="text-[#9D7E50]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full bg-white border border-[#DFCFC0] px-3.5 py-2.5 text-xs uppercase tracking-wider text-[#2C241E] rounded-none focus:outline-none focus:border-[#5C4529] cursor-pointer"
              >
                <option value="" disabled>
                  -- Select Category --
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: URL Slug & Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#2C241E] font-semibold mb-1.5">
                URL Slug (/insights/[slug])
              </label>
              <input
                type="text"
                placeholder="a-guide-to-mechanical-watches"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
                className="w-full bg-white border border-[#DFCFC0] px-3.5 py-2.5 text-xs text-[#2C241E] rounded-none focus:outline-none focus:border-[#5C4529]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#2C241E] font-semibold mb-1.5">
                Editorial Date (Times New Roman)
              </label>
              <input
                type="text"
                placeholder="e.g. NOV 20, 2026"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-[#DFCFC0] px-3.5 py-2.5 text-xs font-['Times_New_Roman',serif] text-[#2C241E] rounded-none focus:outline-none focus:border-[#5C4529]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#2C241E] font-semibold mb-1.5">
                Estimated Reading Time
              </label>
              <input
                type="text"
                placeholder="e.g. 5 MIN READ"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full bg-white border border-[#DFCFC0] px-3.5 py-2.5 text-xs font-['Times_New_Roman',serif] text-[#2C241E] rounded-none focus:outline-none focus:border-[#5C4529]"
              />
            </div>
          </div>

          {/* Row 3: Cover Photograph (Upload + URL + Live Preview) */}
          <div className="border border-[#DFCFC0] bg-[#F3ECE2]/40 p-4 sm:p-5 rounded-none">
            <label className="block text-xs uppercase tracking-wider text-[#2C241E] font-semibold mb-2">
              Cover Photograph <span className="text-[#9D7E50]">*</span> (VPS Production Safe)
            </label>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Controls */}
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="article-cover-file"
                  />
                  <label
                    htmlFor="article-cover-file"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2C241E] hover:bg-[#1C1A17] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold rounded-none cursor-pointer transition-colors"
                  >
                    <Upload size={13} />
                    <span>{uploadingImage ? "Uploading to VPS..." : "Upload Cover File"}</span>
                  </label>
                  <span className="text-xs text-[#7A6C5E]">or paste image URL below</span>
                </div>

                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or /api/media/insights/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-white border border-[#DFCFC0] px-3.5 py-2 text-xs text-[#2C241E] rounded-none focus:outline-none focus:border-[#5C4529]"
                />
              </div>

              {/* Live Preview */}
              <div className="md:col-span-4 flex justify-center md:justify-end">
                <div className="w-full max-w-[200px] aspect-[16/10] bg-[#EFE8DD] border border-[#DFCFC0] relative overflow-hidden rounded-none flex items-center justify-center">
                  {image ? (
                    <img
                      src={image}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[11px] uppercase tracking-wider text-[#8C7A6B]">
                      No Image Preview
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Excerpt & Pull Quote */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#2C241E] font-semibold mb-1.5">
                Summary Excerpt <span className="text-[#9D7E50]">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="A concise, evocative editorial deck sentence displayed on /insights cards."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                className="w-full bg-white border border-[#DFCFC0] p-3 text-xs sm:text-sm text-[#2C241E] rounded-none focus:outline-none focus:border-[#5C4529] resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#2C241E] font-semibold mb-1.5">
                Editorial Pull Quote (Optional Highlight)
              </label>
              <textarea
                rows={3}
                placeholder="&ldquo;In a world characterized by planned obsolescence, a mechanical calibre remains an immortal pulse.&rdquo;"
                value={pullQuote}
                onChange={(e) => setPullQuote(e.target.value)}
                className="w-full bg-white border border-[#DFCFC0] p-3 text-xs sm:text-sm text-[#2C241E] italic font-serif rounded-none focus:outline-none focus:border-[#5C4529] resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Row 5: Full Article Body */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs uppercase tracking-wider text-[#2C241E] font-semibold">
                Full Article Essay Body
              </label>
              <span className="text-[11px] text-[#7A6C5E]">
                Tip: Separate paragraphs with an empty blank line.
              </span>
            </div>
            <textarea
              rows={8}
              placeholder="Paste or write the full editorial essay here. Each paragraph separated by a blank line will render as a distinct reading paragraph on /insights/[slug]."
              value={contentBody}
              onChange={(e) => setContentBody(e.target.value)}
              className="w-full bg-white border border-[#DFCFC0] p-3.5 text-xs sm:text-sm text-[#2C241E] rounded-none focus:outline-none focus:border-[#5C4529] font-sans leading-relaxed"
            />
          </div>

          {/* Row 6: Toggles & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-4 border-t border-[#DFCFC0]">
            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-6">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#5C4529] rounded-none"
                />
                <span className="text-xs uppercase tracking-wider text-[#2C241E] font-medium">
                  Feature as Top Lead Story Card on /insights
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#7A6C5E] font-medium">
                  Status:
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                  className="bg-white border border-[#DFCFC0] px-2.5 py-1 text-xs uppercase tracking-wider text-[#2C241E] rounded-none focus:outline-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="flex items-center gap-3">
              {editingArticleId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 border border-[#DFCFC0] bg-white text-xs uppercase tracking-wider text-[#7A6C5E] hover:text-[#2C241E] rounded-none transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#5C4529] hover:bg-[#47341D] text-[#FAF6F0] text-xs font-semibold uppercase tracking-widest rounded-none transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <span>
                  {actionLoading
                    ? "Saving to Vault..."
                    : editingArticleId
                    ? "Update Story →"
                    : "Publish Story →"}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* 4. PUBLISHED STORIES DIRECTORY TABLE & SEARCH                             */}
      {/* ========================================================================= */}
      <div className="bg-[#FAF6F0] border border-[#DFCFC0] p-6 lg:p-8 rounded-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-[#DFCFC0]">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#2C241E] uppercase tracking-tight">
              Published Stories Directory
            </h2>
            <p className="text-xs text-[#7A6C5E] mt-0.5">
              Live journal archive powering <span className="font-semibold text-[#5C4529]">/insights</span>.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
              />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-[#DFCFC0] pl-8 pr-3 py-1.5 text-xs text-[#2C241E] rounded-none focus:outline-none focus:border-[#5C4529] w-48 sm:w-60"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white border border-[#DFCFC0] px-3 py-1.5 text-xs uppercase tracking-wider text-[#2C241E] rounded-none focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stories Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F3ECE2] border-b border-[#DFCFC0] text-[#7A6C5E] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Visual</th>
                <th className="py-3 px-4 font-semibold">Title &amp; URL Slug</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Date &amp; Read Time</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFCFC0] bg-white">
              {filteredArticles.map((art) => (
                <tr
                  key={art._id}
                  className="hover:bg-[#FAF6F0]/60 transition-colors"
                >
                  {/* Thumbnail */}
                  <td className="py-3 px-4 w-20">
                    <div className="w-16 aspect-[16/10] bg-[#EFE8DD] border border-[#DFCFC0] overflow-hidden relative rounded-none">
                      {art.image && (
                        <img
                          src={art.image}
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </td>

                  {/* Title & Slug */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-sm font-semibold text-[#2C241E] line-clamp-1">
                        {art.title}
                      </span>
                      {art.featured && (
                        <span className="px-2 py-0.5 bg-[#9D7E50] text-[#FAF6F0] text-[9px] uppercase tracking-wider font-bold shrink-0">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/insights/${art.slug}`}
                      target="_blank"
                      className="text-[11px] text-[#7A6C5E] hover:text-[#5C4529] inline-flex items-center gap-1 font-mono mt-0.5 truncate"
                    >
                      <span>/insights/{art.slug}</span>
                      <ExternalLink size={10} />
                    </Link>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-[#EFE8DD] border border-[#DFCFC0] text-[10px] font-semibold uppercase tracking-wider text-[#5C4529]">
                      {art.category}
                    </span>
                  </td>

                  {/* Date & Read Time */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-['Times_New_Roman',serif] text-xs text-[#2C241E] block font-medium">
                      {art.date}
                    </span>
                    <span className="font-['Times_New_Roman',serif] text-[11px] text-[#8C7A6B]">
                      {art.readTime}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                        art.status === "published"
                          ? "bg-[#EFE8DD] text-[#2C241E] border border-[#9D7E50]"
                          : "bg-[#F3ECE2] text-[#7A6C5E] border border-[#DFCFC0]"
                      }`}
                    >
                      {art.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditArticle(art)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#DFCFC0] bg-white hover:border-[#5C4529] text-xs text-[#2C241E] rounded-none transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit3 size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteArticle(art._id, art.title)}
                        className="p-1.5 border border-[#DFCFC0] bg-white hover:border-[#2C241E] text-[#7A6C5E] hover:text-[#2C241E] rounded-none transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredArticles.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#7A6C5E] italic">
                    No articles matched your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

