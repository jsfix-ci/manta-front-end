// @ts-nocheck

import React, { useEffect, useState } from 'react';
import Svgs from 'resources/icons';
import classNames from 'classnames';
import { getWallets } from '@talismn/connect-wallets';
import { useKeyring } from 'contexts/keyringContext';
import { useMetamask } from 'contexts/metamaskContext';

const WalletSelectIconBar = ({ isMetamaskSelected, setIsMetamaskSelected }) => {
  const { subscribeWalletAccounts, selectedWallet } = useKeyring();
  const { ethAddress } = useMetamask();

  const enabledWallet = getWallets().filter((wallet) => wallet.extension);

  const SubstrateWallets = () =>
    enabledWallet.map((wallet) => (
      <button
        className={classNames(
          `px-5 py-4 ${
            (wallet.extensionName === selectedWallet.extensionName && !isMetamaskSelected) ?
            'bg-account-display' : ''
          }`
        )}
        key={wallet.extensionName}
        onClick={() => {
          subscribeWalletAccounts(wallet);
          setIsMetamaskSelected(false);
        }}
      >
        <img className="w-8 h-8" src={wallet.logo.src} alt={wallet.logo.alt} />
      </button>
    ));

  const MetamaskWallet = () => (
    <button
      className={classNames(
        `px-5 py-4 ${isMetamaskSelected ? 'bg-account-display' : ''}`
      )}
      onClick={() => {
        setIsMetamaskSelected(true);
      }}
    >
      <img className="w-8 h-8" src={Svgs.Metamask} alt={'metamask'} />
    </button>
  );

  return (
    <>
      <SubstrateWallets />
      {ethAddress && <MetamaskWallet />}
    </>
  );
};

export default WalletSelectIconBar;
