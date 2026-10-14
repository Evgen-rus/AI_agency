import type { FormEvent } from 'react';
import { useRef, useState } from 'react';
import './styles.css';
import ConceptNav from './ConceptNav';
import { products } from './products';

function Arrow() {
  return (
    <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M4 14h19m-8-8 8 8-8 8" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function App() {
  const [selected, setSelected] = useState(0);
  const [hasSelected, setHasSelected] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [task, setTask] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const detailTitle = useRef<HTMLHeadingElement>(null);
  const product = products[selected];

  function choose(index: number) {
    setSelected(index);
    setHasSelected(true);
    setShowNext(false);
    detailTitle.current?.focus({ preventScroll: true });
    document.getElementById('solution')?.scrollIntoView({ block: 'start' });
  }

  function prepare(event: FormEvent) {
    event.preventDefault();
    const text = task.trim();
    if (text.length < 10) {
      setPreview('');
      setError('Опишите задачу чуть подробнее — минимум 10 символов.');
      return;
    }
    setError('');
    setPreview(text);
  }

  return (
    <>
      <ConceptNav active="c" />
      <a className="skip-link" href="#products">
        К решениям
      </a>
      <main id="top">
        <section className="opening" aria-label="LeadGenBureau — AI для бизнеса">
          <div className="hero">
            <header className="hero-header">
              <a className="wordmark" href="#top">
                LeadGenBureau
              </a>
              <nav aria-label="Главная навигация">
                <a href="#products">
                  Продукты{' '}
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
                    <path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </a>
                <button type="button" onClick={() => choose(3)}>
                  Внедрения
                </button>
              </nav>
            </header>
            <h1>
              <span>AI для бизнеса.</span>
              <span>С фокусом</span>
              <span>на продажи.</span>
            </h1>
            <a className="button hero-action" href="#discussion">
              Обсудить задачу <Arrow />
            </a>
          </div>
          <aside className="hero-aside">
            <a className="button header-action" href="#discussion">
              Обсудить задачу <Arrow />
            </a>
            <div className="aside-copy">
              <p>
                Лидогенерация, <br />
                AI-квалификация и помощь <br />
                B2B-продажам.
              </p>
              <a className="text-link" href="#products">
                Выбрать решение <Arrow />
              </a>
              <a className="text-link" href="#discussion">
                Обсудить AI-внедрение <Arrow />
              </a>
            </div>
          </aside>
        </section>
        <section
          className={`product-index${hasSelected ? ' has-selection' : ''}`}
          id="products"
          aria-label="Наши решения"
        >
          <button
            className="product lead"
            type="button"
            aria-pressed={selected === 0}
            aria-controls="solution"
            onClick={() => choose(0)}
          >
            <span className="product-art lead-art" aria-hidden="true">
              <i />
              <b />
            </span>
            <span className="product-name">Лидогенерация</span>
            <span className="status">Работает</span>
          </button>
          <button
            className="product voice"
            type="button"
            aria-pressed={selected === 1}
            aria-controls="solution"
            onClick={() => choose(1)}
          >
            <span className="product-art voice-art" aria-hidden="true">
              <i />
            </span>
            <span className="product-name">AI-звонилка</span>
            <span className="status">MVP</span>
          </button>
          <button
            className="product rop"
            type="button"
            aria-pressed={selected === 2}
            aria-controls="solution"
            onClick={() => choose(2)}
          >
            <span className="product-art rop-art" aria-hidden="true">
              <i />
              <b />
            </span>
            <span className="product-name">NeuroROP</span>
            <span className="status">Пилот</span>
          </button>
          <button
            className="product custom"
            type="button"
            aria-pressed={selected === 3}
            aria-controls="solution"
            onClick={() => choose(3)}
          >
            <span className="product-art custom-art" aria-hidden="true">
              <i />
              <b />
            </span>
            <span className="product-name">
              Индивидуальные
              <br />
              AI-решения
            </span>
            <span className="status">Направление развития</span>
          </button>
        </section>
        <section className="solution" id="solution" aria-labelledby="solution-title">
          <div className="solution-heading">
            <h2 id="solution-title" ref={detailTitle} tabIndex={-1}>
              {product.title}
            </h2>
            <p className="readiness">
              {product.name} <span>{product.status}</span>
            </p>
          </div>
          <div className="solution-body">
            <div className="solution-copy">
              <p>{product.description}</p>
              <p className="use-case">{product.use}</p>
              <a className="text-link" href="#discussion">
                {product.cta} <Arrow />
              </a>
            </div>
            <div className={`demo demo-${selected}`} key={selected}>
              <h3>{product.scene}</h3>
              <p className="demo-note">Условный сценарий · синтетические данные</p>
              <p className="demo-signal">{product.signal}</p>
              <p>{product.context}</p>
              <button
                className="demo-toggle"
                type="button"
                aria-expanded={showNext}
                aria-controls="next-step"
                onClick={() => setShowNext(!showNext)}
              >
                {showNext ? 'Свернуть следующий шаг' : 'Показать следующий шаг'} <Arrow />
              </button>
              <div id="next-step" hidden={!showNext}>
                <p className="next-step">{product.next}</p>
              </div>
            </div>
          </div>
        </section>
        <section className="connection" aria-labelledby="connection-title">
          <h2 id="connection-title">
            Одна цель.
            <br />
            Разные точки входа.
          </h2>
          <div>
            <p>Можно начать с одного продукта или обсудить несколько решений для вашей воронки.</p>
            <ol className="sales-path">
              <li>Найти потенциального клиента</li>
              <li>Проверить потребность</li>
              <li>Помочь менеджеру со сделкой</li>
            </ol>
            <p className="path-note">
              Так мы видим развитие системы. Состав и интеграции определяем под задачу компании.
            </p>
          </div>
        </section>
        <section className="discussion" id="discussion" aria-labelledby="discussion-title">
          <div>
            <h2 id="discussion-title">
              Обсудить
              <br />
              вашу задачу.
            </h2>
            <p>
              Где сейчас теряются возможности продаж? Сформулируйте задачу — это поможет начать
              предметный разговор.
            </p>
            <p className="prototype-note">
              Демонстрационная форма. Текст остаётся на этой странице; заявка никуда не
              отправляется.
            </p>
          </div>
          <form onSubmit={prepare} noValidate>
            <label htmlFor="task">Что хотите улучшить?</label>
            <textarea
              id="task"
              value={task}
              onChange={(event) => {
                setTask(event.target.value);
                setPreview('');
                setError('');
              }}
              maxLength={1500}
              rows={5}
              placeholder="Например: лиды приходят, но после первого разговора сделки часто останавливаются…"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'task-error task-hint' : 'task-hint'}
            />
            <p id="task-hint" className="field-hint">
              Без контактов и конфиденциальных данных. До 1500 символов.
            </p>
            {error && (
              <p className="error" id="task-error" role="alert">
                {error}
              </p>
            )}
            <button className="button" type="submit">
              Подготовить описание <Arrow />
            </button>
            <div aria-live="polite">
              {preview && (
                <div className="request-preview">
                  <h3>Описание для будущего разговора</h3>
                  <p>{preview}</p>
                  <p className="field-hint">
                    Черновик готов. Он не отправлен. Способ связи добавим после согласования.
                  </p>
                </div>
              )}
            </div>
          </form>
        </section>
      </main>
      <footer>
        <a className="footer-wordmark" href="#top">
          LeadGenBureau
        </a>
        <p>AI-продукты и автоматизация для B2B-продаж</p>
        <span>Концепция сайта · 2026</span>
      </footer>
    </>
  );
}
