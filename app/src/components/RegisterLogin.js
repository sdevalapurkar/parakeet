import { useState } from "react";
import { Box, TextField, Typography, Button } from "@material-ui/core";
import axios from "axios";
import { isAuthenticated, isValidEmail, isValidPassword } from '../helpers/authenticationHelper';

function RegisterLogin(props) {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const apiHost = process.env.REACT_APP_API_HOST || 'localhost';
  const apiPort = process.env.REACT_APP_API_PORT || '5000';

  const loginOrRegisterUser = async (action) => {
    if (!isValidEmail(email)) {
      setError("Email is invalid, please enter a valid email address.");
      return;
    }

    if (!isValidPassword(password)) {
      setError("Password must be at least 5 characters in length.");
      return;
    }

    const response = await axios.post(
      `http://${apiHost}:${apiPort}/v1/${action}`,
      {
        data: {
          name,
          email,
          password
        }
      }
    );

    if (!response || !response.data) {
      return;
    }

    const { data } = response;

    sessionStorage.setItem('jwt', data.attributes.value);
    props.setIsAuthed(isAuthenticated());
  };

  return (
    <Box p={4}>
      <Box pb={4}>
        <Typography variant="h4">Welcome to Parakeet!</Typography>
      </Box>
      <Box pb={2}>
        {!isLogin && <Typography variant="h6">Register</Typography>}
        {isLogin && <Typography variant="h6">Login</Typography>}
      </Box>
      {!isLogin && (
        <Box pb={2}>
          <TextField
            type="text"
            name="name"
            label="Name"
            id="name"
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            value={name}
            fullWidth={true}
            placeholder="John Smith"
          />
        </Box>
      )}
      <Box pb={2}>
        <TextField
          type="text"
          name="email"
          label="Email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          value={email}
          fullWidth={true}
          placeholder="email@example.com"
        />
      </Box>
      <Box pb={2}>
        <TextField
          type="password"
          name="password"
          label="Password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          value={password}
          fullWidth={true}
          placeholder="***********"
        />
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          component="label"
          size="medium"
          color="primary"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin && <Typography>Register an account</Typography>}
          {!isLogin && (
            <Typography>Already registered, login instead</Typography>
          )}
        </Button>
        <Button
          variant="outlined"
          component="label"
          size="medium"
          color="primary"
          onClick={() => {
            const action = isLogin ? 'login' : 'register';
            loginOrRegisterUser(action);
          }}
        >
          {isLogin && <Typography>Login</Typography>}
          {!isLogin && <Typography>Register</Typography>}
        </Button>
      </Box>
      <Box pt={2}>
        <Typography>{error}</Typography>
      </Box>
    </Box>
  );
}

export default RegisterLogin;
