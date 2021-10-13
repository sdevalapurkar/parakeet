import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Box,
  Typography
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  buttonMargin: {
    marginRight: '0.5rem'
  },
  textFieldMargin: {
    marginBottom: '1rem'
  }
}));

function NewGoalDialog(props) {
  const classes = useStyles();

  return (
    <Dialog open={props.isOpen} onClose={props.handleClose}>
      <DialogTitle>Add New Goal</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter a new goal you wish to work towards achieving! Try to make sure it is something
          you can complete.
        </DialogContentText>
        <Box pt={2}>
          <TextField
            className={classes.textFieldMargin}
            type="text"
            name="goal_name"
            label="What's your goal?"
            id="goal_name"
            onChange={(e) => props.setGoalName(e.target.value)}
            variant="outlined"
            value={props.goalName}
            fullWidth={true}
            required={true}
            placeholder="Learn how to play G Major scale with slurs"
          />
          <TextField
            className={classes.textFieldMargin}
            type="number"
            name="goal_times"
            label="How many times do you need to practice it? Please enter a number."
            id="goal_times"
            onChange={(e) => props.setGoalTimes(e.target.value)}
            variant="outlined"
            value={props.goalTimes}
            fullWidth={true}
            required={true}
            placeholder="25"
          />
          <TextField
            className={classes.textFieldMargin}
            fullWidth
            id="goal_start_date"
            name="goal_start_date"
            label="Start Date"
            variant="outlined"
            required={true}
            value={props.goalStartDate}
            type="date"
            onChange={(e) => props.setGoalStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            id="goal_end_date"
            name="goal_end_date"
            label="End Date"
            variant="outlined"
            required={true}
            value={props.goalEndDate}
            type="date"
            onChange={(e) => props.setGoalEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <Box display="flex" justifyContent="flex-end" pt={1} pr={3} pb={2}>
        <Button
          className={classes.buttonMargin}
          variant="outlined"
          component="label"
          size="medium"
          color="primary"
          onClick={props.handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          component="label"
          size="medium"
          color="primary"
          onClick={props.handleSubmit}
        >
          Add Goal
        </Button>
      </Box>
      {props.goalDialogError && (
        <Box pt={2}>
          <Typography>{props.goalDialogError}</Typography>
        </Box>
      )}
    </Dialog>
  );
}

export default NewGoalDialog;
