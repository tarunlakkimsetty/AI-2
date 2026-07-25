// Copies arbitrary text to the clipboard. Returns a boolean success flag.
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// Triggers a browser download of `content` as a file named `filename`.
export function downloadAsFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Convenience wrapper for downloading a full project result as JSON
export function downloadResultAsJson(result, title = 'video-project') {
  downloadAsFile(JSON.stringify(result, null, 2), `${slugify(title)}.json`, 'application/json');
}

// Convenience wrapper for downloading a full project result as a readable TXT
export function downloadResultAsTxt(result, title = 'video-project') {
  const lines = [
    `TITLE: ${result.title}`,
    '',
    `HOOK: ${result.hook}`,
    '',
    `INTRODUCTION: ${result.introduction}`,
    '',
    `SCRIPT:\n${result.script}`,
    '',
    `VOICE OVER:\n${result.voiceOver}`,
    '',
    `SUMMARY: ${result.summary}`,
    '',
    `CALL TO ACTION: ${result.callToAction}`,
    '',
    `DURATION: ${result.duration}`,
    `MUSIC SUGGESTION: ${result.musicSuggestion}`,
    `THUMBNAIL PROMPT: ${result.thumbnailPrompt}`,
    '',
    `SUBTITLE:\n${result.subtitle}`,
    '',
    'SCENES:',
    ...(result.scenes || []).map(
      (s) => `  Scene ${s.scene} - ${s.title} [${s.duration}]\n    Visual: ${s.visual}\n    Notes: ${s.description}`
    ),
    '',
    'SEO:',
    `  Title: ${result.seo?.title}`,
    `  Description: ${result.seo?.description}`,
    `  Keywords: ${(result.seo?.keywords || []).join(', ')}`,
    `  Tags: ${(result.seo?.tags || []).join(', ')}`,
    '',
    'CAPTIONS:',
    `  YouTube: ${result.captions?.youtube}`,
    `  Instagram: ${result.captions?.instagram}`,
    `  LinkedIn: ${result.captions?.linkedin}`,
    `  Twitter: ${result.captions?.twitter}`,
    `  Facebook: ${result.captions?.facebook}`,
    '',
    'B-ROLL IDEAS:',
    ...(result.brollIdeas || []).map((idea) => `  - ${idea}`)
  ];
  downloadAsFile(lines.join('\n'), `${slugify(title)}.txt`, 'text/plain');
}

function slugify(text) {
  return (text || 'video-project')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
}
