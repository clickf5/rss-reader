import { promises as fs } from 'fs';
import path from 'path';
import { html } from 'js-beautify';
import userEvent from '@testing-library/user-event';

import app from '../src/js/application';

const htmlOptions = {
  preserve_newlines: false,
  unformatted: [],
};

const fixturesPath = path.join(__dirname, '__fixtures__');
const getTree = () => html(document.body.innerHTML, htmlOptions);

let elements;

beforeEach((done) => {
  fs.readFile(path.join(fixturesPath, 'index.html')).then((data) => {
    const initHTML = data.toString();
    document.documentElement.innerHTML = initHTML;
    app();
    elements = {
      urlInput: document.querySelector('[name="url"]'),
    };
    done();
  });
});

test('application', () => {
  expect(getTree()).toMatchSnapshot();

  userEvent.type(elements.urlInput, 'wrong url', { allAtOnce: true })
    .then(() => {
      elements.urlInput.setAttribute('value', 'wrong url');
      expect(getTree()).toMatchSnapshot();
    });
});
