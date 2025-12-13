import { AUTOMATION_BLOCKS } from '../data';

export default function AutomationSuite() {
  return (
    <section className="panel automation-panel" id="automations">
      <header>
        <p className="eyebrow">Automation suite</p>
        <h2>Personalize every interaction with Mee6 Flows.</h2>
        <p>
          Drag, drop, and remix triggers with conditions. Mee6 reacts to invites, emotes, and role
          changes faster than any mod squad.
        </p>
      </header>
      <div className="automation-grid">
        {AUTOMATION_BLOCKS.map((block) => (
          <article key={block.title}>
            <h3 style={{ color: block.accent }}>{block.title}</h3>
            <p>{block.summary}</p>
            <ul>
              {block.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
