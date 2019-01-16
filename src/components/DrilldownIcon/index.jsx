import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpandMore from '@material-ui/icons/ExpandMore';

const styles = ({
  svgWrapper: {
    '&:hover': {
      backgroundColor: 'lightGray',
    },
  },
  icon: {
    fontSize: '1rem',
    verticalAlign: 'bottom',
  },
});

const DrilldownIcon = ({
  classes, name, onChange, properties,
}) => (
  <div
    className={classes.svgWrapper}
    name={name}
    onKeyPress={e => onChange(e, properties)}
    onClick={e => onChange(e, properties)}
    role="button"
    tabIndex="0"
  >
    <ExpandMore classes={{ root: classes.icon }} />
  </div>
);

DrilldownIcon.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  properties: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(DrilldownIcon);
