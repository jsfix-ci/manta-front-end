import React from 'react';
import { usePrivateWallet } from 'contexts/privateWalletContext';

const Account = () => {
  const { privateAddress } = usePrivateWallet();

  return <div>{privateAddress}</div>;
};

export default Account;
