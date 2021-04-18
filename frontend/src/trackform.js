import React, { Component, StrictMode } from "react";
import PropTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField, FormControl, Grid } from '@material-ui/core';
import { TrendingUp } from '@material-ui/icons';
import './App.css';
import ProductList from "./ProductBox"

const styles = theme => ({
    root: {
        height: 50,
        "padding": '50px',
        "padding-right": '30%',
    },
    button: {
      "padding-left": '3%'
    }
})

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {url: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({url: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault()
    let url = 'http://localhost:5000/api/add-from-url?user_id=debug&url=' + this.state.url;
    fetch(url).then(res => res.text()).then(txt => console.log(txt))
  }

  render() {
    const { classes } = this.props;
    let track_button = (
            <Button
              className={classes.button}
              size="small"
              type="submit"
              endIcon={<TrendingUp />}
              value="Submit"
            >
              Track
            </Button>
    )
    return (
      <div>
        <form className={classes.root} onSubmit={this.handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              type="text"
              label="Product URL"
              value={this.state.url}
              onChange={this.handleChange}
              InputProps={{endAdornment: track_button}}
            />
        </form>
      </div>
    );
  }
}

NameForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(NameForm);