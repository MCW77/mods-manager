import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    supportedLngs: [
      'en-US'
      , 'de-DE'
    ],
    fallbackLng: 'en-US',
    ns: [
      'domain'
      , 'explore-ui'
      , 'global-ui'
      , 'optimize-ui'
    ],
    defaultNS: 'domain',
    load: 'currentOnly',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      // for all available options read the backend's repository readme file
      loadPath: '../locales/{{lng}}/{{ns}}.json'
    }    
  });

export default i18n;