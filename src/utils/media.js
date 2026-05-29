// Utility to normalize image URLs returned from backend
// If backend returns a relative path like `/uploads/...`, this prefixes
// it with the API base (strips trailing /api if present).
function stripApiSuffix(apiUrl) {
  if (!apiUrl) return apiUrl;
  return apiUrl.replace(/\/api\/?$/, '');
}

export function resolveImageUrl(image) {
  if (!image) return null;

  let url = typeof image === 'string' ? image : image.url || image.path || image.src || String(image);
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;

  const api = (process.env.REACT_APP_API_URL || 'http://127.0.0.1:10000/api').trim();
  const base = stripApiSuffix(api);
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
}

