import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button
} from '@material-ui/core';
import Header from "./Header";
import RegisterLogin from './RegisterLogin';
import { isAuthenticated } from '../helpers/authenticationHelper';
import { useParams, useHistory } from 'react-router';
import axios from "axios";
import moment from "moment";
import TrackProgressDialog from './TrackProgressDialog';
import CircularProgressWithLabel from './CircularProgressWithLabel';

function GoalDetails() {
  const apiHost = process.env.REACT_APP_API_HOST || 'localhost';
  const apiPort = process.env.REACT_APP_API_PORT || '5000';

  const urlParams = useParams();
  const history = useHistory();

  const [isAuthed, setIsAuthed] = useState(isAuthenticated());
  const [goalDetails, setGoalDetails] = useState(null);
  const [practiceTimes, setPracticeTimes] = useState(null);
  const [openTrackProgressDialog, setOpenTrackProgressDialog] = useState(false);
  const [trackProgressDialogError, setTrackProgressDialogError] = useState('');

  useEffect(() => {
    if (openTrackProgressDialog) {
      return;
    }

    getGoalDetails();
  }, [openTrackProgressDialog]);

  const getGoalDetails = async () => {
    const response = await axios.get(
      `http://${apiHost}:${apiPort}/v1/goals/${urlParams['goal_id']}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
        }
      }
    );

    if (!response || !response.data || !response.data.attributes || !response.data.attributes.value) {
      return;
    }

    const { value } = response.data.attributes;

    setGoalDetails(value);
  };

  const handleSubmitTrackProgress = async () => {
    if (!practiceTimes) {
      setTrackProgressDialogError('All fields of the form are required. Please fill them out.');
      return;
    }

    const response = await axios.put(
      `http://${apiHost}:${apiPort}/v1/goals/${goalDetails.id}/progress`, {
        data: {
          goal: {
            id: goalDetails.id,
            practiceTimes: practiceTimes,
            existingPracticeTimes: goalDetails.goal_practice_times || 0
          }
        }
      }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
        }
      }
    );

    if (!response || !response.data) {
      setTrackProgressDialogError('There was an error tracking progress towards your goal. Please try again later.');
      return;
    }

    setOpenTrackProgressDialog(false);
  };

  const logoutUser = () => {
    sessionStorage.removeItem('jwt');
    setIsAuthed(isAuthenticated());
  };

  if (!isAuthed) {
    return (
      <RegisterLogin setIsAuthed={setIsAuthed} />
    );
  }

  return (
    <>
      <Header logoutUser={logoutUser} />

      {goalDetails && (
        <>
          <Box pl="70px" pr="70px" pt={2} pb={2}>
            <Box pb={3} display="flex" justifyContent="space-between">
              <Typography variant="h5"><b>Goal:</b> {goalDetails.goal_name}</Typography>
              <Button
                variant="outlined"
                component="label"
                size="medium"
                color="primary"
                onClick={() => history.push('/')}
              >
                Return Home
              </Button>
            </Box>
            <Typography variant="body1"><b>Times:</b> {goalDetails.goal_times}</Typography>
            <Typography variant="body1"><b>Start Date:</b> {moment(goalDetails.goal_start_date).format('MMM D, YYYY')}</Typography>
            <Typography variant="body1"><b>End Date:</b> {moment(goalDetails.goal_end_date).format('MMM D, YYYY')}</Typography>
            <Box pb={1}>
              <Typography variant="body1"><b>Progress:</b></Typography>
            </Box>
            <CircularProgressWithLabel
              value={goalDetails.goal_practice_times ? (goalDetails.goal_practice_times * 100) / goalDetails.goal_times : 0}
            />
            <Box pt={2}>
              {goalDetails.goal_practice_times < goalDetails.goal_times && (
                <Button
                  variant="outlined"
                  component="label"
                  size="medium"
                  color="primary"
                  onClick={() => setOpenTrackProgressDialog(true)}
                >
                  Track Progress Towards Goal
                </Button>
              )}
              {goalDetails.goal_practice_times >= goalDetails.goal_times && (
                <Typography variant="h6">Congrats! You've completed this goal already.</Typography>
              )}
            </Box>
          </Box>

          <TrackProgressDialog
            isOpen={openTrackProgressDialog}
            handleClose={() => setOpenTrackProgressDialog(false)}
            handleSubmit={() => handleSubmitTrackProgress()}
            goalTimes={goalDetails.goal_times}
            practiceTimes={practiceTimes}
            setPracticeTimes={setPracticeTimes}
            trackProgressDialogError={trackProgressDialogError}
          />
        </>
      )}
    </>
  );
}

export default GoalDetails;
