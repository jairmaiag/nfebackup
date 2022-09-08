const ServerError = require("../../errors/ServerError");
const UnauthorizedError = require("../../errors/UnauthorizedError");
const { montarMensagemJson } = require("../../utils");

class httpHelpers {
  ok(data) {
    if (!(data instanceof Object)) {
      data = montarMensagemJson(data);
    }

    return {
      statusCode: 200,
      body: data,
    };
  }

  noContent() {
    return {
      statusCode: 204,
      body: null,
    };
  }

  badRequest(error) {
    return {
      statusCode: 400,
      body: error,
    };
  }

  unauthorized() {
    return {
      statusCode: 401,
      body: new UnauthorizedError(),
    };
  }

  forbidden(error) {
    return {
      statusCode: 403,
      body: error,
    };
  }

  notFound(error) {
    return {
      statusCode: 404,
      body: error,
    };
  }

  serverError(error) {
    return {
      statusCode: 500,
      body: new ServerError(error.stack),
    };
  }
}

module.exports = new httpHelpers();
