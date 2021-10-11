import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Box
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  buttonMargin: {
    marginRight: '0.5rem'
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
        <TextField
          type="text"
          name="goal_name"
          label="What's your goal?"
          id="goal_name"
          onChange={(e) => props.setGoalName(e.target.value)}
          variant="outlined"
          value={props.goalName}
          fullWidth={true}
          placeholder="Learn how to play G Major scale with slurs"
        />
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
          variant="outlined"
          component="label"
          size="medium"
          color="primary"
          onClick={props.handleSubmit}
        >
          Add Goal
        </Button>
      </Box>
    </Dialog>
  );
}

export default NewGoalDialog;
