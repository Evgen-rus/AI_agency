import { type FormEvent, useEffect, useId, useRef, useState } from 'react';

export type IconName =
  | 'arrow'
  | 'target'
  | 'phone'
  | 'chart'
  | 'layers'
  | 'check'
  | 'mail'
  | 'message'
  | 'clock'
  | 'spark'
  | 'document'
  | 'risk'
  | 'people';

const iconPaths: Record<IconName, string> = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  target: 'M20 11a8 8 0 1 1-7-7M12 8a4 4 0 1 0 4 4M12 12l9-9M16 3h5v5',
  phone:
    'M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z',
  chart: 'M5 19v-6M12 19V5M19 19V9',
  layers: 'm12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5',
  check: 'm5 12 4 4L19 6',
  mail: 'M3 5h18v14H3V5Zm0 1 9 7 9-7',
  message:
    'M21 11a9 9 0 0 1-9 9 10 10 0 0 1-4-1l-5 2 1-5a9 9 0 1 1 17-5ZM8 11h.01M12 11h.01M16 11h.01',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
  document: 'M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8M8 16h6',
  risk: 'm12 3 10 18H2L12 3Zm0 6v5M12 17h.01',
  people:
    'M16 21v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8M22 21v-3a4 4 0 0 0-3-3.9',
};

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg
      className={`brand-icon ${className}`}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

export function ActionLink({
  href,
  children,
  secondary = false,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <a className={`brand-button ${secondary ? 'is-secondary' : ''} ${className}`} href={href}>
      {children}
      <Icon name="arrow" />
    </a>
  );
}

export function BrandHeader({ neuro = false }: { neuro?: boolean }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const navId = useId();
  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);
  const links = neuro
    ? [
        ['Возможности', '#possibilities'],
        ['Как работает', '#demo'],
        ['Пилот', '#pilot'],
      ]
    : [
        ['Продукты', '#products'],
        ['Подход', '#approach'],
        ['О компании', '#about'],
      ];
  return (
    <>
      <a className="brand-skip" href="#main">
        К содержанию
      </a>
      <header className="brand-header brand-container">
        <a
          className="brand-wordmark"
          href="/agency/"
          aria-label="LeadGenBureau — главная агентства"
        >
          LeadGen<span>Bureau</span>
        </a>
        {neuro && (
          <a className="brand-product-label" href="/neurorop/">
            NeuroROP
          </a>
        )}
        <button
          ref={toggle}
          className="brand-menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls={navId}
          onClick={() => setOpen(!open)}
        >
          {open ? 'Закрыть' : 'Меню'}
          <span aria-hidden="true">{open ? '×' : '+'}</span>
        </button>
        <nav id={navId} className="brand-nav" aria-label="Главная навигация" data-open={open}>
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          {neuro && <a href="/agency/#products">Все решения</a>}
          <a
            className="brand-header-cta"
            href={neuro ? '/neurorop/#contact' : '/agency/#contact'}
            onClick={() => setOpen(false)}
          >
            <Icon name="arrow" />
            {neuro ? 'Обсудить пилот' : 'Обсудить задачу'}
          </a>
        </nav>
      </header>
    </>
  );
}

export function BrandFooter({ neuro = false }: { neuro?: boolean }) {
  return (
    <footer className="brand-footer brand-container">
      <div>
        <a className="brand-wordmark" href="/agency/">
          LeadGen<span>Bureau</span>
        </a>
        <p>Сначала задача. Затем подходящее решение.</p>
      </div>
      <nav aria-label="Навигация в подвале">
        <a href="/agency/#products">Продукты</a>
        <a href="/agency/#approach">Подход</a>
        <a href="/agency/#about">Об агентстве</a>
        <a href={neuro ? '#pilot' : '/neurorop/'}>{neuro ? 'Пилот NeuroROP' : 'NeuroROP'}</a>
      </nav>
      <p className="brand-footer-note">
        © {new Date().getFullYear()} LeadGenBureau
        <br />
        Собственные продукты и AI-внедрения
      </p>
    </footer>
  );
}

export function ContactSection({ neuro = false }: { neuro?: boolean }) {
  const [draft, setDraft] = useState<{ name: string; contact: string; task: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const prefix = useId();
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get('name') || '').trim(),
      contact: String(data.get('contact') || '').trim(),
      task: String(data.get('task') || '').trim(),
    };
    const next: Record<string, string> = {};
    if (!values.name) next.name = 'Укажите, как к вам обращаться.';
    if (!values.contact) next.contact = 'Укажите email, телефон или Telegram.';
    if (!values.task) next.task = 'Кратко опишите задачу.';
    setErrors(next);
    setDraft(Object.keys(next).length ? null : values);
    if (Object.keys(next).length) {
      const first = event.currentTarget.elements.namedItem(Object.keys(next)[0]);
      if (first instanceof HTMLElement) first.focus();
    }
  }
  return (
    <section id="contact" className="brand-contact brand-section">
      <div className="brand-container brand-contact-grid">
        <div>
          <h2>
            {neuro
              ? 'Начнём с вашей ситуации в продажах'
              : 'Какая задача сейчас важна для вашего бизнеса?'}
          </h2>
          <p>
            {neuro
              ? 'Опишите, что мешает сделкам двигаться дальше. Это поможет предметно обсудить границы пилота NeuroROP.'
              : 'Расскажите о процессе, который хочется улучшить. Начнём с задачи и определим, какое решение имеет смысл проверять.'}
          </p>
          <div className="brand-contact-detail">
            <Icon name={neuro ? 'chart' : 'message'} />
            <span>
              {neuro
                ? 'Один процесс. Понятная задача для пилота.'
                : 'Собственный продукт или индивидуальная разработка.'}
            </span>
          </div>
        </div>
        <form
          className="brand-contact-form"
          onSubmit={prepare}
          onChange={() => setDraft(null)}
          noValidate
        >
          <h3>Подготовить обращение</h3>
          <p id={`${prefix}-hint`} className="brand-form-hint">
            Это черновик. Отправка пока не подключена; данные не сохраняются после перезагрузки.
          </p>
          <div className="brand-field-pair">
            <label htmlFor={`${prefix}-name`}>
              Ваше имя
              <input
                id={`${prefix}-name`}
                name="name"
                autoComplete="off"
                maxLength={100}
                required
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${prefix}-name-error` : undefined}
              />
              {errors.name && (
                <span className="brand-field-error" id={`${prefix}-name-error`}>
                  {errors.name}
                </span>
              )}
            </label>
            <label htmlFor={`${prefix}-contact`}>
              Как с вами связаться
              <input
                id={`${prefix}-contact`}
                name="contact"
                autoComplete="off"
                maxLength={200}
                placeholder="Email, телефон или Telegram"
                required
                aria-invalid={Boolean(errors.contact)}
                aria-describedby={errors.contact ? `${prefix}-contact-error` : undefined}
              />
              {errors.contact && (
                <span className="brand-field-error" id={`${prefix}-contact-error`}>
                  {errors.contact}
                </span>
              )}
            </label>
          </div>
          <label htmlFor={`${prefix}-task`}>
            Ваша задача
            <textarea
              id={`${prefix}-task`}
              name="task"
              rows={4}
              maxLength={1500}
              placeholder={
                neuro
                  ? 'Например, после КП сделки остаются без следующего шага…'
                  : 'Как устроен процесс и что хочется изменить?'
              }
              required
              aria-invalid={Boolean(errors.task)}
              aria-describedby={errors.task ? `${prefix}-task-error` : undefined}
            />
            {errors.task && (
              <span className="brand-field-error" id={`${prefix}-task-error`}>
                {errors.task}
              </span>
            )}
          </label>
          <button className="brand-button" type="submit" aria-describedby={`${prefix}-hint`}>
            Подготовить обращение
            <Icon name="arrow" />
          </button>
          <div aria-live="polite" aria-atomic="true">
            {draft && (
              <div className="brand-draft">
                <h4>Черновик готов — ничего не отправлено</h4>
                <p>{draft.name}</p>
                <p>{draft.contact}</p>
                <p>{draft.task}</p>
                <small>Текст можно выделить и скопировать.</small>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export function Approach({ neuro = false }: { neuro?: boolean }) {
  const steps = neuro
    ? [
        [
          'Выбираем задачу',
          'Какие сделки требуют внимания и что нужно понять по результатам пилота.',
        ],
        [
          'Уточняем источники',
          'Обсуждаем доступные данные, интеграции и ограничения конкретного процесса.',
        ],
        ['Проверяем на пилоте', 'Смотрим, достаточно ли контекста для полезных рекомендаций.'],
        ['Оцениваем вместе', 'Разбираем результаты и определяем следующий шаг развития.'],
      ]
    : [
        ['Разбираем процесс', 'Где теряется время, информация или внимание команды.'],
        ['Выбираем задачу', 'Определяем ограниченный участок и подходящее решение.'],
        ['Начинаем с пилота', 'Согласуем источники, ограничения и критерии проверки.'],
        ['Оцениваем результат', 'Решаем вместе, что развивать дальше и как.'],
      ];
  return (
    <section id={neuro ? 'pilot' : 'approach'} className="brand-section brand-approach">
      <div className="brand-container">
        <div className="brand-section-heading">
          <h2>
            {neuro ? 'Пилот начинается с конкретной задачи' : 'От задачи — к работающему решению'}
          </h2>
          <p>
            {neuro
              ? 'Объём пилота определяется после знакомства с вашим процессом и доступными данными.'
              : 'Не предлагаем автоматизировать всё сразу. Сначала определяем, где изменения будут полезны вашей команде.'}
          </p>
        </div>
        <ol className="brand-approach-steps">
          {steps.map(([title, description], index) => (
            <li key={title}>
              <span className="brand-step-number">{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
