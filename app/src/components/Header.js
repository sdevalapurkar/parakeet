import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Divider
} from '@material-ui/core';
import Icon from '@mdi/react';
import jwt from "jsonwebtoken";
import makeStyles from '@material-ui/core/styles/makeStyles';
import { mdiAccountCircle, mdiLogoutVariant } from '@mdi/js';
import parakeetImage from '../images/parakeet-pic.png';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  govHeader: {
    borderBottom: '2px solid #00a152'
  },
  govHeaderToolbar: {
    height: '70px'
  },
  brand: {
    paddingLeft: '1rem',
    display: 'flex',
    flex: '0 0 auto',
    alignItems: 'center',
    color: 'inherit',
    textDecoration: 'none',
    fontSize: '1.25rem',
    fontWeight: 700,
    '& img': {
      verticalAlign: 'middle'
    },
    '& picture': {
      marginLeft: '1.25rem'
    },
    '&:hover': {
      textDecoration: 'none'
    },
    '&:focus': {
      outlineOffset: '6px'
    }
  },
  userProfile: {
    color: theme.palette.primary.contrastText,
    fontSize: '0.9375rem',
    '& hr': {
      backgroundColor: '#4b5e7e',
      height: '1rem'
    },
    '& a': {
      color: 'inherit',
      textDecoration: 'none'
    },
    '& a:hover': {
      textDecoration: 'underline'
    }
  },
  cursor: {
    cursor: 'pointer'
  }
}));

function Header(props) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <AppBar position="sticky" style={{ boxShadow: 'none' }}>
      <Box className={classes.govHeader}>
        <Toolbar className={classes.govHeaderToolbar}>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex" className={classes.cursor} onClick={() => history.push('/')}>
              <picture>
                <source srcSet={parakeetImage} media="(min-width: 600px)"></source>
                <img src={parakeetImage} alt={'Parakeet'} height="30px" />
              </picture>
              <span className={classes.brand}>
                Parakeet
              </span>
            </Box>
            <Box display="flex" className={classes.userProfile} my="auto" alignItems="center">
              <Icon path={mdiAccountCircle} size={1.25} />
              <Box ml={1}>{jwt.decode(sessionStorage.getItem('jwt')).name}</Box>
              <Box px={2}>
                <Divider orientation="vertical" />
              </Box>
              <Box display="flex" alignItems="center" my="auto">
                <Button
                  variant="contained"
                  component="label"
                  size="medium"
                  color="primary"
                  disableElevation
                  startIcon={<Icon path={mdiLogoutVariant} size={1} />}
                  onClick={props.logoutUser}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
}

export default Header;
