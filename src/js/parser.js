const parse = (text) => {
  const result = {
    feed: {},
    items: [],
  };
  try {
    const domparser = new DOMParser();
    const xml = domparser.parseFromString(text, 'text/xml');
    result.feed.title = xml.querySelector('channel title').textContent;
    result.feed.description = xml.querySelector('channel description').textContent;
    const items = xml.querySelectorAll('item');
    items.forEach((item) => {
      result.items = [
        ...result.items,
        {
          title: item.querySelector('title').textContent,
          description: item.querySelector('description').textContent,
          link: item.querySelector('link').innerHTML,
          guid: item.querySelector('guid').textContent,
        },
      ];
    });
  } catch {
    const error = new Error();
    error.type = 'parse';
    throw error;
  }
  return result;
};

export default parse;
