import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button
} from '@material-ui/core';
import Header from "./Header";
import RegisterLogin from './RegisterLogin';
import { isAuthenticated } from '../helpers/authenticationHelper';
import { useParams } from 'react-router';
import axios from "axios";
import moment from "moment";

function GoalDetails() {
  const apiHost = process.env.REACT_APP_API_HOST || 'localhost';
  const apiPort = process.env.REACT_APP_API_PORT || '5000';

  const urlParams = useParams();

  const [isAuthed, setIsAuthed] = useState(isAuthenticated());
  const [goalDetails, setGoalDetails] = useState(null);

  useEffect(() => {
    getGoalDetails();
  }, []);

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
        <Box pl="70px" pr="70px" pt={2} pb={2}>
          <Box pb={2}>
            <Typography variant="h5"><b>Goal:</b> {goalDetails.goal_name}</Typography>
          </Box>
          <Typography variant="body1"><b>Times:</b> {goalDetails.goal_times}</Typography>
          <Typography variant="body1"><b>Start Date:</b> {moment(goalDetails.goal_start_date).format('MMM D, YYYY')}</Typography>
          <Typography variant="body1"><b>End Date:</b> {moment(goalDetails.goal_end_date).format('MMM D, YYYY')}</Typography>
          <Box pt={2}>
            <Button
              variant="outlined"
              component="label"
              size="medium"
              color="primary"
              onClick={() => console.log('want to track progress')}
            >
              Track Progress Towards Goal
          </Button>
          </Box>
        </Box>
      )}
    </>
  );
}

export default GoalDetails;
