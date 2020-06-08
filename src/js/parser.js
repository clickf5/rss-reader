const parse = (text) => {
  const result = {
    feed: {
      title: '',
      description: '',
    },
    items: [],
  };

  try {
    const domparser = new DOMParser();
    const mime = 'text/xml';
    const xml = domparser.parseFromString(text, mime);

    result.feed.title = xml.querySelector('channel title').textContent;
    result.feed.description = xml.querySelector('channel description').textContent;

    const items = xml.querySelectorAll('item');
    items.forEach((item) => {
      const title = item.querySelector('title').textContent;
      const description = item.querySelector('description').textContent;
      const link = item.querySelector('link').innerHTML;
      const guid = item.querySelector('guid').textContent;
      const post = {
        title,
        description,
        link,
        guid,
      };
      result.items.push(post);
    });
  } catch {
    const error = new Error();
    error.type = 'parse';
    throw error;
  }

  return result;
};

export default parse;
