import type { FormEvent } from 'react';
import { useRef, useState } from 'react';
import { products } from './products';
import './revenue.css';
import ConceptNav from './ConceptNav';

const stages = [
  {
    name: 'Спрос',
    risk: 'Потребность ещё не проверена',
    action: 'Выяснить задачу компании',
    context:
      'Компания проявила интерес к предложениям в вашей категории. Сигнал ещё не означает готовность купить.',
    next: 'Менеджер связывается с компанией и проверяет, есть ли актуальная потребность.',
    product: 0,
    icon: 'M6 3h8l4 4v14H6z M14 3v5h4 M9 12h6 M9 16h6',
  },
  {
    name: 'Квалификация',
    risk: 'Срок и условия требуют уточнения',
    action: 'Уточнить потребность и сроки',
    context:
      'Условный ответ: «Рассматриваем смену поставщика после окончания договора». Запись звонка пока не опубликована.',
    next: 'Передать менеджеру контекст потребности и согласовать время следующего разговора.',
    product: 1,
    icon: 'M16 7a4 4 0 1 1-8 0a4 4 0 1 1 8 0 M4 21v-3a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v3',
  },
  {
    name: 'Сделка',
    risk: 'Следующий контакт не назначен',
    action: 'Уточнить вопросы к предложению',
    context:
      'Подготовить ответы на вопросы по условиям, срокам и интеграции. Назначить следующий контакт.',
    next: 'Связаться с клиентом, выяснить вопросы к предложению и договориться о следующем этапе. Решение остаётся за менеджером.',
    product: 2,
    icon: 'M5 20v-7 M12 20V4 M19 20V9',
  },
  {
    name: 'Ответ клиента',
    risk: 'Договорённость нужно подтвердить',
    action: 'Согласовать следующий разговор',
    context:
      'Условный сценарий: менеджер предложил обсудить вопросы к предложению. Ответ клиента ещё не получен.',
    next: 'Получить подтверждение времени и зафиксировать договорённость в рабочей системе. Демонстрация сама не создаёт задачи.',
    product: 2,
    icon: 'M5 22V3 M5 4h14l-3 5l3 5H5',
  },
];

function Arrow() {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function RevenueApp() {
  const [stage, setStage] = useState(2);
  const [showNext, setShowNext] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(2);
  const [task, setTask] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const productTitle = useRef<HTMLHeadingElement>(null);
  const scene = stages[stage];
  const product = products[selectedProduct];

  function selectStage(index: number) {
    setStage(index);
    setShowNext(false);
    setSelectedProduct(stages[index].product);
  }

  function selectProduct(index: number) {
    setSelectedProduct(index);
    productTitle.current?.focus({ preventScroll: true });
    document.getElementById('revenue-product')?.scrollIntoView({ block: 'start' });
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
      <ConceptNav active="a" />
      <a className="r-skip" href="#revenue-demo">
        К демонстрации
      </a>
      <header className="r-header">
        <a className="r-brand" href="/revenue-os/">
          LeadGen<span>Bureau</span>
        </a>
        <nav aria-label="Главная навигация">
          <a href="#revenue-solutions">Решения</a>
          <a href="#revenue-approach">Подход</a>
        </nav>
        <a className="r-other" href="/">
          Концепция AI Agency
        </a>
        <a className="r-button r-header-action" href="#revenue-discussion">
          Обсудить задачу
        </a>
      </header>
      <main>
        <section className="r-opening" aria-labelledby="revenue-title">
          <div className="r-intro">
            <h1 id="revenue-title">
              Каждый контакт.<span>Следующий шаг.</span>
            </h1>
            <p>
              Находим потенциальных клиентов, квалифицируем интерес и помогаем отделу продаж двигать
              сделки дальше.
            </p>
            <a className="r-button r-main-action" href="#revenue-discussion">
              Обсудить задачу <Arrow />
            </a>
          </div>
          <div className="r-console" id="revenue-demo">
            <p className="r-demo-label">Демонстрационный сценарий · данные вымышлены</p>
            <fieldset className="r-stages" aria-label="Этап модели продаж">
              {stages.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  aria-pressed={stage === index}
                  aria-controls="revenue-scene"
                  onClick={() => selectStage(index)}
                >
                  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d={item.icon}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {item.name}
                </button>
              ))}
            </fieldset>
            <div className="r-scene" id="revenue-scene" aria-live="polite">
              <table className="r-table">
                <caption className="r-sr">Условная компания на выбранном этапе</caption>
                <thead>
                  <tr>
                    <th>Компания</th>
                    <th>Отрасль</th>
                    <th>Статус</th>
                    <th>Риск</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Север</td>
                    <td>Промышленность</td>
                    <td>
                      <span className="r-stage-tag">{scene.name}</span>
                    </td>
                    <td>
                      <span className="r-risk">
                        <svg
                          className="r-risk-marker"
                          aria-hidden="true"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="11" fill="#ffe4e8" />
                          <path d="M12 6v8" stroke="#b5223c" strokeWidth="1.7" />
                          <circle cx="12" cy="18" r="1" fill="#b5223c" />
                        </svg>
                        <span>{scene.risk}</span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="r-flow-arrow" aria-hidden="true">
                <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3v18m-5-5 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="r-recommendation" key={stage}>
                <div className="r-action-icon" aria-hidden="true">
                  <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 18h6 M9 21h6 M8 13a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                </div>
                <div className="r-recommendation-copy">
                  <p>Рекомендуемое действие</p>
                  <h2>{scene.action}</h2>
                  <p>{scene.context}</p>
                </div>
                <div className="r-recommendation-actions">
                  <button
                    className="r-button r-reveal"
                    type="button"
                    aria-expanded={showNext}
                    aria-controls="revenue-next"
                    onClick={() => setShowNext(!showNext)}
                  >
                    {showNext ? 'Свернуть шаг' : 'Показать шаг'} <Arrow />
                  </button>
                  <a className="r-discuss-link" href="#revenue-discussion">
                    Обсудить решение
                  </a>
                </div>
              </div>
              <div className="r-next" id="revenue-next" hidden={!showNext}>
                <p>{scene.next}</p>
                <p>Это рекомендация в демонстрации. Действия в CRM не выполняются.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="r-readiness" aria-label="Готовность продуктов">
          <p>Готовность продуктов</p>
          <div>
            <strong>Лидогенерация — работает</strong>
            <span>Контакты и аналитика</span>
          </div>
          <div>
            <strong>AI-звонилка — MVP</strong>
            <span>Продукт дорабатывается</span>
          </div>
          <div>
            <strong>NeuroROP — пилот</strong>
            <span>Помощь РОПу и менеджеру</span>
          </div>
        </section>
        <section
          className="r-problems"
          id="revenue-solutions"
          aria-labelledby="revenue-problems-title"
        >
          <h2 id="revenue-problems-title">Где сейчас теряются продажи?</h2>
          <fieldset className="r-problem-options" aria-label="Выбрать задачу">
            <button
              type="button"
              aria-pressed={selectedProduct === 0}
              aria-controls="revenue-product"
              onClick={() => selectProduct(0)}
            >
              Не хватает потенциальных клиентов{' '}
              <span>Найти компании, которым вы можете быть полезны.</span>
            </button>
            <button
              type="button"
              aria-pressed={selectedProduct === 1}
              aria-controls="revenue-product"
              onClick={() => selectProduct(1)}
            >
              Неясно, у кого есть потребность{' '}
              <span>Квалифицировать интерес перед работой менеджера.</span>
            </button>
            <button
              type="button"
              aria-pressed={selectedProduct === 2}
              aria-controls="revenue-product"
              onClick={() => selectProduct(2)}
            >
              Сделки остаются без следующего шага{' '}
              <span>Увидеть риск и помочь менеджеру продолжить разговор.</span>
            </button>
          </fieldset>
          <div className="r-product-detail" id="revenue-product">
            <div className="r-product-identity">
              <p>{product.name}</p>
              <span>{product.status}</span>
            </div>
            <div className="r-product-copy">
              <h3 id="revenue-product-title" ref={productTitle} tabIndex={-1}>
                {product.title}
              </h3>
              <p>{product.description}</p>
              <p className="r-use">{product.use}</p>
              <a className="r-inline-link" href="#revenue-discussion">
                {product.cta} <Arrow />
              </a>
            </div>
          </div>
          <button
            className="r-custom-choice"
            type="button"
            aria-pressed={selectedProduct === 3}
            aria-controls="revenue-product"
            onClick={() => selectProduct(3)}
          >
            <span>Есть другой процесс для автоматизации?</span>
            <span>
              Индивидуальные AI-решения <Arrow />
            </span>
          </button>
        </section>
        <section
          className="r-approach"
          id="revenue-approach"
          aria-labelledby="revenue-approach-title"
        >
          <h2 id="revenue-approach-title">
            Начать с одного этапа.
            <br />
            Двигаться к общей цели.
          </h2>
          <div className="r-approach-copy">
            <p>
              Можно выбрать отдельный продукт или обсудить несколько решений для вашей воронки.
              Состав и возможность интеграции определяем под задачу компании.
            </p>
            <ol>
              <li>
                <h3>Разобрать процесс</h3>
                <p>
                  Где теряется контакт, контекст или следующий шаг? Начинаем с конкретной проблемы.
                </p>
              </li>
              <li>
                <h3>Выбрать точку входа</h3>
                <p>
                  Лидогенерация, квалификация, помощь отделу продаж или индивидуальная
                  автоматизация.
                </p>
              </li>
              <li>
                <h3>Обсудить проверку</h3>
                <p>
                  Для пилотного решения согласуем границы, данные и критерий результата с вашей
                  командой.
                </p>
              </li>
            </ol>
            <p className="r-model-note">
              Revenue OS — направление развития системы. Готовность каждого продукта указана
              отдельно.
            </p>
          </div>
        </section>
        <section
          className="r-discussion"
          id="revenue-discussion"
          aria-labelledby="revenue-discussion-title"
        >
          <div>
            <h2 id="revenue-discussion-title">
              Какой этап
              <br />
              нуждается во внимании?
            </h2>
            <p>
              Опишите, что происходит сейчас и что хотите улучшить. Это отправная точка для
              предметного разговора.
            </p>
            <p className="r-form-note">
              Демонстрационная форма. Текст остаётся на странице: заявка не отправляется и не
              сохраняется.
            </p>
          </div>
          <form onSubmit={prepare} noValidate>
            <label htmlFor="revenue-task">Ваша задача</label>
            <textarea
              id="revenue-task"
              value={task}
              maxLength={1500}
              rows={5}
              placeholder="Например: после отправки предложения менеджеры часто теряют контакт со сделкой…"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'revenue-error revenue-hint' : 'revenue-hint'}
              onChange={(event) => {
                setTask(event.target.value);
                setError('');
                setPreview('');
              }}
            />
            <p id="revenue-hint">Без контактов и конфиденциальных данных. До 1500 символов.</p>
            {error && (
              <p id="revenue-error" className="r-error" role="alert">
                {error}
              </p>
            )}
            <button className="r-button" type="submit">
              Подготовить описание <Arrow />
            </button>
            <div aria-live="polite">
              {preview && (
                <div className="r-request-preview">
                  <h3>Описание для будущего разговора</h3>
                  <p>{preview}</p>
                  <p>Черновик готов. Он не отправлен. Способ связи добавим после согласования.</p>
                </div>
              )}
            </div>
          </form>
        </section>
      </main>
      <footer className="r-footer">
        <a className="r-brand" href="/revenue-os/">
          LeadGen<span>Bureau</span>
        </a>
        <p>AI-продукты и автоматизация B2B-продаж</p>
        <a href="/">
          Посмотреть концепцию C — AI Agency <Arrow />
        </a>
      </footer>
    </>
  );
}
