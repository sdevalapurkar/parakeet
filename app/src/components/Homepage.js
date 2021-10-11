import { Box, Button, Typography, AppBar, Toolbar, Divider } from '@material-ui/core';
import Icon from '@mdi/react';
import { isAuthenticated } from '../helpers/authenticationHelper';
import jwt from "jsonwebtoken";
import makeStyles from '@material-ui/core/styles/makeStyles';
import { mdiAccountCircle, mdiLogoutVariant } from '@mdi/js';
import parakeetImage from '../images/parakeet-pic.png';
import { useState } from 'react';
import NewGoalDialog from './NewGoalDialog';

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
  }
}));

function Homepage(props) {
  const classes = useStyles();

  const [openNewGoalDialog, setOpenNewGoalDialog] = useState(false);
  const [goalName, setGoalName] = useState('');

  const logoutUser = () => {
    sessionStorage.removeItem('jwt');
    props.setIsAuthed(isAuthenticated());
  };

  return (
    <>
      <AppBar position="sticky" style={{ boxShadow: 'none' }}>
        <Box className={classes.govHeader}>
          <Toolbar className={classes.govHeaderToolbar}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Box display="flex">
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
                    onClick={logoutUser}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>

      <Box pl="70px" pr="70px" pt={2} pb={2}>
        <Box pb={3} display="flex" justifyContent="space-between">
          <Typography variant="h5">My Goals</Typography>
          <Button
            variant="outlined"
            component="label"
            size="medium"
            color="primary"
            onClick={() => setOpenNewGoalDialog(true)}
          >
            Add New Goal
          </Button>
        </Box>
      </Box>

      <NewGoalDialog
        isOpen={openNewGoalDialog}
        handleClose={() => setOpenNewGoalDialog(false)}
        handleSubmit={() => console.log('submit')}
        goalName={goalName}
        setGoalName={setGoalName}
      />
    </>
  );
}

export default Homepage;
