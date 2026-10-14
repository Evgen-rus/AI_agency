import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import './journey.css';
import ConceptNav from './ConceptNav';
import { products } from './products';

const steps = ['Сигнал', 'Разговор', 'Сделка', 'Следующий шаг'];
const scenes = [
  {
    title: 'Интерес ещё не означает готовность купить.',
    event: 'Компания «Север» интересуется предложениями в вашей категории.',
    action: 'Проверить, есть ли актуальная потребность.',
    next: 'Далее: проверить потребность',
    product: 0,
  },
  {
    title: 'Есть потребность. Теперь нужен контекст.',
    event: 'Клиент рассматривает смену поставщика после окончания текущего договора.',
    action: 'Уточнить задачу, срок и удобное время разговора с менеджером.',
    next: 'Далее: передать в продажи',
    product: 1,
  },
  {
    title: 'Предложение отправлено. Что дальше?',
    event: 'Менеджер отправил предложение. Ответа пока нет, следующий контакт не назначен.',
    action: 'Уточнить вопросы к предложению и согласовать следующий контакт.',
    next: 'Далее: договориться о шаге',
    product: 2,
  },
  {
    title: 'Следующий шаг согласован. Работа продолжается.',
    event: 'Клиент готов обсудить условия на следующем разговоре.',
    action:
      'Подготовиться к разговору и зафиксировать договорённость. Это ещё не закрытая продажа.',
    next: 'Обсудить задачу',
    product: 2,
  },
];
const chapters = [
  {
    heading: 'Найти повод для разговора.',
    copy: 'Сигнал спроса помогает найти потенциального клиента. Контакты и аналитика дают менеджеру точку входа — потребность ещё предстоит проверить.',
    question: 'Где искать новых потенциальных клиентов?',
  },
  {
    heading: 'Услышать, что нужно клиенту.',
    copy: 'Голосовой AI-агент задаёт квалифицирующие вопросы. В этой истории интерес подтверждён, но решение отложено: менеджеру важны причина, сроки и контекст.',
    question: 'Кого из базы передавать менеджерам?',
  },
  {
    heading: 'Не потерять сделку в тишине.',
    copy: 'NeuroROP помогает заметить риск в контексте сделки. РОПу нужна видимость проблемы, менеджеру — понятное действие. Следующий разговор должен иметь цель.',
    question: 'Почему предложение осталось без ответа?',
  },
  {
    heading: 'Довести разговор до следующего действия.',
    copy: 'Менеджер уточняет вопросы и договаривается о продолжении. AI помогает работать с контекстом, но переговоры, решение клиента и результат остаются частью живых продаж.',
    question: 'Кто, что и когда делает дальше?',
  },
];

function Arrow() {
  return (
    <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M4 14h19m-8-8 8 8-8 8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function JourneyApp() {
  const [active, setActive] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const [task, setTask] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const scene = scenes[active];
  const product = products[scene.product];

  function select(index: number) {
    setActive(index);
    setAnnouncement(`Этап ${index + 1} из 4: ${steps[index]}. ${scenes[index].title}`);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: '-20% 0px -45% 0px' },
    );
    for (const chapter of document.querySelectorAll('.j-chapter')) observer.observe(chapter);
    return () => observer.disconnect();
  }, []);

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
      <ConceptNav active="b" />
      <p className="j-sr" aria-live="polite">
        {announcement}
      </p>
      <a className="j-skip" href="#journey-story">
        К истории
      </a>
      <header className="j-header">
        <a className="j-brand" href="/sales-journey/">
          LeadGenBureau
        </a>
        <nav aria-label="Главная навигация">
          <a href="#journey-story">История</a>
          <a href="#journey-products">Продукты</a>
        </nav>
        <a className="j-button j-outline" href="#journey-discussion">
          Обсудить задачу
        </a>
      </header>
      <main>
        <section className="j-hero" aria-labelledby="journey-title">
          <h1 id="journey-title">
            <span>У каждой сделки</span>
            <span>есть следующий</span>
            <span>шаг.</span>
          </h1>
          <div className="j-intro">
            <p>
              От первого сигнала спроса <br />
              до работы с возражениями. <br />
              Показываем, где наши продукты <br />
              помогают вашей команде.
            </p>
            <a className="j-button" href="#journey-story">
              Увидеть цепочку <Arrow />
            </a>
          </div>
        </section>
        <nav className="j-rail" aria-label="Этапы истории">
          {steps.map((name, index) => (
            <button
              type="button"
              key={name}
              onClick={() => select(index)}
              aria-pressed={active === index}
              aria-controls="journey-story"
            >
              <span className="j-station">0{index + 1}</span>
              <span>{name}</span>
            </button>
          ))}
        </nav>
        <section id="journey-story" className="j-demo" aria-label="История компании Север">
          <div className="j-scene-main">
            <div className="j-company">
              <h2>Компания Север</h2>
              <p className="j-demo-notice">Демонстрационный сценарий · данные вымышлены</p>
            </div>
            <h2 key={active} className="j-scene-title">
              {scene.title}
            </h2>
          </div>
          <div className="j-scene-bottom">
            <p>
              <strong>{product.name}</strong> · <span>{product.status}</span>
            </p>
            <div className="j-step-actions">
              {active > 0 && (
                <button type="button" onClick={() => select(active - 1)}>
                  Назад
                </button>
              )}
              {active < 3 ? (
                <button type="button" onClick={() => select(active + 1)}>
                  {scene.next} <Arrow />
                </button>
              ) : (
                <a href="#journey-discussion">
                  Обсудить задачу <Arrow />
                </a>
              )}
            </div>
          </div>
        </section>
        <section className="j-explanation" aria-labelledby="journey-how">
          <h2 id="journey-how">Как это работает</h2>
          <div className="j-story-layout">
            <aside className="j-story-context">
              <h3>Север</h3>
              <div className="j-current-context" key={active}>
                <span>
                  Этап {active + 1} из 4 · {steps[active]}
                </span>
                <p>{scene.event}</p>
                <strong>Следующее действие</strong>
                <p>{scene.action}</p>
              </div>
              <p className="j-disclaimer">
                Это модель работы, а не демонстрация готовой сквозной интеграции. Каждый продукт
                можно использовать отдельно.
              </p>
            </aside>
            <div>
              {chapters.map((chapter, index) => (
                <article
                  key={chapter.heading}
                  className="j-chapter"
                  data-step={index}
                  id={`journey-chapter-${index}`}
                >
                  <span className="j-chapter-step">
                    {index + 1} / 4 · {steps[index]}
                  </span>
                  <h3>{chapter.heading}</h3>
                  <p>{chapter.copy}</p>
                  <p className="j-question">{chapter.question}</p>
                  <a href="#journey-products">
                    {products[scenes[index].product].name} <Arrow />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="journey-products"
          className="j-products"
          aria-labelledby="journey-products-title"
        >
          <h2 id="journey-products-title">
            Можно начать
            <br />с одного этапа.
          </h2>
          <p className="j-products-intro">
            Новые клиенты, квалификация базы или помощь менеджерам. Подбираем решение под задачу —
            весь комплекс сразу не обязателен.
          </p>
          {products.map((item, index) => (
            <article className="j-product" key={item.name}>
              <div>
                <h3>{item.name}</h3>
                <span>{item.status}</span>
              </div>
              <p>{item.description}</p>
              <a className="j-product-action" href="#journey-discussion">
                {item.cta}
                <Arrow />
              </a>
              <span className="j-product-index" aria-hidden="true">
                {index + 1}
              </span>
            </article>
          ))}
        </section>
        <section
          id="journey-discussion"
          className="j-discussion"
          aria-labelledby="journey-discussion-title"
        >
          <div>
            <h2 id="journey-discussion-title">
              Где начинается
              <br />
              ваша задача?
            </h2>
            <p>
              Расскажите, на каком этапе нужна помощь. Начнём с процесса и подберём решение под
              него.
            </p>
            <p className="j-disclaimer">
              Демонстрационная форма: описание остаётся на этой странице. Контакты и приём заявок
              ещё не подключены.
            </p>
          </div>
          <form onSubmit={prepare} noValidate>
            <label htmlFor="journey-task">Что хотите улучшить в продажах?</label>
            <textarea
              id="journey-task"
              value={task}
              onChange={(event) => setTask(event.target.value)}
              minLength={10}
              maxLength={1500}
              rows={5}
              aria-describedby={error ? 'journey-error journey-help' : 'journey-help'}
              aria-invalid={!!error}
              placeholder="Например: лиды есть, но после предложения сделки останавливаются."
            />
            <p id="journey-help">
              От 10 до 1500 символов. Черновик исчезнет при обновлении страницы.
            </p>
            {error && (
              <p id="journey-error" role="alert">
                {error}
              </p>
            )}
            <button className="j-button" type="submit">
              Подготовить описание <Arrow />
            </button>
            {preview && (
              <div className="j-draft" role="status">
                <h3>Описание для будущего разговора</h3>
                <p>{preview}</p>
                <p>Черновик готов. Он не отправлен.</p>
              </div>
            )}
          </form>
        </section>
      </main>
      <footer className="j-footer">
        <a className="j-brand" href="/sales-journey/">
          LeadGenBureau
        </a>
        <p>AI-продукты и автоматизация B2B-продаж</p>
        <a href="#journey-title">
          В начало <Arrow />
        </a>
      </footer>
    </>
  );
}
