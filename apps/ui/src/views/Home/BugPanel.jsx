import React, { Component } from 'react';
import { node, string } from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import bugSearch from '../../bugSearch.graphql';
import needinfoBugs from '../../queries/needinfoBugs';
import p1Bugs from '../../queries/p1Bugs';
import untriagedBugs from '../../queries/untriagedBugs';

const query = (name, search) =>
  graphql(bugSearch, {
    props: ({ data }) => ({
      [`loading${name[0].toUpperCase()}${name.slice(1)}`]: data.loading,
      [name]: data.bugs,
    }),
    options: props => ({
      variables: { search: { ...search, ...props.search } },
    }),
  });

export default
@compose(
  query('untriaged', untriagedBugs),
  query('needinfo', needinfoBugs),
  query('p1', p1Bugs)
)
@withStyles(theme => ({
  root: {
    margin: theme.spacing.unit * 3,
  },
  panel: {
    '&:hover': {
      cursor: 'initial !important',
    },
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  column: {
    flexBasis: '33.33%',
  },
  chip: {
    height: theme.spacing.unit * 3,
  },
  chipLabel: {
    fontSize: '0.8rem',
  },
  chipAvatar: {
    fontSize: '0.8rem',
    height: theme.spacing.unit * 3,
    width: theme.spacing.unit * 3,
    marginRight: -6,
  },
}))
class BugPanel extends Component {
  static propTypes = {
    name: string.isRequired,
    children: node,
  };

  state = {
    expanded: false,
  };

  handleChange = (e, expanded) => {
    if (this.props.children) {
      this.setState({ expanded });
    }
  };

  render() {
    const { name, untriaged, needinfo, p1, classes, children } = this.props;
    const { expanded } = this.state;
    const chipClasses = {
      avatar: classes.chipAvatar,
      label: classes.chipLabel,
    };
    const columns = {
      Untriaged: [untriaged, 'secondary'],
      Needinfos: [needinfo, 'default'],
      P1s: [p1, 'primary'],
    };

    return (
      <ExpansionPanel expanded={expanded} onChange={this.handleChange}>
        <ExpansionPanelSummary
          expandIcon={children ? <ExpandMoreIcon /> : null}
          className={children ? null : classes.panel}>
          <div className={classes.column}>
            <Typography>
              <strong>{name}</strong>
            </Typography>
          </div>
          {Object.entries(columns).map(([label, [data, color]]) => (
            <div
              key={`panel-column-${name}-${label}`}
              className={classes.column}>
              <Chip
                classes={chipClasses}
                avatar={<Avatar>{data ? data.edges.length : 0}</Avatar>}
                label={label}
                className={classes.chip}
                color={color}
                variant="outlined"
              />
            </div>
          ))}
        </ExpansionPanelSummary>
        {/* TODO: Either insert charts via children or directly here: */}
        {children && <ExpansionPanelDetails>{children}</ExpansionPanelDetails>}
      </ExpansionPanel>
    );
  }
}
