import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

export default class SecretsTest extends React.Component {
  static contextTypes = {
    authController: PropTypes.shape({}).isRequired,
  };

  fetchTaskClusterSecret = async () => {
    const { authController } = this.context;
    if (!authController.userSession) {
      // eslint-disable-next-line no-console
      console.log('login required');
    } else {
      const secretsClient = authController.userSession.getTaskClusterSecretsClient();
      const secret = await secretsClient.get('garbage/rail/test');
      // eslint-disable-next-line no-console
      console.log('secret', secret);
    }
  };

  render() {
    return (
      <div className="container">
        <Button onClick={this.fetchTaskClusterSecret}>
          Click on the button and watch the console for a secret
        </Button>
      </div>
    );
  }
}
