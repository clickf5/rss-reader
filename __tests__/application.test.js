import { promises as fs } from 'fs';
import path from 'path';
import { html } from 'js-beautify';

import app from '../src/js/application';

const htmlOptions = {
  preserve_newlines: false,
  unformatted: [],
};

const fixturesPath = path.join(__dirname, '__fixtures__');
const getTree = () => html(document.body.innerHTML, htmlOptions);

beforeEach((done) => {
  fs.readFile(path.join(fixturesPath, 'index.html')).then((data) => {
    const initHTML = data.toString();
    document.documentElement.innerHTML = initHTML;
    app();
    done();
  });
});

test('application', () => {
  expect(getTree()).toMatchSnapshot();
});
