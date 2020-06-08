import { watch } from 'melanke-watchjs';

const renderErrors = (ui, errors) => {
  const { feedback, elements } = ui;
  Object.entries(elements).forEach(([name, element]) => {
    const error = errors[name];
    if (!error) {
      feedback.classList.remove('text-danger');
      feedback.innerHTML = '';
      element.classList.remove('is-invalid');
      return;
    }
    feedback.classList.add('text-danger');
    feedback.innerHTML = error.message;
    element.classList.add('is-invalid');
  });
};

const resetUrl = (ui) => {
  const { url } = ui.elements;
  url.value = '';
};

const renderFeeds = (feeds, ui) => {
  const { rssItems } = ui;
  const feedsHTML = feeds
    .reduce((acc, feed) => [...acc, `<div><div>${feed.title}</div><div>${feed.description}</div></div><hr>`], [])
    .join('');
  rssItems.innerHTML = feedsHTML;
};

const renderPosts = (posts, ui) => {
  const { rssLinks } = ui;
  const postsHTML = posts
    .reduce((acc, post) => [...acc, `<div><a href=${post.link}>${post.title}</a></div>`], [])
    .join('');
  rssLinks.innerHTML = postsHTML;
};

const setWatchers = (state, ui) => {
  watch(state.form, 'processState', () => {
    const { processState } = state.form;
    const { submitButton } = ui;
    switch (processState) {
      case 'failed':
        submitButton.disabled = false;
        break;
      case 'filling':
        submitButton.disabled = false;
        break;
      case 'sending':
        submitButton.disabled = true;
        break;
      default:
        throw new Error(`Unknown state: ${processState}`);
    }
  });

  watch(state.form, 'valid', () => {
    const { submitButton } = ui;
    submitButton.disabled = !state.form.valid;
  });

  watch(state.form, 'errors', () => {
    renderErrors(ui, state.form.errors);
  });

  watch(state.form.fields, 'url', () => {
    const { url } = state.form.fields;
    if (url === '') {
      resetUrl(ui);
    }
  });

  watch(state, 'feeds', () => {
    renderFeeds(state.feeds, ui);
  });

  watch(state, 'posts', () => {
    renderPosts(state.posts, ui);
  });
};

export default setWatchers;
