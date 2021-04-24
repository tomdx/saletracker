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
        "padding": '50px',
        "padding-right": '30%',
    },
    button: {
      "padding-left": '3%'
    }

})

class TrackForm extends React.Component {
  constructor(props) {
    super(props);
    let limit = 50
    let items = {}
    for (let i = 0; i < limit; i++) {
      items[i] = {
        exists: 'false',
        vendor_name: '',
        name: '',
        img_url: '',
        price: '',
      }
    }
    this.state = {
      url: '',
      items: items,
      limit: limit,
    };
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
        <ProductList items={this.state.items}/>
      </div>
    );
  }

  componentDidMount() {
    this.populateProducts()
  }

  async populateProducts() {
    let response = await fetch("http://localhost:5000/api/get-all-prices?user_id=debug").then(res => res.json())
    let i = 0;
    let items = {}
    for (let i = 0; i < this.state.limit; i++) {
      items[i] = {
        exists: 'false',
        vendor_name: '',
        name: '',
        img_url: '',
        price: '',
      }
    }
    for (const vendor_name in response) {
      console.log(vendor_name)
      let vendor = response[vendor_name]
      for (const id in vendor) {
        if (i >= this.state.limit) {
          break;
        }
        let p;
        console.log(response)
        let lastprice = vendor[id].prices.pop()[1];
        items[i] = {
          exists: 'true',
          vendor_name: vendor_name,
          name: vendor[id].info.name,
          img_url: vendor[id].info.img_url,
          price: lastprice,
        }
        console.log(response)
        i++;
      }
    }
    this.setState({items: items})
  }
}

TrackForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TrackForm);