import React, { Component, StrictMode } from "react";
import PropTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField } from '@material-ui/core';
import './App.css';
import ProductBox from "./ProductBox";
import ProductList from "./ProductList"
import TrackForm from "./TrackForm"
import LoginForm from "./login"
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";



class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route exact path="/login">
              <LoginForm />
            </Route>
            <Route path="/tracker">
              <ProductList />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}


export default App;
