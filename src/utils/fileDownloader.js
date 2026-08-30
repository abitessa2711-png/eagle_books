/**
 * Universal File Saver / Downloader for Web Browsers & Android Native Mobile Apps
 */
export async function downloadFileUniversal(blobOrDataUrl, filename, mimeType = 'application/octet-stream') {
  try {
    const isCapacitor = window.Capacitor?.isNativePlatform() || window.location.protocol === 'captcha:' || window.location.protocol === 'file:';

    let blob;
    let dataUrl;

    if (typeof blobOrDataUrl === 'string') {
      dataUrl = blobOrDataUrl;
      const res = await fetch(dataUrl);
      blob = await res.blob();
    } else {
      blob = blobOrDataUrl;
      dataUrl = URL.createObjectURL(blob);
    }

    const file = new File([blob], filename, { type: mimeType });

    // 1. Try Native Android / iOS Web Share API (Works 100% on Android Mobile Apps / Capacitor!)
    if (isCapacitor || (navigator.canShare && navigator.canShare({ files: [file] }))) {
      try {
        await navigator.share({
          files: [file],
          title: filename,
          text: `EAGLE SILVERS - ${filename}`
        });
        return { success: true, method: 'share' };
      } catch (shareErr) {
        if (shareErr.name === 'AbortError') {
          return { success: true, method: 'cancelled' };
        }
        console.warn('Native share error or fallback:', shareErr);
      }
    }

    // 2. Standard Browser File Saver Fallback
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      if (typeof blobOrDataUrl !== 'string') {
        URL.revokeObjectURL(dataUrl);
      }
    }, 2000);

    return { success: true, method: 'download' };
  } catch (err) {
    console.error('Universal download error:', err);
    // Emergency Fallback: Open in new tab
    try {
      const fallbackUrl = typeof blobOrDataUrl === 'string' ? blobOrDataUrl : URL.createObjectURL(blobOrDataUrl);
      window.open(fallbackUrl, '_blank');
    } catch (e) {}
    return { success: false, error: err };
  }
}
