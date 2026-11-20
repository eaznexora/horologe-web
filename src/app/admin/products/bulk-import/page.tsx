"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Papa from "papaparse";
import {
  Upload,
  FileSpreadsheet,
  FileArchive,
  Download,
  Check,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Layers,
  ArrowLeft,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

const SAMPLE_CSV_CONTENT = `sku,name,brand,model,reference,category,subCategory,watchCategory,price,originalPrice,conditionBadge,gradeBadge,scopeBadge,images,tagline,heritageHeadline,heritageStory,minorSpecs,keySpecs,pillar1Title,pillar1Desc,pillar2Title,pillar2Desc,pillar3Title,pillar3Desc,metaTitle,metaDescription,canonicalSlug,focusKeywords
HR-DAYTONA-01,Rolex Cosmograph Daytona 116500LN Panda,Rolex,Cosmograph Daytona,116500LN,Men,Rolex,Chronograph,2450000,2650000,Preowned,Mint Condition,Full Set,rolex-front.png | rolex-back.png | rolex-side.png | rolex-clasp.png,The pinnacle motorsport chronograph engineered for relentless precision.,LEGENDARY MOTORSPORT CHRONOGRAPH,First introduced in 1963 and refined over decades to become the world's most coveted racing chronograph with an in-house calibre 4130 movement.,Chronograph | Automatic | Oystersteel,CASE SIZE: 40 mm | MOVEMENT: Calibre 4130 Automatic | POWER RESERVE: 72 Hours | WATER RESISTANCE: 100m | BEZEL: Cerachrom Ceramic,AUTHENTICATED PROVENANCE,Verified authentic through rigorous multi-point mechanical and archival appraisal.,MASTER HOROLOGIST INSPECTION,Undergoes full amplitude testing and waterproof pressure chamber verification.,INSURED ARMORED DELIVERY,Shipped via armored courier with tamper-evident seal and biometric verification.,Rolex Cosmograph Daytona 116500LN Panda | Horologe Royale,Acquire the iconic Rolex Daytona 116500LN Panda with ceramic bezel and calibre 4130 movement.,rolex-cosmograph-daytona-116500ln-panda,"rolex, daytona, panda, chronograph, luxury watch"
HR-NAUTILUS-02,Patek Philippe Nautilus 5711/1A-010 Blue Dial,Patek Philippe,Nautilus,5711/1A-010,Men,Patek Philippe,Sports Luxury,7850000,8200000,Preowned,Pristine Condition,Archive Papers,nautilus-dial.jpg | nautilus-caseback.jpg | nautilus-profile.jpg | nautilus-wrist.jpg,The definitive luxury sports icon designed by Gérald Genta.,AN ARCHITECTURAL HOROLOGICAL ICON,Conceived by legendary designer Gérald Genta in 1976 and characterized by its rounded octagonal bezel and horizontally embossed dial.,Sports Luxury | Ultra Thin | Integrated Bracelet,CASE SIZE: 40 mm | MOVEMENT: Calibre 324 S C | CASE THICKNESS: 8.3 mm | WATER RESISTANCE: 120m | DIAL: Graduated Blue,PROVENANCE DOCUMENTATION,Delivered with verified certificate of origin and complete factory archival history.,SWISS HIGH HOROLOGY,Regulated to extreme chronometric standards under the strict Patek Philippe Seal.,SECURE VAULT COURIER,Direct delivery to your residence or priority pickup in our Kala Ghoda salon.,Patek Philippe Nautilus 5711/1A-010 Blue Dial | Horologe Royale,Authentic Patek Philippe Nautilus 5711 stainless steel with graduated blue horizontal embossed dial.,patek-philippe-nautilus-5711-blue-dial,"patek philippe, nautilus, 5711, gerald genta, sports luxury"`;

interface ImportReport {
  createdCount: number;
  imagesExtractedCount: number;
  unmatchedImages: string[];
  errors: Array<{ row: number; name: string; reason: string }>;
}

export default function BulkImportPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);

  const [previewRows, setPreviewRows] = useState<Array<Record<string, string>>>([]);
  const [totalRowsCount, setTotalRowsCount] = useState<number>(0);

  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const zipInputRef = useRef<HTMLInputElement | null>(null);

  // Download Sample Template CSV
  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "horologe-royale-bulk-template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle CSV File Selection & Parse for Preview
  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setErrorMessage(null);
    setReport(null);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setPreviewRows(results.data.slice(0, 10));
          setTotalRowsCount(results.data.length);
        } else {
          setPreviewRows([]);
          setTotalRowsCount(0);
          setErrorMessage("Selected CSV file contains no data rows.");
        }
      },
      error: (err) => {
        console.error("CSV parse error:", err);
        setErrorMessage(`CSV parsing error: ${err.message}`);
      },
    });
  };

  // Handle ZIP File Selection
  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setZipFile(file);
    setReport(null);
  };

  // Reset form
  const handleReset = () => {
    setCsvFile(null);
    setZipFile(null);
    setPreviewRows([]);
    setTotalRowsCount(0);
    setReport(null);
    setErrorMessage(null);
    if (csvInputRef.current) csvInputRef.current.value = "";
    if (zipInputRef.current) zipInputRef.current.value = "";
  };

  // Execute Bulk Import
  const handleExecuteImport = async () => {
    if (!csvFile) {
      setErrorMessage("Please select a valid CSV spreadsheet before starting import.");
      return;
    }

    try {
      setIsImporting(true);
      setErrorMessage(null);
      setReport(null);

      const formData = new FormData();
      formData.append("csvFile", csvFile);
      if (zipFile) {
        formData.append("imagesZip", zipFile);
      }

      const res = await fetch("/api/admin/products/bulk-import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process bulk import.");
      }

      setReport({
        createdCount: data.createdCount || 0,
        imagesExtractedCount: data.imagesExtractedCount || 0,
        unmatchedImages: data.unmatchedImages || [],
        errors: data.errors || [],
      });
    } catch (err: any) {
      console.error("Bulk import failed:", err);
      setErrorMessage(err.message || "An unexpected error occurred during bulk intake.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
      {/* 1. Top Editorial Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#DFCFC0]">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#7A6C5E] mb-2 font-medium">
            <Link
              href="/admin/products"
              className="hover:text-[#2C241E] transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Products
            </Link>
            <span>/</span>
            <span className="text-[#5C4529] font-semibold">Bulk Importer</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#2C241E] font-normal tracking-tight uppercase">
            Bulk Timepiece Vault Import
          </h1>
          <p className="text-sm text-[#7A6C5E] mt-1 max-w-2xl leading-relaxed">
            Ingest 200+ luxury timepieces at once from a structured CSV spreadsheet and extract watch photography from a companion ZIP archive.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#5C4529] bg-[#FAF6F0] text-[#5C4529] hover:bg-[#5C4529] hover:text-[#FAF6F0] text-xs font-semibold uppercase tracking-widest transition-colors rounded-none shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Sample CSV Template</span>
          </button>

          {(csvFile || zipFile || report) && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isImporting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#DFCFC0] bg-[#EFE8DD] text-[#7A6C5E] hover:text-[#2C241E] hover:bg-[#E5D7C7] text-xs font-semibold uppercase tracking-widest transition-colors rounded-none disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Format Specification & Syntax Guide Box */}
      <div className="border border-[#DFCFC0] bg-[#FAF6F0] rounded-none p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-xs uppercase tracking-widest text-[#5C4529] font-semibold">
          <Info className="w-4 h-4 shrink-0 text-[#5C4529]" />
          <span>SPREADSHEET FORMAT SPECIFICATION &amp; PIPE (|) DELIMITER RULES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#2C241E] leading-relaxed">
          <div className="p-3.5 bg-[#EFE8DD]/70 border border-[#DFCFC0] space-y-1.5">
            <span className="font-semibold block uppercase tracking-wider text-[#5C4529]">
              1. Images (Pipe Delimited)
            </span>
            <code className="block bg-[#FAF6F0] p-2 border border-[#DFCFC0] text-[11px] font-mono text-[#2C241E] break-all">
              rolex-front.png | rolex-back.png | rolex-side.png | rolex-clasp.png
            </code>
            <p className="text-[11px] text-[#7A6C5E]">
              Up to 4 exact filenames matching images inside your <span className="font-mono text-[#2C241E]">.zip</span>. Missing slots automatically use <span className="font-mono">/logo.png</span>.
            </p>
          </div>

          <div className="p-3.5 bg-[#EFE8DD]/70 border border-[#DFCFC0] space-y-1.5">
            <span className="font-semibold block uppercase tracking-wider text-[#5C4529]">
              2. Category Triad
            </span>
            <code className="block bg-[#FAF6F0] p-2 border border-[#DFCFC0] text-[11px] font-mono text-[#2C241E] break-all">
              category, subCategory, watchCategory
            </code>
            <p className="text-[11px] text-[#7A6C5E]">
              <span className="font-semibold text-[#2C241E]">category</span>: Parent (Men / Women). <span className="font-semibold text-[#2C241E]">subCategory</span>: Sub-brand. <span className="font-semibold text-[#2C241E]">watchCategory</span>: Filter Pill (Chronograph / Dress).
            </p>
          </div>

          <div className="p-3.5 bg-[#EFE8DD]/70 border border-[#DFCFC0] space-y-1.5">
            <span className="font-semibold block uppercase tracking-wider text-[#5C4529]">
              3. Minor &amp; Key Specs
            </span>
            <code className="block bg-[#FAF6F0] p-2 border border-[#DFCFC0] text-[11px] font-mono text-[#2C241E] break-all">
              CASE SIZE: 40 mm | MOVEMENT: Automatic | DIAL: Panda White
            </code>
            <p className="text-[11px] text-[#7A6C5E]">
              <span className="font-semibold text-[#2C241E]">minorSpecs</span>: max 3 summary tags. <span className="font-semibold text-[#2C241E]">keySpecs</span>: dynamic matrix of <span className="font-mono">LABEL: VALUE</span> pairs.
            </p>
          </div>

          <div className="p-3.5 bg-[#EFE8DD]/70 border border-[#DFCFC0] space-y-1.5">
            <span className="font-semibold block uppercase tracking-wider text-[#5C4529]">
              4. SEO Suite &amp; Canonical Slug
            </span>
            <code className="block bg-[#FAF6F0] p-2 border border-[#DFCFC0] text-[11px] font-mono text-[#2C241E] break-all">
              canonicalSlug: rolex-daytona-panda
            </code>
            <p className="text-[11px] text-[#7A6C5E]">
              Optional columns: <span className="font-semibold text-[#2C241E]">metaTitle</span>, <span className="font-semibold text-[#2C241E]">metaDescription</span>, clean <span className="font-semibold text-[#2C241E]">canonicalSlug</span>, and <span className="font-semibold text-[#2C241E]">focusKeywords</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 border border-[#5C4529] bg-[#EFE8DD] text-[#2C241E] text-xs font-medium uppercase tracking-wide flex items-center justify-between rounded-none">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#5C4529] shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-xs text-[#7A6C5E] hover:text-[#2C241E]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Dual Upload Dropzones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dropzone 1: Timepieces CSV Spreadsheet */}
        <div
          onClick={() => csvInputRef.current?.click()}
          className={`border-2 border-dashed p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all rounded-none ${
            csvFile
              ? "border-[#5C4529] bg-[#EFE8DD]/60"
              : "border-[#DFCFC0] bg-[#FAF6F0] hover:border-[#5C4529] hover:bg-[#EFE8DD]/40"
          }`}
        >
          <input
            type="file"
            ref={csvInputRef}
            accept=".csv,text/csv"
            onChange={handleCsvChange}
            className="hidden"
          />

          <div className="w-12 h-12 bg-[#EFE8DD] border border-[#DFCFC0] text-[#5C4529] flex items-center justify-center mb-3 rounded-none">
            <FileSpreadsheet className="w-6 h-6" />
          </div>

          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2C241E]">
            Step 1: Timepieces Spreadsheet (.csv)
          </h3>
          <p className="text-xs text-[#7A6C5E] mt-1">
            Click to upload or drag your compiled timepiece catalog CSV.
          </p>

          {csvFile ? (
            <div className="mt-4 px-3.5 py-1.5 bg-[#FAF6F0] border border-[#5C4529] text-[#5C4529] text-xs font-medium flex items-center gap-2">
              <Check className="w-3.5 h-3.5" />
              <span className="font-mono">{csvFile.name}</span>
              <span className="font-['Times_New_Roman',serif] text-[13px] text-[#7A6C5E]">
                ({(csvFile.size / 1024).toFixed(1)} KB — {totalRowsCount} watches)
              </span>
            </div>
          ) : (
            <span className="mt-3 text-[11px] uppercase tracking-wider text-[#5C4529] font-medium underline">
              Browse .CSV File
            </span>
          )}
        </div>

        {/* Dropzone 2: Watch Photography Archive (.zip) */}
        <div
          onClick={() => zipInputRef.current?.click()}
          className={`border-2 border-dashed p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all rounded-none ${
            zipFile
              ? "border-[#5C4529] bg-[#EFE8DD]/60"
              : "border-[#DFCFC0] bg-[#FAF6F0] hover:border-[#5C4529] hover:bg-[#EFE8DD]/40"
          }`}
        >
          <input
            type="file"
            ref={zipInputRef}
            accept=".zip,application/zip,application/x-zip-compressed"
            onChange={handleZipChange}
            className="hidden"
          />

          <div className="w-12 h-12 bg-[#EFE8DD] border border-[#DFCFC0] text-[#5C4529] flex items-center justify-center mb-3 rounded-none">
            <FileArchive className="w-6 h-6" />
          </div>

          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2C241E]">
            Step 2: Watch Photography Archive (.zip)
          </h3>
          <p className="text-xs text-[#7A6C5E] mt-1">
            Optional image bundle. Images match automatically by filename to CSV entries.
          </p>

          {zipFile ? (
            <div className="mt-4 px-3.5 py-1.5 bg-[#FAF6F0] border border-[#5C4529] text-[#5C4529] text-xs font-medium flex items-center gap-2">
              <Check className="w-3.5 h-3.5" />
              <span className="font-mono">{zipFile.name}</span>
              <span className="font-['Times_New_Roman',serif] text-[13px] text-[#7A6C5E]">
                ({(zipFile.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            </div>
          ) : (
            <span className="mt-3 text-[11px] uppercase tracking-wider text-[#5C4529] font-medium underline">
              Browse .ZIP Archive (Optional)
            </span>
          )}
        </div>
      </div>

      {/* 4. Client-Side CSV Preview Table */}
      {previewRows.length > 0 && (
        <div className="border border-[#DFCFC0] bg-[#FAF6F0] rounded-none overflow-hidden space-y-0">
          <div className="bg-[#EFE8DD] px-5 py-3 border-b border-[#DFCFC0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#5C4529] inline-block" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2C241E]">
                CSV Staging Preview (First {previewRows.length} of {totalRowsCount} Watches)
              </span>
            </div>
            <span className="text-xs font-['Times_New_Roman',serif] text-[#7A6C5E]">
              {totalRowsCount} total records detected
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="border-b border-[#DFCFC0] bg-[#FAF6F0] text-[#7A6C5E] uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-4 font-semibold">#</th>
                  <th className="py-2.5 px-4 font-semibold">SKU</th>
                  <th className="py-2.5 px-4 font-semibold">Title / Model</th>
                  <th className="py-2.5 px-4 font-semibold">Maison</th>
                  <th className="py-2.5 px-4 font-semibold">Price (INR)</th>
                  <th className="py-2.5 px-4 font-semibold">Category / Sub / Pill</th>
                  <th className="py-2.5 px-4 font-semibold">Image References</th>
                  <th className="py-2.5 px-4 font-semibold">Specs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFCFC0]/60 text-[#2C241E]">
                {previewRows.map((row, idx) => {
                  const imageCount = (row.images || "")
                    .split("|")
                    .map((s) => s.trim())
                    .filter(Boolean).length;
                  const specCount = (row.keySpecs || "")
                    .split("|")
                    .map((s) => s.trim())
                    .filter(Boolean).length;

                  return (
                    <tr key={idx} className="hover:bg-[#EFE8DD]/30 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-[#7A6C5E] text-[11px]">{idx + 1}</td>
                      <td className="py-2.5 px-4 font-['Times_New_Roman',serif] font-medium text-[#5C4529]">
                        {row.sku || "—"}
                      </td>
                      <td className="py-2.5 px-4 font-medium max-w-[240px]" title={row.name}>
                        <div className="truncate text-[#2C241E]">{row.name}</div>
                        {row.canonicalSlug && (
                          <div className="font-mono text-[10px] text-[#8C7A6B] truncate">
                            /timepiece/{row.canonicalSlug}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-[#7A6C5E] uppercase tracking-wider text-[11px]">
                        {row.brand || "—"}
                      </td>
                      <td className="py-2.5 px-4 font-['Times_New_Roman',serif] text-sm font-semibold text-[#2C241E] whitespace-nowrap">
                        ₹{row.price}
                      </td>
                      <td className="py-2.5 px-4 text-[#7A6C5E] text-[11px]">
                        <div className="font-semibold text-[#2C241E] uppercase">
                          {row.category || "Default"}
                        </div>
                        <div className="text-[10px] text-[#5C4529] mt-0.5">
                          {row.subCategory ? `Sub: ${row.subCategory}` : "No Subcategory"}
                          {row.watchCategory ? ` • Pill: ${row.watchCategory}` : ""}
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 bg-[#EFE8DD] border border-[#DFCFC0] text-[10px] uppercase tracking-wider font-semibold">
                          {imageCount} {imageCount === 1 ? "Image" : "Images"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="font-['Times_New_Roman',serif] text-xs text-[#7A6C5E]">
                          {specCount} {specCount === 1 ? "spec" : "specs"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Execution Button & Status */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[#EFE8DD] border border-[#DFCFC0] rounded-none">
        <div className="text-xs text-[#2C241E]">
          <span className="font-semibold block uppercase tracking-wider">
            Ready for Vault Ingestion
          </span>
          <span className="text-[#7A6C5E]">
            {csvFile ? `Proceeding with "${csvFile.name}" (${totalRowsCount} watches)` : "Please select a .csv file above"}
            {zipFile ? ` and "${zipFile.name}" image archive.` : " (No image archive attached — will use default logo fallback for missing assets)."}
          </span>
        </div>

        <button
          type="button"
          disabled={!csvFile || isImporting}
          onClick={handleExecuteImport}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#5C4529] hover:bg-[#4A3720] text-[#FAF6F0] text-xs font-semibold uppercase tracking-widest transition-all rounded-none shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isImporting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-[#FAF6F0]" />
              <span>Importing {totalRowsCount} Timepieces...</span>
            </>
          ) : (
            <>
              <span>Import Timepieces to Vault</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* 6. Post-Import Report Card */}
      {report && (
        <div className="border border-[#5C4529] bg-[#FAF6F0] p-6 space-y-6 rounded-none shadow-sm animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DFCFC0]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#5C4529] text-[#FAF6F0] flex items-center justify-center rounded-none shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#2C241E] uppercase font-normal">
                  Bulk Import Execution Completed
                </h3>
                <span className="text-xs text-[#7A6C5E]">
                  Vault catalog updated successfully.
                </span>
              </div>
            </div>

            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#5C4529] bg-[#5C4529] text-[#FAF6F0] text-xs font-semibold uppercase tracking-widest hover:bg-[#4A3720] transition-colors rounded-none"
            >
              <span>View Product Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Metric Summary Counters (Times New Roman) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[#EFE8DD]/70 border border-[#DFCFC0]">
              <span className="text-[10px] uppercase tracking-wider text-[#7A6C5E] font-semibold block mb-1">
                Watches Registered
              </span>
              <span className="font-['Times_New_Roman',serif] text-3xl font-bold text-[#5C4529]">
                {report.createdCount}
              </span>
            </div>

            <div className="p-4 bg-[#EFE8DD]/70 border border-[#DFCFC0]">
              <span className="text-[10px] uppercase tracking-wider text-[#7A6C5E] font-semibold block mb-1">
                Images Extracted
              </span>
              <span className="font-['Times_New_Roman',serif] text-3xl font-bold text-[#2C241E]">
                {report.imagesExtractedCount}
              </span>
            </div>

            <div className="p-4 bg-[#EFE8DD]/70 border border-[#DFCFC0]">
              <span className="text-[10px] uppercase tracking-wider text-[#7A6C5E] font-semibold block mb-1">
                Unmatched Images
              </span>
              <span className="font-['Times_New_Roman',serif] text-3xl font-bold text-[#7A6C5E]">
                {report.unmatchedImages.length}
              </span>
            </div>

            <div className="p-4 bg-[#EFE8DD]/70 border border-[#DFCFC0]">
              <span className="text-[10px] uppercase tracking-wider text-[#7A6C5E] font-semibold block mb-1">
                Row Failures
              </span>
              <span className="font-['Times_New_Roman',serif] text-3xl font-bold text-[#2C241E]">
                {report.errors.length}
              </span>
            </div>
          </div>

          {/* Unmatched Images List */}
          {report.unmatchedImages.length > 0 && (
            <div className="p-4 bg-[#EFE8DD]/40 border border-[#DFCFC0] space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5C4529] block">
                Unmatched Image Filenames ({report.unmatchedImages.length})
              </span>
              <p className="text-[11px] text-[#7A6C5E]">
                These filenames were listed in the CSV but were not found inside the uploaded ZIP archive. Fallback logo (/logo.png) was applied:
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pt-1 font-mono text-[11px]">
                {report.unmatchedImages.map((imgName, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-[#FAF6F0] border border-[#DFCFC0] text-[#2C241E]"
                  >
                    {imgName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Row Errors List */}
          {report.errors.length > 0 && (
            <div className="p-4 bg-[#EFE8DD]/40 border border-[#DFCFC0] space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2C241E] block">
                Row Ingestion Warnings / Errors ({report.errors.length})
              </span>
              <div className="max-h-40 overflow-y-auto space-y-1.5 text-xs text-[#2C241E]">
                {report.errors.map((err, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-[#FAF6F0] border border-[#DFCFC0]">
                    <span className="font-['Times_New_Roman',serif] font-bold text-[#5C4529] shrink-0">
                      Row {err.row}:
                    </span>
                    <span className="font-medium truncate max-w-[220px]">{err.name}</span>
                    <span className="text-[#7A6C5E] shrink-0">— {err.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

