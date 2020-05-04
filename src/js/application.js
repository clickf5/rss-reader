/* eslint no-param-reassign: ["error", { "props": false }] */
import * as yup from 'yup';
import _ from 'lodash';
import setWatchers from './view';

const schema = yup.object().shape({
  url: yup.string().required().url(),
});

const updateValidationState = (state) => {
  try {
    schema.validateSync(state.form.fields, { abortEarly: false });
    state.form.valid = true;
    state.form.errors = {};
  } catch (e) {
    const errors = _.keyBy(e.inner, 'path');
    console.log(errors);
    state.form.valid = false;
    state.form.errors = errors;
  }
};

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
    },
  };

  const ui = {
    form: document.querySelector('.rss-form'),
    elements: {
      url: document.querySelector('input[name="url"]'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
  };

  ui.elements.url.addEventListener('input', (e) => {
    state.form.fields.url = e.target.value;
    updateValidationState(state);
  });

  setWatchers(state, ui);
};

export default app;
