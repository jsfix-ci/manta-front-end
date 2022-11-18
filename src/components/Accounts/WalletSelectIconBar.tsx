// @ts-nocheck

import React, { useEffect, useState } from 'react';
import Svgs from 'resources/icons';
import classNames from 'classnames';
import { getWallets } from '@talismn/connect-wallets';
import { useKeyring } from 'contexts/keyringContext';
import { useMetamask } from 'contexts/metamaskContext';
import { setHasAuthToConnectMetamaskStorage } from 'utils/persistence/connectAuthorizationStorage';

const WalletSelectIconBar = () => {
  const { subscribeWalletAccounts, selectedWallet } = useKeyring();
  const { ethAddress, isMetamaskSelected, setIsMetamaskSelected } = useMetamask();

  const enabledWallet = getWallets().filter((wallet) => wallet.extension);

  const SubstrateWallets = () =>
    enabledWallet.map((wallet) => (
      <button
        key={wallet.extensionName}
        onClick={() => {
          subscribeWalletAccounts(wallet);
          setIsMetamaskSelected(false);
        }}
      >
        <img
          className={classNames(
            `w-8 h-8 ${
              wallet.extensionName === selectedWallet.extensionName &&
              !isMetamaskSelected
                ? ''
                : 'filter grayscale'
            }`
          )}
          src={wallet.logo.src}
          alt={wallet.logo.alt}
        />
      </button>
    ));

  const MetamaskWallet = () => (
    <button
      key={'metamask'}
      onClick={() => {
        setIsMetamaskSelected(true);
      }}
    >
      <img
        className={classNames(
          `w-8 h-8 ${isMetamaskSelected ? '' : 'filter grayscale'}`
        )}
        src={Svgs.Metamask}
        alt={'metamask'}
      />
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
