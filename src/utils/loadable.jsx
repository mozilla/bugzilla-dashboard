import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import Spinner from '../components/Spinner';

class Loading extends PureComponent {
  content() {
    const { error, timedOut, pastDelay } = this.props;

    if (error) {
      throw error;
    } else if (timedOut || pastDelay) {
      return <Spinner />;
    }

    return null;
  }

  render() {
    return <div>{this.content()}</div>;
  }
}

Loading.propTypes = {
  error: PropTypes.shape({}),
  timedOut: PropTypes.bool,
  pastDelay: PropTypes.bool,
};

Loading.defaultProps = {
  error: '',
  timedOut: false,
  pastDelay: false,
};

export default loader => Loadable({
  loader,
  loading: Loading,
  timeout: 10000,
});
