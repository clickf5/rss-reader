/* eslint no-param-reassign: ["error", { "props": false }] */
import * as yup from 'yup';
import { uniqueId, keyBy, differenceBy } from 'lodash';
import axios from 'axios';
import setWatchers from './view';
import parse from './parser';

const corsUrl = 'https://cors-anywhere.herokuapp.com/';

const getValidationSchema = (urls) => yup.object().shape({
  url: yup
    .string()
    .required('validation.required')
    .url('validation.url')
    .notOneOf(urls, `validation.notOneOf|${urls}`),
});

const updateValidationState = (state) => {
  try {
    const urls = state.feeds.map((feed) => feed.link);
    const validationSchema = getValidationSchema(urls);
    validationSchema.validateSync(state.form.fields, { abortEarly: false });
    state.form.valid = true;
    state.form.errors = {};
  } catch (e) {
    const errors = keyBy(e.inner, 'path');
    state.form.valid = false;
    state.form.errors = errors;
  }
};

const loadStream = (url) => axios.get(`${corsUrl}${url}`)
  .catch(() => {
    throw new Error('errors.network');
  })
  .then(({ data }) => parse(data));


const reloadStream = (url, feedId, state) => {
  const feedPosts = state.posts.filter((post) => post.feedId === feedId);

  loadStream(url)
    .then((stream) => {
      const { items } = stream;
      const posts = differenceBy(items, feedPosts, 'guid');
      if (posts.length !== 0) {
        state.posts = [...posts, ...state.posts];
      }
      setTimeout(() => reloadStream(url, feedId, state), 5000);
    });
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
        const { feed, items } = stream;
        feed.id = uniqueId();
        feed.link = url;

        state.feeds = [feed, ...state.feeds];

        const posts = items.map((item) => {
          item.feedId = feed.id;
          return item;
        });
        state.posts = [...posts, ...state.posts];

        state.form.processState = 'filling';
        state.form.fields.url = '';

        setTimeout(() => reloadStream(url, feed.id, state), 5000);
      })
      .catch((e) => {
        state.form.processState = 'failed';
        state.form.errors = { url: { message: e.message } };
      });
  });

  setWatchers(state, ui);
};

export default app;
