'use client';

import React, { useState, useRef, useCallback } from 'react';
import { compressPdf } from '@/lib/pdf-compressor';
import { formatFileSize } from '@/lib/utils';

export function PdfCompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [targetKB, setTargetKB] = useState<number>(200);
  const [customTarget, setCustomTarget] = useState<string>('200');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<{ blob: Blob; sizeKB: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presetSizes = [100, 200, 300, 500];

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF file.');
      return;
    }
    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('File size exceeds 25 MB limit. Please select a smaller PDF.');
      return;
    }
    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      // Small timeout for browser to render spinner
      await new Promise((r) => setTimeout(r, 60));
      const res = await compressPdf(file, targetKB);
      if ('error' in res) {
        setError(res.error);
      } else {
        setResult(res);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during PDF compression.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const downloadName = `${baseName}-under-${targetKB}kb.pdf`;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-850 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
      {/* Privacy Guarantee Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-4 sm:px-6 py-3 flex items-center justify-between text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="text-base">🔒</span>
          <span>100% Client-Side — Your PDF never leaves your phone or computer</span>
        </div>
        <span className="hidden md:inline-block bg-white/20 backdrop-blur px-2.5 py-0.5 rounded-full text-xs font-semibold">
          No Server Upload
        </span>
      </div>

      <div className="p-4 sm:p-8 space-y-6">
        {/* Step 1: Target Size Selector */}
        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
            Target Maximum File Size
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {presetSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setTargetKB(size);
                  setCustomTarget(size.toString());
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
                  targetKB === size
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/25'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750'
                }`}
              >
                Under {size} KB
              </button>
            ))}

            <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
              <span className="text-xs text-gray-500 dark:text-gray-400">Custom:</span>
              <div className="relative">
                <input
                  type="number"
                  min="20"
                  max="5000"
                  value={customTarget}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setCustomTarget(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      setTargetKB(val);
                    }
                  }}
                  className="w-20 px-2 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500"
                  aria-label="Custom target size in kilobytes"
                />
                <span className="text-xs text-gray-400 ml-1">KB</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Most exam forms (UPSC, State PSC, SSC certificates) require document PDFs under 200 KB or 300 KB.
          </p>
        </div>

        {/* Step 2: PDF Upload Zone */}
        {!file && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Drop your PDF here, or <span className="text-blue-600 dark:text-blue-400 underline">browse</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supports scanned marksheets, caste certificates, IDs up to 25 MB
            </p>
          </div>
        )}

        {/* Selected File Details & Compress Action */}
        {file && !result && (
          <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black">PDF</span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Current size: {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-2"
              >
                Change File
              </button>
            </div>

            <button
              type="button"
              onClick={handleCompress}
              disabled={isProcessing}
              className="w-full min-h-[54px] px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Compressing PDF in browser...</span>
                </>
              ) : (
                <>
                  <span>⚡ Compress PDF to under {targetKB} KB</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 text-sm space-y-2"
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-bold">Compression Result</p>
                <p className="text-xs sm:text-sm mt-1 text-red-800 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Compression Result Preview */}
        {result && file && (
          <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold mb-3">
                <span className="text-xl">✅</span>
                <span>PDF Successfully Compressed!</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center py-2">
                <div className="p-3 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-emerald-100 dark:border-emerald-900/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Original Size</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-100/60 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">New Compressed Size</p>
                  <p className="text-xl font-black text-emerald-700 dark:text-emerald-200">
                    {result.sizeKB} KB
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 min-h-[50px] px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Download Compressed PDF</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-3.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm transition-colors"
              >
                Compress Another PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default PdfCompressTool;

