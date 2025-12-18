import { forwardRef, useEffect, useMemo, useState } from 'react';

const DocsSidebar = forwardRef(function DocsSidebar({ sections, activeSlug, activeSectionSlug, onSelect, onSectionChange }, ref) {
  const initialState = useMemo(
    () =>
      sections.reduce((acc, section) => {
        acc[section.slug] = section.slug === activeSectionSlug;
        return acc;
      }, {}),
    [sections, activeSectionSlug],
  );
  const [expanded, setExpanded] = useState(initialState);

  useEffect(() => {
    setExpanded(
      sections.reduce((acc, section) => {
        acc[section.slug] = section.slug === activeSectionSlug;
        return acc;
      }, {}),
    );
  }, [activeSectionSlug, sections]);

  const handleSectionClick = (section) => {
    onSectionChange?.(section.slug);
  };

  return (
    <nav className="docs-sidebar" ref={ref}>
      <div className="docs-sidebar__search" />
      <div className="docs-nav">
        {sections.map((section) => (
          <div key={section.slug} className={`docs-nav__group${section.slug === activeSectionSlug ? ' is-active' : ''}`}>
            <button
              type="button"
              className="docs-nav__heading"
              onClick={() => handleSectionClick(section)}
              aria-expanded={expanded[section.slug]}
            >
              {section.title}
              <span className="docs-nav__chevron" aria-hidden="true">
                {expanded[section.slug] ? '▾' : '▸'}
              </span>
            </button>
            {expanded[section.slug] && (
              <ul>
                {section.pages.map((page) => (
                  <li key={page.slug}>
                    <button
                      type="button"
                      className={page.slug === activeSlug ? 'is-active' : ''}
                      onClick={() => onSelect(page.slug)}
                    >
                      {page.title}
                    </button>
                  </li>
                ))}
                {section.slug === 'legal' && (
                  <li>
                    <a href="/legal" className="docs-nav__legal-link">
                      Legal hub →
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
});

export default DocsSidebar;
