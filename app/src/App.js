import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import { Redirect, Switch } from 'react-router';
import Homepage from './components/Homepage';
import GoalDetails from "./components/GoalDetails";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Redirect exact from="/goal/:goal_id?" to="/goal/:goal_id?/details" />
        <Route
          exact
          path="/goal/:goal_id?/details"
          component={GoalDetails}
        />
      </Switch>
    </Router>
  );
}

export default App;
