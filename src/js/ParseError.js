class ParseError extends Error {
  constructor(message) {
    super(message);
    this.type = 'parse';
  }
}

export default ParseError;
