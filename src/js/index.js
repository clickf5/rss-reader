import i18next from 'i18next';
import ru from './locales/ru';
import 'bootstrap/dist/css/bootstrap.css';
import app from './application';

i18next
  .init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  })
  .then(() => {
    app();
  });
