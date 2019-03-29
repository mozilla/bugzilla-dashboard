/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
import React from 'react';
import { object } from 'prop-types';
import Button from '@material-ui/core/Button';

export default class SecretsTest extends React.Component {
  static contextTypes = {
    authController: object.isRequired,
  };

  fetchTaskClusterSecret = async () => {
    const { userSession } = this.context.authController;
    if (!userSession) {
      console.log('login required');
      return;
    }
    const secretsClient = userSession.getTaskClusterSecretsClient();
    const secret = await secretsClient.get('garbage/rail/test');
    console.log('secret', secret);
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
