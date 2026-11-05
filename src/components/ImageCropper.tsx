'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { CropArea } from '@/types';

export interface ImageCropperProps {
  image: string;
  aspectRatio: number;
  onCropComplete: (area: CropArea) => void;
  className?: string;
}

interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ImageCropper({
  image,
  aspectRatio,
  onCropComplete,
  className = '',
}: ImageCropperProps) {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  const handleCropComplete = useCallback(
    (_croppedArea: unknown, croppedAreaPixels: PixelCrop) => {
      onCropComplete({
        x: Math.round(croppedAreaPixels.x),
        y: Math.round(croppedAreaPixels.y),
        width: Math.round(croppedAreaPixels.width),
        height: Math.round(croppedAreaPixels.height),
      });
    },
    [onCropComplete]
  );

  const handleZoomIn = () => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(2)));

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      {/* Cropper Container */}
      <div className="relative w-full h-72 sm:h-96 bg-gray-900 rounded-2xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-800">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio > 0 ? aspectRatio : 1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          showGrid={true}
          classes={{
            containerClassName: 'reactEasyCrop_Container',
          }}
        />

        {/* Floating guidance overlay */}
        <div className="absolute top-3 left-3 right-3 flex justify-between pointer-events-none">
          <span className="bg-black/60 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full font-medium">
            Drag to position
          </span>
          <span className="bg-black/60 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full font-medium">
            Ratio: {aspectRatio.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="w-full max-w-md mt-4 px-2 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          aria-label="Zoom out"
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <div className="flex-1 flex items-center gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium shrink-0">
            Zoom
          </span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.05}
            aria-label="Image zoom level"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          />
          <span className="text-xs font-mono text-gray-600 dark:text-gray-300 w-9 text-right shrink-0">
            {zoom.toFixed(1)}x
          </span>
        </div>

        <button
          type="button"
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          aria-label="Zoom in"
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ImageCropper;
