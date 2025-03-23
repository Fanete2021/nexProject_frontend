import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';

export enum Namespaces {
    TRANSLATION = 'translation',
    CHANGELOG = 'changelog',
}

export const LOCAL_STORAGE_LANGUAGE_KEY = 'language';
const savedLanguage = localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY);

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        fallbackLng: savedLanguage || 'ru',
        interpolation: {
            escapeValue: false
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json'
        },
        ns: [Namespaces.TRANSLATION, Namespaces.CHANGELOG],
        defaultNS: Namespaces.TRANSLATION,
    });

export default i18n;
