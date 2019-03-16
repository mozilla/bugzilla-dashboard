import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import blue from '@material-ui/core/es/colors/blue';

const styles = theme => ({
  toggleContainer: {
    height: 56,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: `${theme.spacing.unit}px 0`,
    background: theme.palette.background.default,
  },
  toggleButton: {
    background: blue[100],
  },
});

class ToggleButtons extends React.Component {
    state = {
      category: 'people',
    };

    handleCategory = (event, category) => this.setState({ category });

    render() {
      const { classes } = this.props;
      const { category } = this.state;
      return (
        <Grid container spacing={16}>
          <div className={classes.toggleContainer}>
            <ToggleButtonGroup
              className={classes.toggleButton}
              value={category}
              exclusive
              onChange={this.handleCategory}
            >
              <ToggleButton className={classes.toggleButton} value="people">
                            People
              </ToggleButton>
              <ToggleButton value="teams">
                            Teams
              </ToggleButton>
              <ToggleButton value="components">
                            Components
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Grid>
      );
    }
}

ToggleButtons.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(ToggleButtons);
