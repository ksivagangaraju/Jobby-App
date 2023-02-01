import {Switch, Route, Redirect} from 'react-router-dom'

import Home from './component/Home'
import Login from './component/Login'
import Jobs from './component/Jobs'
import JobItemDetails from './component/JobItemDetails'
import NotFound from './component/NotFound'
import Protected from './component/Protected'

import './App.css'

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Protected exact path="/" component={Home} />
    <Protected exact path="/jobs" component={Jobs} />
    <Protected exact path="/jobs/:id" component={JobItemDetails} />
    <Route exact path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
