import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Paper
} from '@material-ui/core';
import Icon from '@mdi/react';
import { isAuthenticated } from '../helpers/authenticationHelper';
import jwt from "jsonwebtoken";
import makeStyles from '@material-ui/core/styles/makeStyles';
import { mdiAccountCircle, mdiLogoutVariant } from '@mdi/js';
import parakeetImage from '../images/parakeet-pic.png';
import { useState, useEffect } from 'react';
import axios from "axios";
import moment from "moment";
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
  const apiHost = process.env.REACT_APP_API_HOST || 'localhost';
  const apiPort = process.env.REACT_APP_API_PORT || '5000';

  const classes = useStyles();

  const [existingGoals, setExistingGoals] = useState([]);
  const [openNewGoalDialog, setOpenNewGoalDialog] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTimes, setGoalTimes] = useState(null);
  const [goalStartDate, setGoalStartDate] = useState(null);
  const [goalEndDate, setGoalEndDate] = useState(null);
  const [goalDialogError, setGoalDialogError] = useState('');

  useEffect(() => {
    if (openNewGoalDialog) {
      return;
    }

    getExistingGoals();
  }, [openNewGoalDialog]);

  const getExistingGoals = async () => {
    const response = await axios.get(
      `http://${apiHost}:${apiPort}/v1/goals`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
        }
      }
    );

    if (!response || !response.data || !response.data.attributes || !response.data.attributes.value) {
      return;
    }

    const { value } = response.data.attributes;

    setExistingGoals(value);
  };

  const logoutUser = () => {
    sessionStorage.removeItem('jwt');
    props.setIsAuthed(isAuthenticated());
  };

  const handleSubmitNewGoal = async () => {
    if (!goalName || !goalTimes || !goalStartDate || !goalEndDate) {
      setGoalDialogError('All fields of the form are required. Please fill them out.');
      return;
    }

    const response = await axios.post(
      `http://${apiHost}:${apiPort}/v1/goals`, {
        data: {
          goal: {
            name: goalName,
            time: goalTimes,
            startDate: moment(goalStartDate, 'YYYY-MM-DD').format(),
            endDate: moment(goalEndDate, 'YYYY-MM-DD').format()
          }
        }
      }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
        }
      }
    );

    if (!response || !response.data) {
      setGoalDialogError('There was an error adding your goal. Please try again later.');
      return;
    }

    setOpenNewGoalDialog(false);
  };

  const getExistingGoalsTable = () => {
    if (!existingGoals.length) {
      return (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Times</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4}>
                <Box display="flex" justifyContent="center">
                  No Results
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    }

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Times</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody data-testid="goals-table">
            {existingGoals?.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.goal_name}
                </TableCell>
                <TableCell>{row.goal_times}</TableCell>
                <TableCell>{moment(row.goal_start_date).format('MMM D, YYYY')}</TableCell>
                <TableCell>{moment(row.goal_end_date).format('MMM D, YYYY')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
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
        <Paper>
          {getExistingGoalsTable()}
        </Paper>
      </Box>

      <NewGoalDialog
        isOpen={openNewGoalDialog}
        handleClose={() => setOpenNewGoalDialog(false)}
        handleSubmit={() => handleSubmitNewGoal()}
        goalName={goalName}
        setGoalName={setGoalName}
        goalTimes={goalTimes}
        setGoalTimes={setGoalTimes}
        goalStartDate={goalStartDate}
        setGoalStartDate={setGoalStartDate}
        goalEndDate={goalEndDate}
        setGoalEndDate={setGoalEndDate}
        goalDialogError={goalDialogError}
      />
    </>
  );
}

export default Homepage;
