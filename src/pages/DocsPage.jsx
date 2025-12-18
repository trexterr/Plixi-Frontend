import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DOCS_SECTIONS } from '../docsData';
import DocsSidebar from '../components/DocsSidebar';
import DocsSearchResults from '../components/DocsSearchResults';
import DocsArticle from '../components/DocsArticle';

const SECTION_SLUGS = DOCS_SECTIONS.map((section) => section.slug);
const DEFAULT_SECTION_SLUG = DOCS_SECTIONS[0].slug;

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
  const navigate = useNavigate();
  const { sectionSlug } = useParams();
  const [query, setQuery] = useState('');
  const [activePageSlug, setActivePageSlug] = useState(DOCS_SECTIONS[0].pages[0].slug);
  const sidebarRef = useRef(null);
  const pendingScrollRef = useRef(null);
  const allPages = useMemo(() => flattenPages(), []);
  const pageRefs = useMemo(() => {
    const refs = {};
    DOCS_SECTIONS.forEach((section) => {
      section.pages.forEach((page) => {
        refs[page.slug] = refs[page.slug] || createRef();
      });
    });
    return refs;
  }, []);

  const resolvedSectionSlug = SECTION_SLUGS.includes(sectionSlug ?? '') ? sectionSlug : DEFAULT_SECTION_SLUG;
  const activeSection =
    DOCS_SECTIONS.find((section) => section.slug === resolvedSectionSlug) || DOCS_SECTIONS[0];

  useEffect(() => {
    if (sectionSlug && !SECTION_SLUGS.includes(sectionSlug)) {
      navigate('/docs', { replace: true });
    }
  }, [sectionSlug, navigate]);

  useEffect(() => {
    if (!activeSection.pages.some((page) => page.slug === activePageSlug)) {
      setActivePageSlug(activeSection.pages[0].slug);
    }
  }, [activePageSlug, activeSection]);

  const filteredPages = useMemo(() => {
    if (!query.trim()) return allPages;
    const lower = query.toLowerCase();
    return allPages.filter((page) => page.searchContent?.includes(lower));
  }, [allPages, query]);

  useEffect(() => {
    if (query.trim()) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries
          .filter((item) => item.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (entry?.target?.id) {
          setActivePageSlug((prev) => (prev === entry.target.id ? prev : entry.target.id));
        }
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: 0.25 },
    );

    activeSection.pages.forEach((page) => {
      const node = pageRefs[page.slug]?.current;
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, [activeSection, pageRefs, query]);

  useEffect(() => {
    if (!pendingScrollRef.current) return;
    const slug = pendingScrollRef.current;
    const node = pageRefs[slug]?.current;
    if (!node) return;
    requestAnimationFrame(() => {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      node.focus?.();
      pendingScrollRef.current = null;
    });
  }, [resolvedSectionSlug, pageRefs]);

  useEffect(() => {
    if (!sidebarRef.current) return;
    const activeButton = sidebarRef.current.querySelector('.docs-nav__group li button.is-active');
    if (activeButton) {
      activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activePageSlug, resolvedSectionSlug]);

  const navigateToSection = (slug) => {
    if (slug === resolvedSectionSlug) return;
    navigate(slug === DEFAULT_SECTION_SLUG ? '/docs' : `/docs/${slug}`);
  };

  const handleSectionChange = (slug) => {
    setQuery('');
    navigateToSection(slug);
  };

  const scrollToPage = (slug) => {
    const targetPage = allPages.find((page) => page.slug === slug);
    if (!targetPage) return;
    setQuery('');
    setActivePageSlug(slug);
    pendingScrollRef.current = slug;
    const targetSectionSlug = targetPage.sectionSlug;
    if (targetSectionSlug !== resolvedSectionSlug) {
      navigate(targetSectionSlug === DEFAULT_SECTION_SLUG ? '/docs' : `/docs/${targetSectionSlug}`);
    } else {
      requestAnimationFrame(() => {
        const node = pageRefs[slug]?.current;
        if (node) {
          node.scrollIntoView({ behavior: 'smooth', block: 'start' });
          node.focus?.();
          pendingScrollRef.current = null;
        }
      });
    }
  };

  return (
    <div className="docs-layout">
      <DocsSidebar
        ref={sidebarRef}
        sections={DOCS_SECTIONS}
        activeSlug={activePageSlug}
        activeSectionSlug={resolvedSectionSlug}
        onSelect={scrollToPage}
        onSectionChange={handleSectionChange}
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
            <section key={activeSection.slug} id={activeSection.slug} className="docs-section is-active">
              <header>
                <p className="eyebrow">{activeSection.title}</p>
                <h2>{activeSection.intro}</h2>
              </header>
              <div className="docs-section__pages">
                {activeSection.pages.map((page) => (
                  <article
                    key={page.slug}
                    id={page.slug}
                    ref={pageRefs[page.slug]}
                    className="docs-page-card"
                    tabIndex={-1}
                  >
                    <DocsArticle page={{ ...page, section: activeSection.title }} showRelated={false} />
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
