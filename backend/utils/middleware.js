// ./utils/middleware.js
const errorHandler = (error, request, response, next) => {
  console.log("errorHandler called");
  console.error(error.message);
  console.log(error);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  } else if (error.message === "User not found") {
    return response.status(404).end();
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

export { errorHandler, unknownEndpoint };
