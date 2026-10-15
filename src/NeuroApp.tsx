import { useState } from 'react';
import manager from './assets/brand/manager.webp';
import {
  ActionLink,
  Approach,
  BrandFooter,
  BrandHeader,
  ContactSection,
  Icon,
} from './BrandShared';
import './brand.css';

const situations = [
  {
    stage: 'КП отправлено',
    risk: 'Нет следующего шага',
    context:
      'В переписке отправлено предложение. Дата его обсуждения не согласована, следующая задача не назначена.',
    evidence: ['Предложение отправлено', 'Встреча не согласована', 'Следующая задача отсутствует'],
    action: 'Связаться с клиентом, уточнить вопросы к предложению и согласовать дату обсуждения.',
    why: 'Так у менеджера и клиента появится понятная договорённость о продолжении диалога.',
  },
  {
    stage: 'Переговоры',
    risk: 'Давно нет контакта',
    context:
      'В истории есть обсуждение потребности, но после последнего разговора нового контакта не зафиксировано.',
    evidence: ['Потребность обсуждалась', 'Нового контакта нет', 'Статус решения неизвестен'],
    action: 'Уточнить, актуальна ли задача, что изменилось и когда удобно вернуться к разговору.',
    why: 'Сначала нужно восстановить контекст, чтобы выбрать уместный следующий шаг.',
  },
  {
    stage: 'Согласование',
    risk: 'Открытый вопрос клиента',
    context:
      'В коммуникации остался вопрос об условиях предложения. В доступной истории ответа на него нет.',
    evidence: ['Вопрос клиента найден', 'Ответ не зафиксирован', 'Условия требуют уточнения'],
    action:
      'Подготовить ответ на вопрос клиента и уточнить, достаточно ли информации для продолжения.',
    why: 'Сделка может оставаться на месте, пока у клиента не прояснится важный для решения вопрос.',
  },
];

function ProcessScene() {
  const stages = [
    {
      title: 'Обнаружен риск',
      description: 'КП отправлено, но следующий шаг не назначен.',
      status: 'Требует внимания',
      icon: 'risk' as const,
    },
    {
      title: 'Собран контекст',
      description: 'CRM, история общения и открытые вопросы — рядом.',
      status: 'Контекст собран',
      icon: 'layers' as const,
    },
    {
      title: 'Предложено действие',
      description: 'Уточнить вопросы к КП и согласовать обсуждение.',
      status: 'Есть следующий шаг',
      icon: 'spark' as const,
    },
    {
      title: 'Действие менеджера',
      description: 'Менеджер продолжает диалог с клиентом.',
      status: 'Решение за человеком',
      icon: 'people' as const,
    },
  ];
  return (
    <figure
      className="neuro-process"
      aria-label="Демонстрационный путь от риска в сделке к действию менеджера"
    >
      <svg
        className="neuro-process-line"
        viewBox="0 0 800 232"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 205C110 175 125 155 200 155S300 110 400 108S510 58 600 58S700 25 780 28"
          stroke="#a9bfd9"
          strokeWidth="1.8"
        />
        {[
          [100, 180],
          [300, 132],
          [500, 84],
          [700, 36],
        ].map(([cx, cy]) => (
          <g key={cx}>
            <circle cx={cx} cy={cy} r="11" fill="#e6eef7" />
            <circle cx={cx} cy={cy} r="5" fill="#397cc3" />
          </g>
        ))}
      </svg>
      <ol className="neuro-process-cards">
        {stages.map((stage, index) => (
          <li key={stage.title} className={`neuro-process-card neuro-process-card-${index}`}>
            <div className="neuro-process-title">
              <span>{index + 1}</span>
              <h3>{stage.title}</h3>
            </div>
            <p>{stage.description}</p>
            <div className={`neuro-process-art neuro-process-art-${index}`}>
              {index === 0 && (
                <div className="neuro-risk-mini">
                  <span className="neuro-mini-heading">
                    <Icon name="document" />
                    Сделка
                  </span>
                  <strong>КП отправлено</strong>
                  <div className="neuro-mini-rule" />
                  <span className="neuro-mini-label">Следующая задача</span>
                  <span className="neuro-mini-risk">
                    <Icon name="risk" />
                    Не назначена
                  </span>
                  <div className="neuro-risk-float">
                    <Icon name="clock" />
                    <span>
                      Нужен
                      <br />
                      следующий шаг
                    </span>
                  </div>
                </div>
              )}
              {index === 1 && (
                <div className="neuro-context-mini">
                  <div>
                    <Icon name="document" />
                    <span>
                      Предложение
                      <br />
                      <small>Отправлено</small>
                    </span>
                  </div>
                  <div>
                    <Icon name="message" />
                    <span>
                      Вопрос клиента
                      <br />
                      <small>По условиям</small>
                    </span>
                  </div>
                  <div>
                    <Icon name="clock" />
                    <span>
                      Обсуждение
                      <br />
                      <small>Не согласовано</small>
                    </span>
                  </div>
                </div>
              )}
              {index === 2 && (
                <div className="neuro-advice-mini">
                  <Icon name="spark" />
                  <strong>Следующий шаг</strong>
                  <span>Уточнить вопросы</span>
                  <span>Предложить время</span>
                  <span>Согласовать контакт</span>
                </div>
              )}
              {index === 3 && (
                <>
                  <img
                    src={manager}
                    alt="Иллюстрация: менеджер за рабочим столом продолжает разговор"
                    width="600"
                    height="800"
                  />
                  <div className="neuro-human-caption">
                    <Icon name="message" />
                    Продолжить диалог
                  </div>
                </>
              )}
            </div>
            <span className="neuro-stage-status">
              <i />
              <span>{stage.status}</span>
            </span>
          </li>
        ))}
      </ol>
      <figcaption>Демо-сценарий · иллюстрация возможностей продукта</figcaption>
    </figure>
  );
}

function DealDemo() {
  const [selected, setSelected] = useState(0);
  const situation = situations[selected];
  return (
    <section id="demo" className="brand-section neuro-demo-section">
      <div className="brand-container">
        <div className="brand-section-heading">
          <h2>
            Одна сделка.
            <br />
            Понятный следующий шаг.
          </h2>
          <p>Выберите ситуацию и посмотрите, как контекст помогает перейти от риска к действию.</p>
        </div>
        <div className="neuro-deal-demo">
          <div className="neuro-deal-list">
            <div className="neuro-demo-title">
              <Icon name="chart" />
              <strong>Контроль сделок</strong>
              <span>Демо-данные</span>
            </div>
            <div className="neuro-list-labels">
              <span>Этап сделки</span>
              <span>На что обратить внимание</span>
            </div>
            <fieldset className="neuro-situation-buttons" aria-label="Выберите ситуацию сделки">
              {situations.map((item, index) => (
                <button
                  type="button"
                  key={item.stage}
                  aria-pressed={selected === index}
                  aria-controls="demo-detail"
                  onClick={() => setSelected(index)}
                >
                  <span>{item.stage}</span>
                  <span>{item.risk}</span>
                  <Icon name="arrow" />
                </button>
              ))}
            </fieldset>
            <p className="brand-note">Условные ситуации. Реальные CRM-данные не используются.</p>
          </div>
          <div className="neuro-deal-detail" id="demo-detail" aria-live="polite" aria-atomic="true">
            <span className="neuro-detail-label">
              <Icon name="layers" />
              Контекст сделки
            </span>
            <h3>{situation.risk}</h3>
            <p>{situation.context}</p>
            <ul className="neuro-evidence">
              {situation.evidence.map((item) => (
                <li key={item}>
                  <Icon name="check" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="neuro-recommendation">
              <span>
                <Icon name="spark" />
                Рекомендация менеджеру
              </span>
              <p>{situation.action}</p>
            </div>
            <p className="brand-note">{situation.why}</p>
            <small>Это рекомендация. Решение и действие остаются за менеджером.</small>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoleSection() {
  const [managerRole, setManagerRole] = useState(false);
  return (
    <section className="brand-section neuro-roles">
      <div className="brand-container neuro-role-grid">
        <div>
          <h2>
            Общий контекст.
            <br />
            Разные задачи команды.
          </h2>
          <p>
            Руководителю важно видеть, где нужно внимание. Менеджеру — понимать, с чего продолжить
            работу.
          </p>
          <fieldset className="neuro-role-buttons" aria-label="Для кого показать возможности">
            <button
              type="button"
              aria-pressed={!managerRole}
              aria-controls="role-detail"
              onClick={() => setManagerRole(false)}
            >
              Для РОПа
            </button>
            <button
              type="button"
              aria-pressed={managerRole}
              aria-controls="role-detail"
              onClick={() => setManagerRole(true)}
            >
              Для менеджера
            </button>
          </fieldset>
        </div>
        <div className="neuro-role-detail" id="role-detail" aria-live="polite" aria-atomic="true">
          <span className="brand-icon-box">
            <Icon name={managerRole ? 'people' : 'chart'} />
          </span>
          <h3>
            {managerRole ? 'Вернуться в сделку с пониманием' : 'Увидеть, где команда теряет темп'}
          </h3>
          <ul>
            {(managerRole
              ? [
                  'История коммуникаций в контексте текущей задачи',
                  'Открытые вопросы, которые важно учесть',
                  'Рекомендация по следующему действию',
                ]
              : [
                  'Сделки с рисками и незакрытыми вопросами',
                  'Основания для внимания к каждой ситуации',
                  'Контекст для предметного разговора с менеджером',
                ]
            ).map((text) => (
              <li key={text}>
                <Icon name="check" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function NeuroApp() {
  return (
    <div className="brand-site neuro-site">
      <BrandHeader neuro />
      <main id="main">
        <section className="neuro-opening" aria-labelledby="neuro-title">
          <div className="brand-container">
            <div className="neuro-hero">
              <div className="neuro-hero-copy">
                <h1 id="neuro-title">
                  Замечайте риски
                  <br className="neuro-desktop-break" /> в сделках,
                  <br className="neuro-desktop-break" /> пока клиент
                  <br className="neuro-desktop-break" /> <span>ещё с вами</span>
                </h1>
                <p className="brand-intro">
                  NeuroROP анализирует CRM и коммуникации, помогает РОПу увидеть проблемные сделки,
                  а менеджеру — определить следующий шаг.
                </p>
                <div className="brand-actions">
                  <ActionLink href="#demo">Посмотреть, как это работает</ActionLink>
                  <ActionLink secondary href="#contact">
                    Обсудить пилот
                  </ActionLink>
                </div>
                <p className="neuro-pilot-label">
                  <span />
                  Продукт в пилотном развитии
                </p>
              </div>
              <ProcessScene />
            </div>
            <div className="neuro-capability-strip">
              {(
                [
                  ['layers', 'Контекст CRM'],
                  ['phone', 'Звонки и коммуникации'],
                  ['chart', 'Риски в сделках'],
                  ['target', 'Следующий шаг'],
                ] as const
              ).map(([icon, text]) => (
                <div key={text}>
                  <Icon name={icon} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="possibilities" className="brand-section neuro-possibilities">
          <div className="brand-container">
            <div className="brand-section-heading">
              <h2>
                Риск часто начинается
                <br />с незаметной паузы
              </h2>
              <p>
                Предложение отправлено, разговор состоялся. Но есть ли у сделки понятное
                продолжение?
              </p>
            </div>
            <div className="neuro-risk-list">
              {situations.map((item, index) => (
                <article key={item.risk}>
                  <span className="brand-icon-box">
                    <Icon name={(['clock', 'phone', 'message'] as const)[index]} />
                  </span>
                  <h3>{item.risk}</h3>
                  <p>{item.context}</p>
                  <a className="brand-text-link" href="#demo">
                    Разобрать ситуацию
                    <Icon name="arrow" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
        <DealDemo />
        <RoleSection />
        <Approach neuro />
        <section className="brand-section neuro-faq">
          <div className="brand-container neuro-faq-grid">
            <div>
              <h2>
                Что важно
                <br />
                знать о продукте
              </h2>
              <p>
                NeuroROP развивается в пилотах. Возможности обсуждаем применительно к вашему
                процессу.
              </p>
            </div>
            <div>
              {[
                [
                  'Это уже готовый массовый продукт?',
                  'NeuroROP — собственный продукт в пилотном развитии. Состав возможностей и границы пилота уточняются до начала работы.',
                ],
                [
                  'С какими CRM можно работать?',
                  'Доступность интеграции проверяется отдельно. На обсуждении пилота уточняем вашу CRM, доступные источники и ограничения; универсальную совместимость не обещаем.',
                ],
                [
                  'AI сам действует за менеджера?',
                  'Здесь показана помощь в анализе контекста и подготовке следующего шага. Решение и действие остаются за человеком. Демонстрация не означает автоматическую запись в CRM.',
                ],
                [
                  'На странице показаны реальные сделки?',
                  'Нет. Все ситуации и интерфейсные фрагменты иллюстративные, с демонстрационными данными. Это не снимки клиентской CRM.',
                ],
                [
                  'Какие данные нужны для пилота?',
                  'Это зависит от задачи. Обсуждаем контекст CRM, звонков, задач и коммуникаций, доступность источников и условия работы с данными. До согласования не просим загружать клиентские материалы на сайт.',
                ],
              ].map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <ContactSection neuro />
      </main>
      <BrandFooter neuro />
    </div>
  );
}
