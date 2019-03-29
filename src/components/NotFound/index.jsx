import React from 'react';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';

export default class NotFound extends React.PureComponent {
  render() {
    const ex = Object.assign(
      new Error('The requested route was not found.'),
      {
        response: {
          status: 404,
        },
      },
    );

    return <ErrorPanel error={ex} />;
  }
}
