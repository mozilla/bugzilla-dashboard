import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = ({
  center: {
    textAlign: 'center',
  },
});

class Spinner extends PureComponent {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.center}>
        <CircularProgress thickness={5} color="primary" />
      </div>
    );
  }
}

export default withStyles(styles)(Spinner);
