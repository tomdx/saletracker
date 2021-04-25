import React, { Component, StrictMode } from "react";
import PropTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField, FormControl, Grid } from '@material-ui/core';
import { TrendingUp } from '@material-ui/icons';
import './App.css';
import ProductList from "./ProductList"

const styles = theme => ({
  root: {
    height: 50,
    'padding-top': '10%'
  },
  button: {
    'padding-left': '25px',
    'padding-right': '25px'
  }

})

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pass: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.currentTarget.id]: e.currentTarget.value})
  }

  async handleRegister(event) {
  }
  async handleLogin(event) {
    event.preventDefault()
    let url = 'http://localhost:5000/login';
    let fd = new FormData();
    fd.append("username", this.state.user)
    fd.append("password", this.state.pass)
    await fetch(url, {
      method: 'POST',
      body: fd,
    })
  }

  render() {
    const { classes } = this.props;
    let user_field = (
      <TextField
        variant="outlined"
        size="large"
        id="user"
        type="text"
        label="Username"
        value={this.state.user}
        onChange={this.handleChange}
      />
    )
    let pass_field = (
      <TextField
        variant="outlined"
        size="large"
        id="pass"
        type="password"
        label="Password"
        value={this.state.pass}
        onChange={this.handleChange}
      />
    )
  let login_button = (
      <Button
        className={classes.button}
        size="large"
        type="submit"
        value="Submit"
        onClick={this.handleLogin}
      >
        Login
      </Button>
    )
    let register_button = (
      <Button
        className={classes.button}
        size="large"
        type="submit"
        value="Submit"
        onClick={this.handleRegister}
      >
        Register
      </Button>
    )
    return (
      <div className={classes.root} align="center">
        <h1>saletracker</h1>
        <div>
          {user_field}
        </div>
        <br />
        <div>
          {pass_field}
        </div>
        <br />
        {register_button}
        {login_button}
      </div>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(LoginForm);