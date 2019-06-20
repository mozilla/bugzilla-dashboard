import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ArrowBack from '@material-ui/icons/ArrowBack';

const styles = ({
  root: {
    display: 'flex',
  },
  title: {
    color: '#565656',
    margin: '0.6rem',
  },
  mainContentContainer: {
    width: '100%',
  },
});

const DetailView = ({
  classes, children, title, onGoBack,
}) => (
  <div className={classes.root}>
    <div>
      <a href="/" onClick={onGoBack} rel="noopener noreferrer">
        <ArrowBack />
      </a>
    </div>
    <div className={classes.mainContentContainer}>
      <h2 className={classes.title}>{title}</h2>
      {children}
    </div>
  </div>
);

DetailView.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  onGoBack: PropTypes.func.isRequired,
};

export default withStyles(styles)(DetailView);
