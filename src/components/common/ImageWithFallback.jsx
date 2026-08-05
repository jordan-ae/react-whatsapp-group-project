import { useState } from 'react';
import './ImageWithFallback.css';

/**
 * An <img> that degrades gracefully instead of showing a broken-image icon.
 *
 * Use this anywhere you render an image whose URL comes from data rather than
 * from your own JSX — status items, message attachments, uploaded avatars.
 *
 * Props are the same as <img> plus:
 *   fallbackLabel  text shown (and announced to screen readers) when the image
 *                  can't load. Defaults to "Image unavailable".
 */
export default function ImageWithFallback({
  src,
  alt = '',
  className = '',
  fallbackLabel = 'Image unavailable',
  ...rest
}) {
  // Store *which* src failed rather than a plain boolean. If the parent later
  // passes a different src, `failed` becomes false again automatically — no
  // useEffect needed to reset it.
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = !src || failedSrc === src;

  if (failed) {
    return (
      <div
        className={`image-fallback ${className}`}
        role="img"
        aria-label={fallbackLabel}
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
        <span className="image-fallback__label">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      {...rest}
    />
  );
}
