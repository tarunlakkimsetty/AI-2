import { useState } from 'react';
import { copyToClipboard } from '../utils/download';

export default function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(text || '');
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <button
      type="button"
      className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-secondary'} ${className}`}
      onClick={handleCopy}
      title="Copy to clipboard"
    >
      <i className={`bi ${copied ? 'bi-check2' : 'bi-clipboard'} me-1`}></i>
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
