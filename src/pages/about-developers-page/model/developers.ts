import Motvey from '@/shared/assets/images/developerMotvey.jpg';
import Kolya from '@/shared/assets/images/developerKolya.jpg';

interface Developer {
    photo: string,
    name: string,
    telegram: string,
    github: string,
    roles: string[],
    description: string[],
}

/* eslint-disable max-len */
export const developers: Developer[] = [
  {
    photo: Motvey,
    name: 'Матвей Слабухин',
    telegram: 'https://t.me/moootvey',
    github: 'https://github.com/moootvey',
    roles: [
      'Разработчик функциональности',
      'Автор технических заданий',
      'Администратор серверов',
      'Backend-разработчик',
      'DevOps-инженер',
      'Тимлид',
      'CEO'
    ],
    description: [
      'Принимал активное участие в разработке. Отвечал за создание и поддержку серверной части, начиная с проектирования архитектуры и заканчивая развёртыванием готового решения. Его работа включала разработку API для взаимодействия между клиентской частью и сервером, что позволило обеспечить стабильную и быструю работу платформы даже при высоких нагрузках.',
      'Занимался настройкой серверов, оптимизацией производительности и внедрением DevOps-практик. Отдельно стоит отметить его вклад в обеспечение безопасности проекта: внедрял механизмы защиты данных, шифрование.',
      'Благодаря его усилиям, команда смогла быстро и эффективно реализовать ключевые функции.'
    ]
  },
  {
    photo: Kolya,
    name: 'Николай Гончаров',
    telegram: 'https://t.me/nomihs',
    github: 'https://github.com/Fanete2021',
    roles: [
      'Frontend-разработчик'
    ],
    description: [
      'Занимался вёрсткой сайтов и подготовкой макетов.'
    ]
  }
];
