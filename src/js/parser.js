const parse = (text) => {
  const result = {
    title: '',
    description: '',
    items: [],
  };

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
  } catch {
    const error = new Error();
    error.type = 'parse';
    throw error;
  }

  return result;
};

export default parse;
