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

function TrackProgressDialog(props) {
  const classes = useStyles();

  return (
    <Dialog open={props.isOpen} onClose={props.handleClose}>
      <DialogTitle>Track Goal Progress</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Track progress towards your goal by entering how much you practiced.
        </DialogContentText>
        <Box pt={2}>
          <TextField
            className={classes.textFieldMargin}
            type="number"
            name="practice_times"
            label="How many times did you practice?"
            id="practice_times"
            onChange={(e) => props.setPracticeTimes(e.target.value)}
            variant="outlined"
            value={props.practiceTimes}
            fullWidth={true}
            required={true}
            placeholder="5"
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
          Track Progress
        </Button>
      </Box>
      {props.trackProgressDialogError && (
        <Box pt={2}>
          <Typography>{props.trackProgressDialogError}</Typography>
        </Box>
      )}
    </Dialog>
  );
}

export default TrackProgressDialog;
