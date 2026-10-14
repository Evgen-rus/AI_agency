import './concept-nav.css';

const concepts = [
  { id: 'c', name: 'AI Agency', href: '/' },
  { id: 'a', name: 'Revenue OS', href: '/revenue-os/' },
  { id: 'b', name: 'Sales Journey', href: '/sales-journey/' },
];

export default function ConceptNav({ active }: { active: 'a' | 'b' | 'c' }) {
  return (
    <nav className="concept-nav" aria-label="Сравнить концепции">
      <span className="concept-nav-label">Сравнить концепции</span>
      <div>
        {concepts.map((concept) => (
          <a
            key={concept.id}
            href={concept.href}
            aria-current={active === concept.id ? 'page' : undefined}
          >
            <span>{concept.id.toUpperCase()}</span>
            {concept.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
