import fs from 'fs';
import path from 'path';
import { html } from 'js-beautify';

import app from "../src/js/application";

const htmlOptions = {
  preserve_newlines: false,
  unformatted: [],
};

const fixturesPath = path.join(__dirname, '__fixtures__');
const getTree = () => html(document.body.innerHTML, htmlOptions);

beforeEach(() => {
  const initHtml = fs.readFileSync(path.join(fixturesPath, 'index.html')).toString();
  document.documentElement.innerHTML = initHtml;
  app();
});

test('application', () => {
  expect(getTree()).toMatchSnapshot();
});
