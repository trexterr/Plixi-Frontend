import DocsCallout from './DocsCallout';

const renderBlock = (block, index) => {
  if (!block) return null;
  if (typeof block === 'string') {
    return <p key={index}>{block}</p>;
  }

  switch (block.type) {
    case 'paragraph':
      return <p key={index}>{block.text}</p>;
    case 'heading':
      return (
        <h2 key={index} id={block.text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
          {block.text}
        </h2>
      );
    case 'divider':
      return <hr key={index} className="docs-divider" />;
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      const classNames = ['docs-list'];
      if (block.variant === 'check') classNames.push('docs-list--check');
      return (
        <Tag key={index} className={classNames.join(' ')}>
          {(block.items || []).map((item, itemIndex) => (
            <li key={`${index}-${itemIndex}`}>{item}</li>
          ))}
        </Tag>
      );
    }
    case 'callout':
      return <DocsCallout key={index} variant={block.variant} title={block.title} body={block.body} />;
    case 'code':
      return (
        <pre key={index} className="docs-code-block">
          <code>{block.content}</code>
        </pre>
      );
    case 'table':
      return (
        <div key={index} className="docs-table-wrapper">
          <table className="docs-table">
            {block.headers && (
              <thead>
                <tr>
                  {block.headers.map((header, headerIndex) => (
                    <th key={`${index}-header-${headerIndex}`}>{header}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {(block.rows || []).map((row, rowIndex) => (
                <tr key={`${index}-row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${index}-row-${rowIndex}-cell-${cellIndex}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
};

export default function DocsArticle({ page, relatedSections = [], onSelect, showRelated = true }) {
  if (!page) {
    return (
      <div className="docs-article">
        <p className="helper-text">Select a topic from the sidebar to begin.</p>
      </div>
    );
  }

  return (
    <div className="docs-article">
      <header>
        <p className="eyebrow">{page.section}</p>
        <h1>{page.title}</h1>
        {page.summary && <p className="docs-article__summary">{page.summary}</p>}
      </header>
      <div className="docs-article__body">{(page.body ?? []).map((block, index) => renderBlock(block, index))}</div>
      {showRelated && relatedSections.length > 0 && (
        <footer className="docs-related">
          <p className="eyebrow">Related</p>
          <ul>
            {relatedSections.slice(0, 3).map((section) => (
              <li key={section.slug}>
                <button type="button" onClick={() => onSelect(section.pages[0].slug)}>
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </footer>
      )}
    </div>
  );
}
