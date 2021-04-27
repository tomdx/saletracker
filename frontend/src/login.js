import React, { Component, StrictMode } from "react";
import PropTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField, FormControl, Grid } from '@material-ui/core';
import './App.css';
import { withRouter } from 'react-router-dom'

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
      pass: '',
      error_msg: '⠀',  // This is the blank symbol U+2800
      error_msg_color: 'black'
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.currentTarget.id]: e.currentTarget.value})
  }

  async handleRegister(event) {
    event.preventDefault()
    let url = 'http://sale-tracker.net/api/signup';
    let fd = new FormData();
    fd.append("username", this.state.user)
    fd.append("password", this.state.pass)
    let result = await fetch(url, {
      method: 'POST',
      body: fd,
    }).then(text => text.json())
    console.log(result['success'] )
    if (result['success'] === 'true') {
      this.setState({'error_msg_color': 'green'})
      this.setState({'error_msg': 'Registration successful. Please log in'})
    } else {
      this.setState({'error_msg_color': 'red'})
      this.setState({'error_msg': 'Username taken'})
    }

  }
  async handleLogin(event) {
    event.preventDefault()
    let url = 'http://sale-tracker.net/api/login';
    let fd = new FormData();
    fd.append("username", this.state.user)
    fd.append("password", this.state.pass)
    let result = await fetch(url, {
      method: 'POST',
      body: fd,
    }).then(text => text.json())
    if (result['success'] === 'true') {
      const {history} = this.props;
      history.push('http://sale-tracker.net/tracker')
    } else {
      this.setState({'error_msg_color': 'red'})
      this.setState({'error_msg': 'Invalid credentials'})
    }
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
        <h4 style={{ color: this.state.error_msg_color}}>{this.state.error_msg}</h4>
        {register_button}
        {login_button}
      </div>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withRouter(withStyles(styles)(LoginForm));