// @ts-nocheck
import React from 'react';
import { getWallets } from '@talismn/connect-wallets';
import { useKeyring } from 'contexts/keyringContext';
import { useMetamask } from 'contexts/metamaskContext';
import Svgs from 'resources/icons';
import { setHasAuthToConnectMetamaskStorage } from 'utils/persistence/connectAuthorizationStorage';

const ConnectWalletBlock = ({
  walletName,
  isWalletInstalled,
  walletInstallLink,
  walletLogo,
  isWalletEnabled,
  connectHandler
}) => {
  if (isWalletEnabled) {
    return (
      <div className="mt-6 py-3 px-4 h-16 flex items-center justify-between border border-manta-gray text-white rounded-lg w-full block">
        <div className="flex flex-row items-center gap-4">
          <img
            src={walletLogo.src}
            alt={walletLogo.alt}
            className="w-6 h-6 rounded-full"
          />
          {walletName}
        </div>
        <div className="flex flex-row gap-3 items-center rounded-lg text-xs">
          <div className="rounded full w-2 h-2 bg-green-300"></div>Connected
        </div>
      </div>
    );
  } else if (isWalletInstalled) {
    return (
      <button
        onClick={connectHandler}
        className="mt-6 py-3 px-4 h-16 flex items-center justify-between border border-manta-gray text-white rounded-lg w-full block"
      >
        <div className="flex flex-row items-center gap-4">
          <img
            src={walletLogo.src}
            alt={walletLogo.alt}
            className="w-6 h-6 rounded-full"
          />
          {walletName}
        </div>
        <div className="rounded-lg bg-connect-wallet-modal-button py-2 px-4 text-xs">
          Connect
        </div>
      </button>
    );
  } else {
    return (
      <a
        href={walletInstallLink}
        target="_blank"
        className="mt-6 py-3 px-4 h-16 text-sm flex items-center justify-between border border-manta-gray text-white rounded-lg w-full block"
        rel="noreferrer"
      >
        <div className="flex flex-row items-center gap-4">
          <img
            src={walletLogo.src}
            alt={walletLogo.alt}
            className="w-6 h-6 rounded-full"
          />
          {walletName}
        </div>
        <div className="rounded-lg bg-connect-wallet-modal-button py-2 px-4 text-xs">
          Install
        </div>
      </a>
    );
  }
};

const MetamaskConnectWalletBlock = () => {
  const { setHasAuthConnectMetamask, ethAddress, provider } = useMetamask();

  const onEvmWalletConnecthandler = () => {
    setHasAuthToConnectMetamaskStorage(true);
    setHasAuthConnectMetamask(true);
    provider?.request({ method: 'eth_requestAccounts' });
  };
  return (
    <ConnectWalletBlock
      key={'metamask'}
      walletName={'Metamask'}
      isWalletInstalled={!!window.ethereum}
      walletInstallLink={'https://metamask.io/'}
      walletLogo={{ src: Svgs.Metamask, alt: '' }}
      isWalletEnabled={!!ethAddress}
      connectHandler={onEvmWalletConnecthandler}
    />
  );
};

const SubstrateConnectWalletBlock = ({ setIsMetamaskSelected }) => {
  const { connectWalletExtension } = useKeyring();

  const onSubstrateWalletConnectHandler = (walletName) => () => {
    connectWalletExtension(walletName);
    setIsMetamaskSelected && setIsMetamaskSelected(false);
  };

  const capitalizeFirstLetter = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return getWallets().map((wallet) => {
    // wallet.extension would not be defined if enabled not called
    const isWalletEnabled = wallet.extension ? true : false;

    return (
      <ConnectWalletBlock
        key={wallet.extensionName}
        walletName={capitalizeFirstLetter(wallet.extensionName)}
        isWalletInstalled={wallet.installed}
        walletInstallLink={wallet.installUrl}
        walletLogo={wallet.logo}
        isWalletEnabled={isWalletEnabled}
        connectHandler={onSubstrateWalletConnectHandler(wallet.extensionName)}
      />
    );
  });
};

const ConnectWalletModal = ({ setIsMetamaskSelected }) => {
  return (
    <div className="w-96">
      <h1 className="text-xl text-white">Connect Wallet</h1>
      <SubstrateConnectWalletBlock
        setIsMetamaskSelected={setIsMetamaskSelected}
      />
      <MetamaskConnectWalletBlock />
      <p className="flex flex-row gap-2 mt-5 text-secondary text-xsss">
        <img src={Svgs.InformationIcon} />
        Already installed? Try refreshing this page
      </p>
    </div>
  );
};

export default ConnectWalletModal;
