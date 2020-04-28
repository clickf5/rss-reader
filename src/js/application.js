const app = () => {
  const state = {
    form: {
      processState: 'filling',
      processError: null,
      fields: {
        url: '',
      },
      valid: true,
      errors: {},
    }
  };

  const form = document.querySelector('.rss-form');
  const elements = {
    url: document.querySelector('[name="url"]'),
  };
  const submitButton = form.querySelector('button[type="submit"]');
};

export default app;
