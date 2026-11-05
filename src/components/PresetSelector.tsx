'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Preset, ExamCategory } from '@/types';
import { presets } from '@/data/presets';

export interface PresetSelectorProps {
  selectedPreset: Preset | null;
  onSelect: (preset: Preset | null) => void;
  initialPresetId?: string;
  className?: string;
}

const CATEGORY_LABELS: Record<ExamCategory | string, string> = {
  ssc: 'SSC (Staff Selection Commission)',
  banking: 'Banking (IBPS, SBI, RBI)',
  railway: 'Railway (RRB)',
  nta: 'NTA (JEE, NEET, CUET, UGC NET)',
  upsc: 'UPSC (Civil Services, NDA, CDS)',
  state: 'State PSC & Police Exams',
  identity: 'Identity & Standard Documents',
  other: 'Other Government Exams',
};

const CATEGORY_ORDER: (ExamCategory | string)[] = [
  'ssc',
  'banking',
  'railway',
  'nta',
  'upsc',
  'state',
  'identity',
  'other',
];

function getDocIcon(type: string): string {
  switch (type) {
    case 'signature':
      return '✍️';
    case 'thumb':
      return '👆';
    case 'photo':
    default:
      return '📷';
  }
}

export function PresetSelector({
  selectedPreset,
  onSelect,
  initialPresetId,
  className = '',
}: PresetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Initialize with initialPresetId if provided and not already selected
  useEffect(() => {
    if (initialPresetId && (!selectedPreset || selectedPreset.id !== initialPresetId)) {
      const match = presets.find(
        (p) => p.id === initialPresetId || p.slug === initialPresetId
      );
      if (match) {
        onSelect(match);
      }
    }
  }, [initialPresetId, onSelect, selectedPreset]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter presets based on search query
  const filteredPresets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return presets;

    return presets.filter((p) => {
      const matchExam = p.examName.toLowerCase().includes(q);
      const matchShort = p.examShortName.toLowerCase().includes(q);
      const matchOrg = p.organization.toLowerCase().includes(q);
      const matchDoc = p.documentType.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchNotes = p.notes?.toLowerCase().includes(q);
      const matchDimensions = `${p.width}x${p.height}`.includes(q) || `${p.width} × ${p.height}`.includes(q);
      const matchSize = `${p.minKB}-${p.maxKB}`.includes(q) || `${p.maxKB}kb`.includes(q);

      return (
        matchExam ||
        matchShort ||
        matchOrg ||
        matchDoc ||
        matchCat ||
        matchNotes ||
        matchDimensions ||
        matchSize
      );
    });
  }, [searchQuery]);

  // Group filtered presets by category in designated order
  const groupedPresets = useMemo(() => {
    const map = new Map<string, Preset[]>();

    for (const preset of filteredPresets) {
      const cat = preset.category || 'other';
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(preset);
    }

    // Sort categories according to CATEGORY_ORDER
    const result: { category: string; label: string; presets: Preset[] }[] = [];
    for (const cat of CATEGORY_ORDER) {
      if (map.has(cat) && map.get(cat)!.length > 0) {
        result.push({
          category: cat,
          label: CATEGORY_LABELS[cat] || cat.toUpperCase(),
          presets: map.get(cat)!,
        });
        map.delete(cat);
      }
    }

    // Append any extra categories not in order
    for (const [cat, items] of map.entries()) {
      if (items.length > 0) {
        result.push({
          category: cat,
          label: CATEGORY_LABELS[cat] || cat.toUpperCase(),
          presets: items,
        });
      }
    }

    return result;
  }, [filteredPresets]);

  // Flat list for keyboard navigation: Index 0 is "Custom", followed by filtered presets
  const flatOptions = useMemo(() => {
    return [null, ...filteredPresets]; // null represents 'Custom'
  }, [filteredPresets]);

  const handleSelectPreset = (preset: Preset | null) => {
    onSelect(preset);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < flatOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : flatOptions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < flatOptions.length) {
          handleSelectPreset(flatOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <label
        id="preset-selector-label"
        className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2"
      >
        Choose Exam Specification
      </label>

      {/* Trigger Button / Selected View */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="preset-selector-label"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between min-h-[52px] px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none rounded-xl shadow-sm text-left transition-all"
      >
        {selectedPreset ? (
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <span className="text-2xl shrink-0" aria-hidden="true">
              {getDocIcon(selectedPreset.documentType)}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 dark:text-white truncate">
                  {selectedPreset.examShortName} {selectedPreset.documentType.toUpperCase()}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {selectedPreset.format.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {selectedPreset.width} × {selectedPreset.height} px • {selectedPreset.minKB}–{selectedPreset.maxKB} KB • {selectedPreset.organization}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">
              ⚙️
            </span>
            <div>
              <span className="font-semibold text-gray-900 dark:text-white block">
                Custom Dimensions &amp; Size
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enter your own width, height, min/max KB manually
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pl-2 text-gray-400 dark:text-gray-500 shrink-0">
          <span className="text-xs font-medium hidden sm:inline text-blue-600 dark:text-blue-400">
            Change
          </span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden focus:outline-none"
          onKeyDown={handleKeyDown}
        >
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-850">
            <div className="relative">
              <svg
                className="w-4 h-4 absolute left-3 top-3 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder="Search exam (e.g. SSC CGL, IBPS, UPSC, 20-50 KB)..."
                className="w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                role="searchbox"
                aria-label="Search exam presets"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div
            ref={listRef}
            role="listbox"
            className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/60"
          >
            {/* Custom Manual Option */}
            <div
              role="option"
              aria-selected={selectedPreset === null}
              tabIndex={0}
              onClick={() => handleSelectPreset(null)}
              className={`p-3 cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                selectedPreset === null
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-900 dark:text-gray-100'
              } ${highlightedIndex === 0 ? 'ring-2 ring-inset ring-blue-500' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl" aria-hidden="true">⚙️</span>
                <div>
                  <div className="font-semibold text-sm">
                    Custom Dimensions &amp; Size
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Set custom pixel width, height, and target KB
                  </div>
                </div>
              </div>
              {selectedPreset === null && (
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>

            {/* Presets by Group */}
            {groupedPresets.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No matching exams found for &ldquo;{searchQuery}&rdquo;.
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(null)}
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-xs"
                  >
                    Use Custom Settings instead
                  </button>
                </div>
              </div>
            ) : (
              groupedPresets.map((group) => (
                <div key={group.category} className="py-2">
                  <div className="px-3 py-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50/80 dark:bg-gray-900/40">
                    {group.label} ({group.presets.length})
                  </div>
                  {group.presets.map((preset) => {
                    const isSelected = selectedPreset?.id === preset.id;
                    const flatIdx = flatOptions.findIndex((p) => p?.id === preset.id);
                    const isHighlighted = highlightedIndex === flatIdx;

                    return (
                      <div
                        key={preset.id}
                        role="option"
                        aria-selected={isSelected}
                        tabIndex={0}
                        onClick={() => handleSelectPreset(preset)}
                        className={`px-4 py-2.5 cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-100 font-medium'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700/60 text-gray-900 dark:text-gray-100'
                        } ${isHighlighted ? 'ring-2 ring-inset ring-blue-500' : ''}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xl shrink-0" aria-hidden="true">
                            {getDocIcon(preset.documentType)}
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">
                              {preset.examShortName} {preset.documentType.toUpperCase()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {preset.width}×{preset.height} px, {preset.minKB}-{preset.maxKB} KB • {preset.format.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PresetSelector;
