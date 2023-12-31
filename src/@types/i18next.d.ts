import 'i18next';
import { defaultNS } from '../i18n';
import domain from '../../public/locales/en-US/domain.json';
import exploreui from '../../public/locales/en-US/explore-ui.json';
import globalui from '../../public/locales/en-US/global-ui.json';
import helpui from '../../public/locales/en-US/help-ui.json';
import optimizeui from '../../public/locales/en-US/optimize-ui.json';
import settingsui from '../../public/locales/en-US/settings-ui.json';

const jsonFormat = 'v3';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: defaultNS;
    resources: {
      ['domain']: typeof domain;
      ['explore-ui']: typeof exploreui;
      ['global-ui']: typeof globalui;
      ['help-ui']: typeof helpui;
      ['optimize-ui']: typeof optimizeui;
      ['settings-ui']: typeof settingsui;
    };
    jsonFormat: typeof jsonFormat;
  };
};

