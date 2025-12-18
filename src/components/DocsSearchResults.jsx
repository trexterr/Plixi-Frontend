export default function DocsSearchResults({ query, results, onSelect }) {
  return (
    <div className="docs-search-results">
      <h2>{query ? `Results for “${query}”` : 'Browse the library'}</h2>
      <div className="docs-results-grid">
        {results.length ? (
          results.map((page) => (
            <article key={page.slug} onClick={() => onSelect(page.slug)}>
              <p className="eyebrow">{page.section}</p>
              <h3>{page.title}</h3>
              <p>{page.summary}</p>
            </article>
          ))
        ) : (
          <p className="helper-text">No pages match that search yet. Try different keywords.</p>
        )}
      </div>
    </div>
  );
}
