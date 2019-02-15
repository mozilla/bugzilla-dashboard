import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

export default
@withStyles(theme => ({
  root: {
    textAlign: 'center',
    width: '100%',
    flexGrow: 1,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    overflowX: 'auto',
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
  spinner: {
    color: theme.palette.primary[50],
  },
}))
class Loading extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CircularProgress
          size={50}
          classes={{
            circleIndeterminate: classes.spinner,
          }}
        />
      </div>
    );
  }
}
