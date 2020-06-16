import i18next from 'i18next';
import en from './locales/en';
import 'bootstrap/dist/css/bootstrap.css';
import app from './application';

i18next
  .init({
    lng: 'en',
    debug: false,
    resources: {
      en,
    },
  })
  .then(() => {
    app();
  });
