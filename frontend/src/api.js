const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export async function apiRequest(path, options = {}) {
  const { token, headers: requestHeaders, body, ...requestOptions } = options;
  const headers = new Headers(requestHeaders || {});
  headers.set('Accept', 'application/json');

  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (body !== undefined && !(body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers,
    body,
  });
  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error('The server returned an invalid response.');
    }
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status}).`);
  }

  return data;
}
