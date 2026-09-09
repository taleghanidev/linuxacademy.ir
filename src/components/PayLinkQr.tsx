"use client";

import { ExternalLink } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

/**
 * A payment option shown as both a button and a QR code. The QR is drawn from
 * the URL at render time rather than stored as an image, so changing the link
 * in config is enough and there is no stale picture to replace.
 */
export default function PayLinkQr({
  href,
  label,
  scanLabel,
  amount,
}: {
  href: string;
  label: string;
  scanLabel: string;
  /** Shown on the card. A Wisetag link carries no amount, so the payer needs
   *  to read it here before they type it in. */
  amount?: string;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(href, { margin: 1, width: 320, errorCorrectionLevel: "M" })
      .then((u) => {
        if (alive) setDataUrl(u);
      })
      .catch(() => {
        // A missing QR is not fatal; the link below still works.
      });
    return () => {
      alive = false;
    };
  }, [href]);

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 text-center">
      <span className="font-semibold text-gray-900">{label}</span>
      {dataUrl ? (
        <img src={dataUrl} alt={`${label} QR`} className="h-36 w-36 rounded-lg" />
      ) : (
        <div className="h-36 w-36 animate-pulse rounded-lg bg-gray-100" />
      )}
      {amount && (
        <span className="rounded-full bg-brand-purple/10 px-3 py-1 text-sm font-bold text-brand-purple">
          {amount}
        </span>
      )}
      <span className="text-xs text-gray-500">{scanLabel}</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md bg-brand-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-purple-dark"
      >
        <ExternalLink className="h-4 w-4" />
        {label}
      </a>
    </div>
  );
}
