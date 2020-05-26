/* eslint no-param-reassign: ["error", { "props": false }] */
import * as yup from 'yup';
import _ from 'lodash';
import setWatchers from './view';

const getSchema = (arr) => yup.object().shape({
  url: yup.string().required().url().notOneOf(arr),
});

const updateValidationState = (state) => {
  try {
    const schema = getSchema(state.streams);
    schema.validateSync(state.form.fields, { abortEarly: false });
    state.form.valid = true;
    state.form.errors = {};
  } catch (e) {
    const errors = _.keyBy(e.inner, 'path');
    // console.log(errors);
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
    streams: [],
  };

  const ui = {
    form: document.querySelector('.rss-form'),
    elements: {
      url: document.querySelector('input[name="url"]'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('div.feedback'),
  };

  ui.elements.url.addEventListener('input', (e) => {
    state.form.fields.url = e.target.value;
    updateValidationState(state);
  });

  ui.form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.form.processState = 'sending';
    const { url } = state.form.fields;
    // todo add http request
    state.streams.push(url);
    state.form.fields.url = '';
    state.form.processState = 'filling';
  });

  setWatchers(state, ui);
};

export default app;
