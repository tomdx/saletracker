import React, { Component, StrictMode } from "react";
import PropTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField } from '@material-ui/core';
import './App.css';
import ProductBox from "./ProductBox";
import ProductList from "./ProductList"
import TrackForm from "./TrackForm"




class App extends Component {
  render() {
    return (
      <div>
        <TrackForm />
      </div>
    )
  }
}


export default App;
