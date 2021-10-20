import {
  Box,
  Button,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Paper,
  IconButton,
  Link
} from '@material-ui/core';
import Icon from '@mdi/react';
import { isAuthenticated } from '../helpers/authenticationHelper';
import RegisterLogin from './RegisterLogin';
import { mdiTrashCanOutline } from '@mdi/js';
import { useState, useEffect } from 'react';
import axios from "axios";
import { useHistory } from 'react-router';
import moment from "moment";
import NewGoalDialog from './NewGoalDialog';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import Header from './Header';

function Homepage() {
  const apiHost = process.env.REACT_APP_API_HOST || 'localhost';
  const apiPort = process.env.REACT_APP_API_PORT || '5000';

  const history = useHistory();

  const [existingGoals, setExistingGoals] = useState([]);
  const [openNewGoalDialog, setOpenNewGoalDialog] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTimes, setGoalTimes] = useState(null);
  const [goalStartDate, setGoalStartDate] = useState(null);
  const [goalEndDate, setGoalEndDate] = useState(null);
  const [goalDialogError, setGoalDialogError] = useState('');
  const [isAuthed, setIsAuthed] = useState(isAuthenticated());

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

  const logoutUser = () => {
    sessionStorage.removeItem('jwt');
    setIsAuthed(isAuthenticated());
  };

  const getProgressValue = (goalDetails) => {
    if (!goalDetails.goal_practice_times) {
      return 0;
    }

    if (goalDetails.goal_practice_times >= goalDetails.goal_times) {
      return 100;
    }

    return (goalDetails.goal_practice_times * 100) / goalDetails.goal_times;
  };

  const getExistingGoalsTable = () => {
    if (!existingGoals.length) {
      return (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Times</TableCell>
              <TableCell>Start Date</TableCell>
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
              <TableCell>Progress</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody data-testid="goals-table">
            {existingGoals?.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  <Link underline="always" component="button" variant="body2" onClick={() => history.push(`/goal/${row.id}`)}>
                    {row.goal_name}
                  </Link>
                </TableCell>
                <TableCell>{row.goal_times}</TableCell>
                <TableCell>{moment(row.goal_start_date).format('MMM D, YYYY')}</TableCell>
                <TableCell>{moment(row.goal_end_date).format('MMM D, YYYY')}</TableCell>
                <TableCell>
                  <CircularProgressWithLabel
                    value={getProgressValue()}
                  />
                </TableCell>
                <TableCell align="right">
                  <Box my={-1}>
                    <IconButton
                      color="primary"
                      aria-label="delete-goal"
                      data-testid="delete-goal"
                      onClick={() => console.log(row)}>
                      <Icon path={mdiTrashCanOutline} size={1} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (!isAuthed) {
    return (
      <RegisterLogin setIsAuthed={setIsAuthed} />
    );
  }

  return (
    <>
      <Header logoutUser={logoutUser} />

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
