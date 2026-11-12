'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';

interface CopyHashButtonProps {
  hash?: string;
  label?: string;
  showText?: boolean;
  className?: string;
}

export function CopyHashButton({
  hash,
  label = 'Copy block hash',
  showText = false,
  className = '',
}: CopyHashButtonProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Guard against undefined, empty, or mock placeholder values
  if (!hash || hash.trim() === '' || hash === '0x992b41f') {
    return null;
  }

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const textToCopy = hash.trim();

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        setCopyStatus('copied');
      } else {
        // Fallback for restricted clipboard contexts
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (!successful) throw new Error('execCommand copy returned false');
        setCopyStatus('copied');
      }

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCopyStatus('idle');
      }, 2000);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
      setCopyStatus('error');
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCopyStatus('idle');
      }, 3000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={
        copyStatus === 'copied'
          ? 'Hash copied to clipboard'
          : copyStatus === 'error'
          ? 'Failed to copy hash'
          : label
      }
      title={
        copyStatus === 'copied'
          ? 'Copied to clipboard!'
          : copyStatus === 'error'
          ? 'Copy failed — manual selection required'
          : label
      }
      className={`inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500 shrink-0 ${
        copyStatus === 'copied'
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          : copyStatus === 'error'
          ? 'bg-rose-100 text-rose-800 border border-rose-300'
          : 'bg-charcoal-100 hover:bg-forest-50 hover:text-forest-900 text-charcoal-600 border border-charcoal-200'
      } ${className}`}
    >
      {copyStatus === 'copied' ? (
        <>
          <Check className="w-3 h-3 text-emerald-700" />
          <span className="font-sans font-bold text-[10px]">Copied</span>
        </>
      ) : copyStatus === 'error' ? (
        <>
          <AlertCircle className="w-3 h-3 text-rose-700" />
          <span className="font-sans font-bold text-[10px]">Failed</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3 text-charcoal-500 hover:text-forest-800" />
          {showText && <span className="font-sans font-medium text-[10px]">Copy</span>}
        </>
      )}
    </button>
  );
}

