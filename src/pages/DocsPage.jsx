import { createRef, useMemo, useState } from 'react';
import { DOCS_SECTIONS } from '../docsData';
import DocsSidebar from '../components/DocsSidebar';
import DocsSearchResults from '../components/DocsSearchResults';
import DocsArticle from '../components/DocsArticle';

const flattenPages = () =>
  DOCS_SECTIONS.flatMap((section) =>
    section.pages.map((page) => {
      const contentChunks = [];
      (page.body ?? []).forEach((block) => {
        if (!block) return;
        if (typeof block === 'string') {
          contentChunks.push(block);
          return;
        }
        switch (block.type) {
          case 'paragraph':
          case 'heading':
            contentChunks.push(block.text);
            break;
          case 'list':
            contentChunks.push(...(block.items || []));
            break;
          case 'callout':
            contentChunks.push(block.title, block.body);
            break;
          case 'code':
            contentChunks.push(block.content);
            break;
          case 'table':
            contentChunks.push(...(block.headers || []), ...((block.rows || []).flat()));
            break;
          default:
            break;
        }
      });

      return {
        ...page,
        section: section.title,
        sectionSlug: section.slug,
        searchContent: [page.title, page.summary, ...(page.keywords || []), ...contentChunks].join(' ').toLowerCase(),
      };
    }),
  );

export default function DocsPage() {
  const [query, setQuery] = useState('');
  const [activePageSlug, setActivePageSlug] = useState(DOCS_SECTIONS[0].pages[0].slug);
  const allPages = useMemo(() => flattenPages(), []);
  const pageRefs = useMemo(() => {
    const refs = {};
    allPages.forEach((page) => {
      refs[page.slug] = refs[page.slug] || createRef();
    });
    return refs;
  }, [allPages]);
  const filteredPages = useMemo(() => {
    if (!query.trim()) return allPages;
    const lower = query.toLowerCase();
    return allPages.filter((page) => page.searchContent?.includes(lower));
  }, [allPages, query]);

  const scrollToPage = (slug) => {
    setActivePageSlug(slug);
    setQuery('');
    requestAnimationFrame(() => {
      const target = pageRefs[slug]?.current;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus?.();
      }
    });
  };

  return (
    <div className="docs-layout">
      <DocsSidebar
        sections={DOCS_SECTIONS}
        activeSlug={activePageSlug}
        onSelect={scrollToPage}
        query={query}
        onQueryChange={setQuery}
      />
      <main>
        <header className="docs-heading">
          <p className="eyebrow">Documentation</p>
          <h1>Documentation</h1>
          <p className="docs-heading__summary">Everything you need to configure Plixi, from onboarding to legal.</p>
        </header>
        {query ? (
          <DocsSearchResults query={query} results={filteredPages} onSelect={scrollToPage} />
        ) : (
          <div className="docs-collection">
            {DOCS_SECTIONS.map((section) => (
              <section key={section.slug} id={section.slug} className="docs-section">
                <header>
                  <p className="eyebrow">{section.title}</p>
                  <h2>{section.intro}</h2>
                </header>
                <div className="docs-section__pages">
                  {section.pages.map((page) => {
                    const enrichedPage = { ...page, section: section.title };
                    return (
                      <article
                        key={page.slug}
                        id={page.slug}
                        ref={pageRefs[page.slug]}
                        className="docs-page-card"
                        tabIndex={-1}
                      >
                        <DocsArticle page={enrichedPage} showRelated={false} />
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
