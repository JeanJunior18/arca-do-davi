const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export interface LinkMetadata {
  name?: string;
  description?: string;
  imageUrl?: string;
}

export async function fetchOpenGraphMetadata(url: string): Promise<LinkMetadata> {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('Link inválido — use um endereço http(s).');
  }

  const response = await fetch(parsedUrl, { headers: { 'User-Agent': BROWSER_USER_AGENT } });
  if (!response.ok) {
    throw new Error(`Não foi possível acessar esse link (HTTP ${response.status}).`);
  }

  const html = await response.text();

  return {
    name: extractMetaContent(html, 'og:title') ?? extractTitleTag(html),
    description: extractMetaContent(html, 'og:description') ?? extractMetaContent(html, 'description'),
    imageUrl: extractMetaContent(html, 'og:image'),
  };
}

function extractMetaContent(html: string, key: string): string | undefined {
  const propertyFirst = new RegExp(
    `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`,
    'i',
  );
  const contentFirst = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`,
    'i',
  );
  const match = html.match(propertyFirst) ?? html.match(contentFirst);
  return match ? decodeHtmlEntities(match[1]) : undefined;
}

function extractTitleTag(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? decodeHtmlEntities(match[1].trim()) : undefined;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
