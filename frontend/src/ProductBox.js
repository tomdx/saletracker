import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Link } from '@material-ui/core'
import HTMLReactParser from "html-react-parser";



const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 50,
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}))

export default function ProductBox(props) {
  const classes = useStyles()
  if (props.exists === 'false') {
    return null;
  }
  return (
    <div className={classes.root}>
      <Paper className={classes.paper} onClick={() => props.showGraph(props.box_number)}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="productimage" src={props.img_url} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
                  {props.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {HTMLReactParser(props.desc)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {props.vendor_name.charAt(0).toUpperCase() + props.vendor_name.slice(1)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" style={{ cursor: 'pointer' }}>
                  <Link
                    href="#"
                    onClick={() => props.removeProduct(props.vendor_name, props.product_id)} color="inherit"
                  >
                    Remove
                  </Link>
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">Current price: {props.price}</Typography>
              <Typography variant="subtitle1">Regular sale price: {props.price}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
