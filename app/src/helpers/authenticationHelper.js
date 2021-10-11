const jwt = require("jsonwebtoken");

export function isAuthenticated() {
  const token = sessionStorage.getItem("jwt");
  let isAuthed = true;

  if (!token) {
    return false;
  }

  jwt.verify(token, process.env.REACT_APP_SECRET, err => {
    if (err) {
      isAuthed = false;
    }
  });

  return isAuthed;
}

export const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(email).toLowerCase());
};

export const isValidPassword = (password) => {
  if (password.length < 5) {
    return false;
  }

  return true;
};
