import { promises as fs } from 'fs';
import path from 'path';
import { html } from 'js-beautify';
import userEvent from '@testing-library/user-event';
import timer from 'timer-promise';
// import axiosVCR from 'axios-vcr';

import app from '../src/js/application';

const htmlOptions = {
  preserve_newlines: false,
  unformatted: [],
};

const fixturesPath = path.join(__dirname, '__fixtures__');
const getTree = () => html(document.body.innerHTML, htmlOptions);

// const cassette = path.join(fixturesPath, 'response.json');

let elements;

beforeEach((done) => {
  fs.readFile(path.join(fixturesPath, 'index.html'))
    .then((data) => {
      const initHTML = data.toString();
      document.documentElement.innerHTML = initHTML;
      app();
      elements = {
        url: document.querySelector('[name="url"]'),
        form: document.querySelector('form.rss-form'),
      };
      done();
    });
});

test('init and wrong url', () => {
  expect(getTree()).toMatchSnapshot();
  return Promise
    .resolve()
    .then(() => userEvent.type(elements.url, 'wrong url', { allAtOnce: true }))
    .then(() => elements.url.setAttribute('value', 'wrong url'))
    .then(() => timer.start(10))
    .then(() => expect(getTree()).toMatchSnapshot());
});

test('valid url', () => Promise
  .resolve()
  .then(() => userEvent.type(elements.url, 'https://vc.ru/rss', { allAtOnce: true }))
  .then(() => elements.url.setAttribute('value', 'https://vc.ru/rss'))
  .then(() => timer.start(10))
  .then(() => expect(getTree()).toMatchSnapshot()));

test('required url', () => Promise
  .resolve()
  .then(() => userEvent.type(elements.url, '', { allAtOnce: true }))
  .then(() => elements.url.setAttribute('value', ''))
  .then(() => timer.start(10))
  .then(() => expect(getTree()).toMatchSnapshot()));

// test('double url', () => {
//   axiosVCR.mountCassette(cassette);
//   return Promise
//     .resolve()
//     .then(() => userEvent.type(elements.url, 'https://vc.ru/rss', { allAtOnce: true }))
//     .then(() => elements.url.setAttribute('value', 'https://vc.ru/rss'))
//     .then(() => timer.start(10))
//     .then(() => elements.form.submit())
//     .then(() => timer.start(10))
//     .then(() => timer.start(10))
//     .then(() => timer.start(10))
//     .then(() => timer.start(10))
//     .then(() => timer.start(10))
//     .then(() => userEvent.type(elements.url, 'https://vc.ru/rss', { allAtOnce: true }))
//     .then(() => elements.url.setAttribute('value', 'https://vc.ru/rss'))
//     .then(() => timer.start(10))
//     .then(() => expect(getTree()).toMatchSnapshot());
// });
