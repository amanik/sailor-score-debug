"use client";

import { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTransactionStore } from "@/stores/transactions";
import { useBucketStore } from "@/stores/buckets";
import { useAccountStore } from "@/stores/accounts";
import {
  parseTransactionsCsv,
  parseBucketsCsv,
  parseAccountsCsv,
} from "@/lib/csv-parser";

type DataType = "transactions" | "buckets" | "accounts";

interface UploadState {
  readonly file: File | null;
  readonly preview: string | null;
  readonly errors: readonly string[];
  readonly count: number;
}

const EMPTY_UPLOAD: UploadState = {
  file: null,
  preview: null,
  errors: [],
  count: 0,
};

interface CsvUploadDialogProps {
  readonly children: React.ReactNode;
}

export function CsvUploadDialog({ children }: CsvUploadDialogProps) {
  const [activeTab, setActiveTab] = useState<DataType>("transactions");
  const [uploads, setUploads] = useState<Record<DataType, UploadState>>({
    transactions: EMPTY_UPLOAD,
    buckets: EMPTY_UPLOAD,
    accounts: EMPTY_UPLOAD,
  });
  const [loaded, setLoaded] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    setUploads({
      transactions: EMPTY_UPLOAD,
      buckets: EMPTY_UPLOAD,
      accounts: EMPTY_UPLOAD,
    });
    setLoaded(false);
    setResetConfirm(false);
    setActiveTab("transactions");
  }, []);

  const handleFileSelect = useCallback(
    async (type: DataType, file: File) => {
      const text = await file.text();

      let count = 0;
      let errors: readonly string[] = [];

      switch (type) {
        case "transactions": {
          const result = parseTransactionsCsv(text);
          count = result.data.length;
          errors = result.errors;
          break;
        }
        case "buckets": {
          const result = parseBucketsCsv(text);
          count = result.data.length;
          errors = result.errors;
          break;
        }
        case "accounts": {
          const result = parseAccountsCsv(text);
          count = result.data.length;
          errors = result.errors;
          break;
        }
      }

      setUploads((prev) => ({
        ...prev,
        [type]: {
          file,
          preview: `Found ${count} ${type}`,
          errors,
          count,
        },
      }));
    },
    []
  );

  const handleLoad = useCallback(async () => {
    // Load accounts first (transactions/buckets reference them)
    if (uploads.accounts.file) {
      const text = await uploads.accounts.file.text();
      const result = parseAccountsCsv(text);
      useAccountStore.getState().setAccounts(result.data);
    }

    if (uploads.transactions.file) {
      const text = await uploads.transactions.file.text();
      const result = parseTransactionsCsv(text);
      useTransactionStore.getState().setTransactions(result.data);
    }

    if (uploads.buckets.file) {
      const text = await uploads.buckets.file.text();
      const result = parseBucketsCsv(text);
      useBucketStore.getState().setBuckets(result.data);
    }

    setLoaded(true);
  }, [uploads]);

  const handleReset = useCallback(() => {
    useTransactionStore.getState().resetToDefaults();
    useBucketStore.getState().resetToDefaults();
    useAccountStore.getState().resetToDefaults();
    setResetConfirm(false);
    resetForm();
  }, [resetForm]);

  const hasAnyFile =
    uploads.transactions.file ||
    uploads.buckets.file ||
    uploads.accounts.file;

  const hasAnyErrors =
    uploads.transactions.errors.length > 0 ||
    uploads.buckets.errors.length > 0 ||
    uploads.accounts.errors.length > 0;

  const tabs: readonly { readonly key: DataType; readonly label: string }[] = [
    { key: "transactions", label: "Transactions" },
    { key: "buckets", label: "Buckets" },
    { key: "accounts", label: "Accounts" },
  ];

  const currentUpload = uploads[activeTab];

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) resetForm();
      }}
    >
      <DialogTrigger render={<>{children}</>} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Load Customer Data</DialogTitle>
          <DialogDescription>
            Upload CSV files to load transaction, bucket, and account data.
          </DialogDescription>
        </DialogHeader>

        {/* Tab bar */}
        <div className="flex gap-1 rounded-lg bg-bg-secondary p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors ${
                activeTab === tab.key
                  ? "bg-bg-primary text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {tab.label}
              {uploads[tab.key].count > 0 && (
                <span className="ml-1 text-[9px] opacity-60">
                  ({uploads[tab.key].count})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Upload area */}
        <div className="flex flex-col gap-3">
          <div
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border-secondary bg-bg-secondary p-6 text-center transition-colors hover:border-border-brand cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(activeTab, file);
                e.target.value = "";
              }}
            />
            <span className="text-2xl">
              {currentUpload.file ? "✅" : "📄"}
            </span>
            {currentUpload.file ? (
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-text-primary">
                  {currentUpload.file.name}
                </p>
                <p className="text-xs text-text-tertiary">
                  {currentUpload.preview}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-text-primary">
                  Click to upload {activeTab} CSV
                </p>
                <p className="text-[10px] text-text-tertiary">
                  .csv files only
                </p>
              </div>
            )}
          </div>

          {/* Validation errors */}
          {currentUpload.errors.length > 0 && (
            <div className="rounded-lg bg-bg-error-secondary p-3">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-error-primary">
                Warnings ({currentUpload.errors.length})
              </p>
              <div className="flex max-h-24 flex-col gap-0.5 overflow-y-auto">
                {currentUpload.errors.slice(0, 10).map((err, i) => (
                  <p key={i} className="text-[11px] text-text-error-primary">
                    {err}
                  </p>
                ))}
                {currentUpload.errors.length > 10 && (
                  <p className="text-[11px] text-text-error-primary opacity-60">
                    ... and {currentUpload.errors.length - 10} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex w-full flex-col gap-2">
            {loaded ? (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-utility-green-50 py-3 text-sm font-semibold text-utility-green-700">
                <span>✅</span> Data loaded successfully
              </div>
            ) : (
              <Button
                disabled={!hasAnyFile}
                onClick={handleLoad}
                className="w-full"
              >
                Load Data
                {hasAnyErrors && " (with warnings)"}
              </Button>
            )}

            {/* Reset */}
            {resetConfirm ? (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleReset}
                  className="flex-1"
                >
                  Confirm Reset
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setResetConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setResetConfirm(true)}
                className="text-[11px] text-text-tertiary hover:text-text-secondary transition-colors"
              >
                Reset to demo data
              </button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
