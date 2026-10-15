export const products = [
  { name: 'Лидогенерация', status: 'Работает' },
  { name: 'AI-звонилка', status: 'Рабочий MVP · дорабатывается' },
  { name: 'NeuroROP', status: 'Пилотное развитие' },
  { name: 'Индивидуальные AI-решения', status: 'Направление развития' },
];

export const productLinks = [
  {
    product: products[0],
    href: '#lead-generation',
    icon: 'target',
    short: 'Лидогенерация и аналитика',
  },
  { product: products[1], href: '#voice-agent', icon: 'phone', short: 'AI-звонилка' },
  { product: products[2], href: '/neurorop/', icon: 'chart', short: 'NeuroROP' },
  { product: products[3], href: '#custom-agents', icon: 'spark', short: 'AI-агенты' },
] as const;
