import React from 'react';
import PropTypes from 'prop-types';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { withStyles } from '@material-ui/core/styles';
import getLinkToComponent from '../../utils/bugzilla/getLinkToComponent';
import getUntriagedBugsCount from '../../utils/bugzilla/getUntriagedBugsCount';

const styles = theme => ({
  root: {
    color: theme.palette.text.primary,
  },
  icon: {
    margin: 0,
    fontSize: '1rem',
    verticalAlign: 'text-top',
  },
});

class BugzillaComponentSummary extends React.Component {
  state = {
    untriaged: undefined,
  };

  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    product: PropTypes.string.isRequired,
    component: PropTypes.string.isRequired,
  };

  async componentDidMount() {
    this.fetchData(this.props);
  }

  async fetchData({ product, component }) {
    const untriaged = await getUntriagedBugsCount(product, component);
    this.setState({ untriaged });
  }

  render() {
    const { classes, product, component } = this.props;
    const { untriaged } = this.state;
    return (
      <div className={classes.root}>
        <span>{`${product}::${component}`}</span>
        <a
          href={getLinkToComponent(product, component)}
          target="_blank"
          rel="noopener noreferrer"
          title="Link to component's untriaged bugs"
        >
          <OpenInNew className={classes.icon} />
        </a>
        {!!untriaged && <span title="Number of untriaged bugs">{untriaged}</span>}
      </div>
    );
  }
}

export default withStyles(styles)(BugzillaComponentSummary);
