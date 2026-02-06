"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  type ArticleImportResult,
  type ArticleImportStatus,
  type ArticlePreviewResult,
  checkSanityWriteConfig,
  getArticleImportStatus,
  getPersonImportStatus,
  type ImportMode,
  type ImportResult,
  importArticlesToSanity,
  importPersonsToSanity,
  type PersonImportStatus,
  type PreviewResult,
  previewArticleImport,
  previewPersonImport,
} from "@/server/actions/sanity-migration.action";

type DocumentType = "person" | "article";
type Phase = "idle" | "previewing" | "previewed" | "importing" | "done";

export function SanityTab() {
  const [docType, setDocType] = useState<DocumentType>("article");
  const [phase, setPhase] = useState<Phase>("idle");
  const [configError, setConfigError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Person state
  const [personPreview, setPersonPreview] = useState<PreviewResult | null>(null);
  const [personImportResult, setPersonImportResult] = useState<ImportResult | null>(null);
  const [personImportStatus, setPersonImportStatus] = useState<PersonImportStatus | null>(null);

  // Article state
  const [articlePreview, setArticlePreview] = useState<ArticlePreviewResult | null>(null);
  const [articleImportResult, setArticleImportResult] = useState<ArticleImportResult | null>(null);
  const [articleImportStatus, setArticleImportStatus] = useState<ArticleImportStatus | null>(null);
  const [articleLimit, setArticleLimit] = useState<number>(5);

  const [importMode, setImportMode] = useState<ImportMode>("full");

  // Load previous import status on mount
  useEffect(() => {
    getPersonImportStatus().then(setPersonImportStatus);
    getArticleImportStatus().then(setArticleImportStatus);
  }, []);

  const handlePreview = () => {
    setPhase("previewing");
    setConfigError(null);
    startTransition(async () => {
      const configCheck = await checkSanityWriteConfig();
      if (!configCheck.configured) {
        setConfigError(configCheck.message);
        setPhase("idle");
        return;
      }

      if (docType === "person") {
        const result = await previewPersonImport();
        setPersonPreview(result);
      } else {
        const result = await previewArticleImport(articleLimit || undefined);
        setArticlePreview(result);
      }
      setPhase("previewed");
    });
  };

  const handleImport = (mode: ImportMode) => {
    setImportMode(mode);
    setPhase("importing");
    startTransition(async () => {
      if (docType === "person") {
        const result = await importPersonsToSanity(mode);
        setPersonImportResult(result);
        const status = await getPersonImportStatus();
        setPersonImportStatus(status);
      } else {
        const result = await importArticlesToSanity(mode, articleLimit || undefined);
        setArticleImportResult(result);
        const status = await getArticleImportStatus();
        setArticleImportStatus(status);
      }
      setPhase("done");
    });
  };

  const handleReset = () => {
    setPhase("idle");
    setPersonPreview(null);
    setPersonImportResult(null);
    setArticlePreview(null);
    setArticleImportResult(null);
    setConfigError(null);
  };

  const handleDocTypeChange = (type: DocumentType) => {
    setDocType(type);
    handleReset();
  };

  const hasPreviousImport = docType === "person" ? !!personImportStatus : !!articleImportStatus;
  const previousImportStatus = docType === "person" ? personImportStatus : articleImportStatus;

  return (
    <div className="flex flex-col gap-6">
      {/* Config error */}
      {configError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-800">Configuration Missing</p>
          <p className="mt-1 text-sm text-red-700">{configError}</p>
          <p className="mt-2 text-xs text-red-600">
            Add <code className="rounded bg-red-100 px-1 py-0.5">SANITY_API_WRITE_TOKEN</code> to
            your <code className="rounded bg-red-100 px-1 py-0.5">.env.local</code> file.
          </p>
        </div>
      )}

      {/* Document type selector */}
      <div className="rounded-md border border-neutral-200 bg-white p-5">
        <h3 className="font-semibold text-neutral-900">Document Type</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Select the Storyblok content type to import into Sanity.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <select
            className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm"
            value={docType}
            onChange={(e) => handleDocTypeChange(e.target.value as DocumentType)}
            disabled={phase !== "idle"}
          >
            <option value="person">Person (88 stories → person)</option>
            <option value="article">Article (77 stories → knowledgeArticle)</option>
          </select>

          {docType === "article" && phase === "idle" && (
            <div className="flex items-center gap-2">
              <label htmlFor="article-limit" className="text-sm text-neutral-500">
                Limit:
              </label>
              <input
                id="article-limit"
                type="number"
                min={1}
                max={77}
                value={articleLimit}
                onChange={(e) => setArticleLimit(Number(e.target.value))}
                className="w-16 rounded border border-neutral-300 px-2 py-1.5 text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Previous import status */}
      {hasPreviousImport && phase === "idle" && previousImportStatus && (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-800">Previous Import</p>
          <p className="mt-1 text-sm text-blue-700">
            Last imported {formatRelativeTime(previousImportStatus.lastImportCompleted)} —{" "}
            {previousImportStatus.importedSlugs.length} items
          </p>
          <p className="mt-0.5 text-xs text-blue-600">{previousImportStatus.lastImportCompleted}</p>
        </div>
      )}

      {/* Preview button */}
      {phase === "idle" && (
        <Button onClick={handlePreview} disabled={isPending}>
          Preview Transform
        </Button>
      )}

      {/* Loading state */}
      {phase === "previewing" && (
        <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Loading preview…
        </div>
      )}

      {/* Person preview */}
      {phase === "previewed" && docType === "person" && personPreview && (
        <PersonPreviewSection
          preview={personPreview}
          hasPreviousImport={!!personImportStatus}
          onImport={handleImport}
          onReset={handleReset}
          isPending={isPending}
        />
      )}

      {/* Article preview */}
      {phase === "previewed" && docType === "article" && articlePreview && (
        <ArticlePreviewSection
          preview={articlePreview}
          hasPreviousImport={!!articleImportStatus}
          onImport={handleImport}
          onReset={handleReset}
          isPending={isPending}
        />
      )}

      {/* Importing state */}
      {phase === "importing" && (
        <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {importMode === "incremental"
            ? "Syncing changes to Sanity…"
            : "Importing to Sanity… This may take a few minutes."}
        </div>
      )}

      {/* Import results (generic for both types) */}
      {phase === "done" && (
        <>
          <ImportResultSection
            result={docType === "person" ? personImportResult : articleImportResult}
          />
          <Button onClick={handleReset} variant="secondary" className="w-full">
            Start Over
          </Button>
        </>
      )}
    </div>
  );
}

// ---------- Person Preview ----------

function PersonPreviewSection({
  preview,
  hasPreviousImport,
  onImport,
  onReset,
  isPending,
}: {
  preview: PreviewResult;
  hasPreviousImport: boolean;
  onImport: (mode: ImportMode) => void;
  onReset: () => void;
  isPending: boolean;
}) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        <SummaryCard label="Total" value={preview.total} />
        <SummaryCard
          label="Internal"
          value={
            preview.items.filter((i) => !i.externalPerson && i.changeType !== "deleted").length
          }
          variant="success"
        />
        <SummaryCard
          label="External"
          value={preview.items.filter((i) => i.externalPerson && i.changeType !== "deleted").length}
        />
        <SummaryCard
          label="Changed"
          value={preview.changed}
          variant={preview.changed > 0 ? "warn" : "default"}
        />
        <SummaryCard label="Unchanged" value={preview.unchanged} />
        <SummaryCard
          label="Deleted"
          value={preview.deleted}
          variant={preview.deleted > 0 ? "error" : "default"}
        />
      </div>

      <div className="overflow-x-auto rounded-md border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Status</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Name</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Type</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Role (NO)</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Role (EN)</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Email</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Company</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Img</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Warnings</th>
            </tr>
          </thead>
          <tbody>
            {preview.items.map((item) => (
              <tr
                key={item.slug}
                className={`border-t border-neutral-200 ${
                  item.changeType === "unchanged" ? "opacity-50" : ""
                } ${item.changeType === "deleted" ? "bg-red-50" : ""}`}
              >
                <td className="px-3 py-2">
                  <ChangeTypePill changeType={item.changeType} />
                </td>
                <td className="px-3 py-2 font-medium text-neutral-900">{item.name}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.externalPerson
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {item.externalPerson ? "External" : "Internal"}
                  </span>
                </td>
                <td className="px-3 py-2 text-neutral-600">{item.roleNo || "—"}</td>
                <td className="px-3 py-2 text-neutral-600">{item.roleEn || "—"}</td>
                <td className="px-3 py-2 text-neutral-500">{item.email ?? "—"}</td>
                <td className="px-3 py-2 text-neutral-500">{item.company ?? "—"}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${item.hasImage ? "bg-emerald-500" : "bg-neutral-300"}`}
                  />
                </td>
                <td className="max-w-xs px-3 py-2">
                  {item.warnings.length > 0 && (
                    <ul className="text-xs text-amber-700">
                      {item.warnings.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ImportActions
        hasPreviousImport={hasPreviousImport}
        changed={preview.changed}
        total={preview.total - preview.deleted}
        label="Persons"
        onImport={onImport}
        onReset={onReset}
        isPending={isPending}
      />
    </>
  );
}

// ---------- Article Preview ----------

function ArticlePreviewSection({
  preview,
  hasPreviousImport,
  onImport,
  onReset,
  isPending,
}: {
  preview: ArticlePreviewResult;
  hasPreviousImport: boolean;
  onImport: (mode: ImportMode) => void;
  onReset: () => void;
  isPending: boolean;
}) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        <SummaryCard label="Total" value={preview.total} />
        <SummaryCard
          label="With Image"
          value={preview.items.filter((i) => i.hasImage).length}
          variant="success"
        />
        <SummaryCard
          label="With Summary"
          value={preview.items.filter((i) => i.hasSummary).length}
        />
        <SummaryCard
          label="Changed"
          value={preview.changed}
          variant={preview.changed > 0 ? "warn" : "default"}
        />
        <SummaryCard label="Unchanged" value={preview.unchanged} />
        <SummaryCard
          label="Warnings"
          value={preview.items.reduce((sum, i) => sum + i.warnings.length, 0)}
          variant={preview.items.some((i) => i.warnings.length > 0) ? "warn" : "default"}
        />
      </div>

      <div className="overflow-x-auto rounded-md border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Status</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Title</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Date</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Author</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Img</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Blocks</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Warnings</th>
            </tr>
          </thead>
          <tbody>
            {preview.items.map((item) => (
              <tr
                key={item.slug}
                className={`border-t border-neutral-200 ${
                  item.changeType === "unchanged" ? "opacity-50" : ""
                } ${item.changeType === "deleted" ? "bg-red-50" : ""}`}
              >
                <td className="px-3 py-2">
                  <ChangeTypePill changeType={item.changeType} />
                </td>
                <td className="max-w-xs truncate px-3 py-2 font-medium text-neutral-900">
                  {item.title}
                </td>
                <td className="px-3 py-2 text-neutral-500">
                  {item.date ? new Date(item.date).toLocaleDateString("no") : "—"}
                </td>
                <td className="max-w-32 truncate px-3 py-2 text-neutral-500">
                  {item.author ?? "—"}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${item.hasImage ? "bg-emerald-500" : "bg-neutral-300"}`}
                  />
                </td>
                <td className="px-3 py-2 text-neutral-500">{item.contentBlockCount}</td>
                <td className="max-w-xs px-3 py-2">
                  {item.warnings.length > 0 && (
                    <details className="text-xs text-amber-700">
                      <summary className="cursor-pointer">
                        {item.warnings.length} warning{item.warnings.length !== 1 ? "s" : ""}
                      </summary>
                      <ul className="mt-1 space-y-0.5">
                        {item.warnings.map((w) => (
                          <li key={w}>{w}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ImportActions
        hasPreviousImport={hasPreviousImport}
        changed={preview.changed}
        total={preview.total - preview.deleted}
        label="Articles"
        onImport={onImport}
        onReset={onReset}
        isPending={isPending}
      />
    </>
  );
}

// ---------- Shared Components ----------

function ImportActions({
  hasPreviousImport,
  changed,
  total,
  label,
  onImport,
  onReset,
  isPending,
}: {
  hasPreviousImport: boolean;
  changed: number;
  total: number;
  label: string;
  onImport: (mode: ImportMode) => void;
  onReset: () => void;
  isPending: boolean;
}) {
  return (
    <div className="flex gap-3">
      {hasPreviousImport && changed > 0 && (
        <Button onClick={() => onImport("incremental")} disabled={isPending} className="flex-1">
          Sync {changed} Changed
        </Button>
      )}
      <Button
        onClick={() => onImport("full")}
        disabled={isPending}
        className="flex-1"
        variant={hasPreviousImport && changed > 0 ? "secondary" : undefined}
      >
        {hasPreviousImport ? "Full Re-import" : "Import"} {total} {label}
      </Button>
      <Button onClick={onReset} variant="secondary">
        Cancel
      </Button>
    </div>
  );
}

function ImportResultSection({ result }: { result: ImportResult | ArticleImportResult | null }) {
  if (!result) return null;

  if (!result.success) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Import failed: {result.error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            result.mode === "incremental"
              ? "bg-blue-100 text-blue-700"
              : "bg-neutral-100 text-neutral-700"
          }`}
        >
          {result.mode === "incremental" ? "Incremental Sync" : "Full Import"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        <SummaryCard label="Total" value={result.total} />
        <SummaryCard label="Created" value={result.created} variant="success" />
        <SummaryCard label="Replaced" value={result.replaced} />
        <SummaryCard label="Skipped" value={result.skipped} />
        <SummaryCard label="Deleted" value={result.deleted} variant="warn" />
        <SummaryCard label="Errors" value={result.errors} variant="error" />
      </div>

      <div className="overflow-x-auto rounded-md border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Slug</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Status</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Image</th>
              <th className="px-3 py-2.5 font-medium text-neutral-600">Details</th>
            </tr>
          </thead>
          <tbody>
            {result.results.map((r) => (
              <tr
                key={r.slug}
                className={`border-t border-neutral-200 ${
                  r.status === "skipped" ? "opacity-50" : ""
                }`}
              >
                <td className="px-3 py-2 font-medium text-neutral-900">{r.slug}</td>
                <td className="px-3 py-2">
                  <StatusPill status={r.status} />
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${r.imageUploaded ? "bg-emerald-500" : "bg-neutral-300"}`}
                  />
                </td>
                <td className="max-w-xs px-3 py-2">
                  {r.error && <p className="text-xs text-red-600">{r.error}</p>}
                  {r.warnings.length > 0 && (
                    <ul className="text-xs text-amber-700">
                      {r.warnings.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number;
  variant?: "default" | "warn" | "success" | "error";
}) {
  const borderColor = {
    default: "border-neutral-200",
    warn: "border-amber-200",
    success: "border-emerald-200",
    error: "border-red-200",
  }[variant];

  const valueColor = {
    default: "text-neutral-900",
    warn: "text-amber-700",
    success: "text-emerald-700",
    error: "text-red-700",
  }[variant];

  return (
    <div className={`rounded-md border bg-white p-4 ${borderColor}`}>
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
}

function ChangeTypePill({
  changeType,
}: {
  changeType: "new" | "updated" | "unchanged" | "deleted";
}) {
  const styles = {
    new: "bg-emerald-100 text-emerald-700",
    updated: "bg-blue-100 text-blue-700",
    unchanged: "bg-neutral-100 text-neutral-500",
    deleted: "bg-red-100 text-red-700",
  }[changeType];

  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}>
      {changeType}
    </span>
  );
}

function StatusPill({
  status,
}: {
  status: "created" | "replaced" | "skipped" | "deleted" | "error";
}) {
  const styles = {
    created: "bg-emerald-100 text-emerald-700",
    replaced: "bg-blue-100 text-blue-700",
    skipped: "bg-neutral-100 text-neutral-500",
    deleted: "bg-red-100 text-red-700",
    error: "bg-red-100 text-red-700",
  }[status];

  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
