/* eslint no-param-reassign: ["error", { "props": false }] */
import * as yup from 'yup';
import uniqueId from 'lodash/util';
import keyBy from 'lodash/collection';
import axios from 'axios';
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
    const errors = keyBy(e.inner, 'path');
    // console.log(errors);
    state.form.valid = false;
    state.form.errors = errors;
  }
};

const parseRSS = (text) => {
  const result = {
    title: '',
    description: '',
    items: [],
  };

  const domparser = new DOMParser();
  const mime = 'text/xml';
  const xml = domparser.parseFromString(text, mime);

  result.title = xml.querySelector('channel title').textContent;
  result.description = xml.querySelector('channel description').textContent;

  const items = xml.querySelectorAll('item');
  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').innerHTML;
    result.items.push({ title, description, link });
  });

  return Promise.resolve(result);
};

const loadStream = (url) => {
  const corsApiHost = 'cors-anywhere.herokuapp.com';
  const corsApiUrl = `https://${corsApiHost}/`;
  const urlWithCors = `${corsApiUrl}${url}`;
  return axios.get(urlWithCors)
    .then(({ data }) => parseRSS(data));
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

    loadStream(url)
      .then((stream) => {
        stream.id = uniqueId();
        console.log(stream);
      })
      .catch((error) => {
        state.form.errors = { error };
      });
  });

  setWatchers(state, ui);
};

export default app;
