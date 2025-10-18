class Response {
  constructor(message, data = null, success = true) {
    this.message = message;
    this.data = data;
    this.success = success;
  }
}

module.exports = Response;
