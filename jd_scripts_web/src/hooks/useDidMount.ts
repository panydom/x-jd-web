import * as React from 'react';

export default (action: () => any) => {
  React.useEffect(action, [])
}