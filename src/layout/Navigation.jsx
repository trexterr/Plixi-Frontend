import { NAV_LINKS } from '../data';

export default function Navigation() {
  return (
    <header className="nav-shell">
      <div className="nav-brand">
        <div className="logo-glyph" aria-hidden="true">
          <span>6</span>
        </div>
        <div>
          <p>MEE6</p>
          <span>mee6.xyz</span>
        </div>
      </div>
      <nav>
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-ctas">
          <button className="btn ghost">Dashboard</button>
          <button className="btn primary">Add to Discord</button>
        </div>
      </nav>
    </header>
  );
}
