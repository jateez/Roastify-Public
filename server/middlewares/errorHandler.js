const errorHandler = async (err, req, res, next) => {
  let status = err.status || 500;
  let name = err.name || "Internal Server Error";

  switch (name) {
    case "Unauthenticated":
    case "JsonWebTokenError":
      status = 401;
      err.message = "Error Unauthorized"
      break;
    case "Unauthorized":
      status = 401;
      err.message = "Error credentials does not match";
      break;
    case "Forbidden":
      status = 403;
      err.message = "Error Forbidden"
      break;
    case "NotFound":
      status = 404;
      err.message = "Error Data not found"
      break;
    case "SequelizeValidationError":
      status = 400;
      break;
    case "SequelizeUniqueConstraintError":
      err.message = "Error Account already exists"
      status = 400;
      break;
    case "BadRequest":
      status = 400;
      err.message = "Error Bad Request"
      break;
    case "CredentialsRequired":
      status = 400;
      err.message = "Error Credentials are required, please input the correct credentials";
      break;
    case "ErrorUploadingImage":
      status = 400;
      err.message = "Error Uploading Image. Please make sure file uploaded is in image format";
      break;
    case "Internal Server Error":
      err.message = "Internal Server Error";
      break;
  }
  res.status(status).json({ message: err.message })
}

module.exports = errorHandler