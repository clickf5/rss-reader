/* eslint no-param-reassign: ["error", { "props": false }] */
import * as yup from 'yup';
import { uniqueId, keyBy } from 'lodash';
import axios from 'axios';
import i18next from 'i18next';
import setWatchers from './view';

const getSchema = (arr) => yup.object().shape({
  url: yup
    .string()
    .required(i18next.t('validation.required'))
    .url(i18next.t('validation.url'))
    .notOneOf(arr, (err) => i18next.t('validation.notOneOf', { values: `${err.values}` })),
});

const updateValidationState = (state) => {
  try {
    const schema = getSchema(state.streams);
    schema.validateSync(state.form.fields, { abortEarly: false });
    state.form.valid = true;
    state.form.errors = {};
  } catch (e) {
    const errors = keyBy(e.inner, 'path');
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

  const promise = new Promise((resolve, reject) => {
    try {
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

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

  return promise;
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
    feeds: [],
    posts: [],
  };

  const ui = {
    form: document.querySelector('.rss-form'),
    elements: {
      url: document.querySelector('input[name="url"]'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('div.feedback'),
    rssItems: document.querySelector('div.rss-items'),
    rssLinks: document.querySelector('div.rss-links'),
  };

  ui.elements.url.addEventListener('input', (event) => {
    state.form.fields.url = event.target.value;
    updateValidationState(state);
  });

  ui.form.addEventListener('submit', (event) => {
    event.preventDefault();
    state.form.processState = 'sending';
    const { url } = state.form.fields;

    loadStream(url)
      .then((stream) => {
        const { title, description, items } = stream;
        const feed = { title, description };
        feed.id = uniqueId();
        feed.link = url;
        state.streams.push(url);
        state.feeds = [feed, ...state.feeds];

        const posts = items.map((item) => {
          item.feedId = feed.id;
          return item;
        });
        state.posts = [...posts, ...state.posts];

        state.form.processState = 'filling';
        state.form.fields.url = '';
      })
      .catch(() => {
        state.form.processState = 'failed';
        state.form.errors = { url: { message: i18next.t('network.error') } };
      });
  });

  setWatchers(state, ui);
};

export default app;
