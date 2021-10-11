function getCustomError(status) {
  switch (status) {
    case 204:
      return {
        errors: [
          {
            status: 204,
            title: "No Content",
          },
        ],
      };
    case 400:
      return {
        errors: [
          {
            status: 400,
            title: "Bad Request",
          },
        ],
      };
    case 401:
      return {
        errors: [
          {
            status: 401,
            title: "Access Denied",
          },
        ],
      };
    case 406:
      return {
        errors: [
          {
            status: 406,
            title: "Not Acceptable",
          },
        ],
      };
    case 415:
      return {
        errors: [
          {
            status: 415,
            title: "Unsupported Media Type",
          },
        ],
      };
    default:
      return {
        errors: [
          {
            status: 500,
            title: "Internal Server Error",
          },
        ],
      };
  }
}

module.exports = {
  getCustomError
};
