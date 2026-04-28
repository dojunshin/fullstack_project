import { FormEvent, useMemo, useState } from 'react';

type ProductItem = {
  id?: string | number;
  productCode?: string | number;
  name?: string;
  productName?: string;
  price?: string | number;
  minPrice?: string | number;
};

type SearchResult = {
  status?: string;
  message?: string;
  data?: SearchResult | ProductItem[];
  items?: ProductItem[];
  results?: ProductItem[];
  [key: string]: unknown;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function normalizeItems(data: SearchResult | null): ProductItem[] {
  if (!data) return [];
  if (Array.isArray(data.data)) return data.data;
  if (data.data && typeof data.data === 'object') {
    return normalizeItems(data.data as SearchResult);
  }
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

export default function App() {
  const [keyword, setKeyword] = useState<string>('노트북');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<SearchResult | null>(null);

  const items = useMemo(() => normalizeItems(result), [result]);

  const onSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${API_BASE}/api/search?q=${encodeURIComponent(keyword)}&page=1&size=10`
      );
      const body: SearchResult = await response.json();

      if (!response.ok) {
        const maybeMessage =
          typeof body.message === 'string' ? body.message : '요청이 실패했습니다.';
        throw new Error(maybeMessage);
      }

      setResult(body);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="card">
        <h1>다나와 Open API 검색</h1>
        <p className="muted">Node.js + React 최신 스택 데모</p>

        <form onSubmit={onSearch} className="search-form">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
          />
          <button type="submit" disabled={loading || !keyword.trim()}>
            {loading ? '검색 중...' : '검색'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {items.length > 0 && (
          <ul className="list">
            {items.map((item, idx) => (
              <li key={item.id || item.productCode || idx}>
                <strong>{item.name || item.productName || '이름 없음'}</strong>
                <span>{item.price || item.minPrice || '-'}원</span>
              </li>
            ))}
          </ul>
        )}

        {result && items.length === 0 && (
          <pre className="raw">{JSON.stringify(result.data ?? result, null, 2)}</pre>
        )}
      </section>
    </main>
  );
}
