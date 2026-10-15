import office from './assets/brand/office.webp';
import {
  ActionLink,
  Approach,
  BrandFooter,
  BrandHeader,
  ContactSection,
  Icon,
} from './BrandShared';
import { productLinks } from './products';
import './brand.css';

const voiceSamples = Array.from({ length: 46 }, (_, position) => ({
  id: `sample-${position}`,
  height: 10 + Math.round(Math.abs(Math.sin(position * 1.7) * Math.sin(position * 0.16)) * 66),
}));

function ProductMosaic() {
  return (
    <section id="products" className="brand-section agency-products">
      <div className="brand-container">
        <div className="brand-section-heading">
          <h2>
            Собственные продукты
            <br />и AI-решения
          </h2>
          <p>
            Можно начать с одного решения.
            <br />
            Выбирайте по задаче вашего бизнеса.
          </p>
        </div>
        <div className="agency-mosaic">
          {productLinks.map(({ product, href, icon, short }, index) => (
            <a key={product.name} href={href} className={`agency-product agency-product-${index}`}>
              <div className="agency-product-top">
                <span className="brand-icon-box">
                  <Icon name={icon} />
                </span>
                <span className="agency-product-status">{product.status}</span>
              </div>
              <h3>
                {short}
                <Icon name="arrow" />
              </h3>
              <p>
                {
                  [
                    'Находим потенциальных клиентов и помогаем разобраться в сигналах интереса.',
                    'Первый контакт и квалификация. Менеджер получает контекст для продолжения диалога.',
                    'Риски в сделках, контекст коммуникаций и конкретный следующий шаг для менеджера.',
                    'Индивидуальная автоматизация рабочих процессов под задачу вашей команды.',
                  ][index]
                }
              </p>
              {index === 0 && (
                <div className="agency-lead-scene" aria-hidden="true">
                  <div className="agency-signal-dot">
                    <Icon name="target" />
                  </div>
                  <div>
                    <span>Сигнал интереса</span>
                    <strong>Есть повод начать диалог</strong>
                    <div className="agency-signal-line" />
                  </div>
                  <small>Демо-сценарий</small>
                </div>
              )}
              {index === 1 && (
                <div className="agency-voice-scene" aria-hidden="true">
                  <div className="brand-wave">
                    {voiceSamples.map((sample) => (
                      <i
                        key={sample.id}
                        style={{
                          height: `${sample.height}px`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="agency-call-caption">
                    <Icon name="phone" />
                    <span>
                      «Какая задача
                      <br />
                      для вас актуальна?»
                    </span>
                  </div>
                  <small>Текстовый демо-сценарий · без аудио</small>
                </div>
              )}
              {index === 2 && (
                <div className="agency-control-scene">
                  <div className="agency-control-header">
                    <span>Контроль сделок</span>
                    <small>Демо-данные</small>
                  </div>
                  <div className="agency-control-row">
                    <span>КП отправлено</span>
                    <span className="agency-risk-tag">Нет следующего шага</span>
                  </div>
                  <div className="agency-control-next">
                    <Icon name="spark" />
                    <span>Согласовать дату обсуждения</span>
                    <Icon name="arrow" />
                  </div>
                </div>
              )}
              {index === 3 && (
                <div className="agency-agent-tasks">
                  <span>
                    <Icon name="mail" />
                    Обработка заявок
                  </span>
                  <span>
                    <Icon name="message" />
                    Подготовка ответов
                  </span>
                  <span>
                    <Icon name="layers" />
                    Рабочие процессы
                  </span>
                </div>
              )}
              <span className="agency-product-link">
                {index === 2 ? 'Познакомиться с NeuroROP' : 'Подробнее о направлении'}
                <Icon name="arrow" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AgencyApp() {
  return (
    <div className="brand-site agency-site">
      <div className="agency-opening">
        <div className="agency-hero-photo" aria-hidden="true">
          <img src={office} alt="" width="1600" height="1067" fetchPriority="high" />
        </div>
        <BrandHeader />
        <main id="main">
          <section className="agency-hero brand-container" aria-labelledby="agency-title">
            <div className="agency-hero-copy">
              <h1 id="agency-title">
                AI-решения
                <br />
                для понятных
                <br />
                задач бизнеса
              </h1>
              <p className="brand-intro">
                Развиваем собственные продукты и проектируем AI-автоматизацию: от поиска клиентов до
                помощи команде в ежедневной работе.
              </p>
              <div className="brand-actions">
                <ActionLink href="#contact">Обсудить задачу</ActionLink>
                <ActionLink secondary href="#products">
                  Посмотреть продукты
                </ActionLink>
              </div>
              <ul className="agency-principles">
                <li>
                  <Icon name="layers" />
                  <span>
                    Собственные
                    <br />
                    разработки
                  </span>
                </li>
                <li>
                  <Icon name="target" />
                  <span>
                    Решение
                    <br />
                    под вашу задачу
                  </span>
                </li>
                <li>
                  <Icon name="spark" />
                  <span>
                    Начало
                    <br />с пилота
                  </span>
                </li>
              </ul>
            </div>
            <div className="agency-hero-visual">
              <div className="agency-floating-ui">
                <div>
                  <span className="brand-icon-box">
                    <Icon name="chart" />
                  </span>
                  <span>
                    NeuroROP<small>От контекста — к действию</small>
                  </span>
                  <a href="/neurorop/" aria-label="Познакомиться с NeuroROP">
                    <Icon name="arrow" />
                  </a>
                </div>
                <p>КП отправлено. Что дальше?</p>
                <div className="agency-floating-answer">
                  <Icon name="check" />
                  <span>Согласовать дату обсуждения</span>
                </div>
                <small>Иллюстрация возможностей · демо-данные</small>
              </div>
              <div className="agency-photo-caption">
                <span />
                Технологии в контексте вашей работы
              </div>
            </div>
          </section>
          <ProductMosaic />
          <section className="brand-section agency-business">
            <div className="brand-container">
              <div className="brand-section-heading">
                <h2>
                  Начните с того,
                  <br />
                  что мешает работе
                </h2>
                <p>
                  Разные задачи требуют разных решений. Продукты можно использовать по отдельности.
                </p>
              </div>
              <div className="agency-business-list">
                {[
                  {
                    id: 'lead-generation',
                    title: 'Нужны новые потенциальные клиенты',
                    name: 'Лидогенерация и аналитика',
                    text: 'Выявляем потенциальных клиентов, в том числе по сигналам интереса к конкурентам. Передаём контакты и аналитику для работы менеджеров.',
                    note: 'Сигнал интереса — повод проверить потребность, а не подтверждение готовности купить.',
                    icon: 'target' as const,
                    href: '#contact',
                    cta: 'Обсудить лидогенерацию',
                  },
                  {
                    id: 'voice-agent',
                    title: 'Важно понять, у кого есть потребность',
                    name: 'AI-звонилка',
                    text: 'Голосовой агент проводит первичный контакт, задаёт квалифицирующие вопросы и передаёт результаты отделу продаж.',
                    note: 'Собственный работающий MVP. Дорабатываем продукт; формат демонстрации обсуждается отдельно.',
                    icon: 'phone' as const,
                    href: '#contact',
                    cta: 'Обсудить демонстрацию',
                  },
                  {
                    id: 'deal-control',
                    title: 'Сделки теряют темп и внимание',
                    name: 'NeuroROP',
                    text: 'Контекст CRM и коммуникаций помогает увидеть проблемные сделки и предложить менеджеру следующий шаг.',
                    note: 'Продукт в пилотном развитии. Решение о действии остаётся за человеком.',
                    icon: 'chart' as const,
                    href: '/neurorop/',
                    cta: 'Посмотреть NeuroROP',
                  },
                  {
                    id: 'custom-agents',
                    title: 'Слишком много ручной работы',
                    name: 'Индивидуальные AI-решения',
                    text: 'Изучаем процесс и определяем, где AI-агент, помощник или интеграция может быть полезен команде.',
                    note: 'Развиваемое направление. Возможность реализации оценивается после разбора задачи.',
                    icon: 'spark' as const,
                    href: '#contact',
                    cta: 'Разобрать мой процесс',
                  },
                ].map((item) => (
                  <article className="agency-business-row" id={item.id} key={item.id}>
                    <div className="agency-business-question">
                      <Icon name={item.icon} />
                      <h3>{item.title}</h3>
                    </div>
                    <div>
                      <span className="agency-direction-name">{item.name}</span>
                      <p>{item.text}</p>
                      <p className="brand-note">{item.note}</p>
                      <a className="brand-text-link" href={item.href}>
                        {item.cta}
                        <Icon name="arrow" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
          <Approach />
          <section className="brand-section agency-rick">
            <div className="brand-container agency-rick-grid">
              <div className="agency-rick-copy">
                <span className="brand-icon-box">
                  <Icon name="message" />
                </span>
                <h2>
                  Собственная разработка.
                  <br />
                  Контекст — под рукой.
                </h2>
                <p>
                  Rick / AgentBridge — наша разработка для работы с контекстом переписок и помощью в
                  подготовке ответов.
                </p>
                <p className="brand-note">
                  Пример собственного продукта. Возможности и границы использования обсуждаются под
                  конкретный процесс.
                </p>
                <ActionLink secondary href="#contact">
                  Обсудить похожую задачу
                </ActionLink>
              </div>
              <div className="agency-rick-demo">
                <div className="agency-rick-demo-head">
                  <span className="brand-icon-box">
                    <Icon name="message" />
                  </span>
                  <div>
                    <strong>Rick / AgentBridge</strong>
                    <small>Иллюстративный сценарий</small>
                  </div>
                </div>
                <div className="agency-chat-message">Что мы уже обсуждали с клиентом?</div>
                <div className="agency-chat-reply">
                  <Icon name="spark" />
                  <p>
                    В переписке есть вопрос по условиям предложения. Его стоит учесть при подготовке
                    ответа.
                  </p>
                </div>
                <div className="agency-chat-note">
                  <Icon name="document" />
                  Контекст переписки → помощь с ответом
                </div>
              </div>
            </div>
          </section>
          <section id="about" className="brand-section agency-about">
            <div className="brand-container agency-about-grid">
              <h2>
                AI-агентство.
                <br />
                Свои продукты.
                <br />
                Ваши задачи.
              </h2>
              <div>
                <p className="brand-large-copy">
                  Мы соединяем продуктовый подход и индивидуальную разработку, чтобы технологии
                  вписывались в реальную работу бизнеса.
                </p>
                <p>
                  Наши направления охватывают поиск потенциальных клиентов, квалификацию, помощь
                  команде продаж и автоматизацию процессов. Начать можно с одной конкретной задачи.
                </p>
                <p>
                  Не предполагаем, что все продукты уже объединены в одну платформу. Состав решения
                  и необходимые интеграции определяются отдельно.
                </p>
              </div>
            </div>
          </section>
          <ContactSection />
        </main>
      </div>
      <BrandFooter />
    </div>
  );
}
