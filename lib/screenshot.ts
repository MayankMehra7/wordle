import html2canvas from 'html2canvas';

export async function captureScreenshot(elementId: string): Promise<Blob | null> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found');
      return null;
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#111827',
      scale: 2,
      logging: false,
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
}

export function downloadScreenshot(blob: Blob, filename: string = 'wordle-result.png') {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function shareScreenshot(blob: Blob) {
  if (navigator.share && navigator.canShare) {
    try {
      const file = new File([blob], 'wordle-result.png', { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Wordle Result',
          text: 'Check out my Wordle result!',
        });
        return true;
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }
  return false;
}
