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
      <div className="mt-6 p-4 flex items-center justify-between border border-manta-gray text-secondary rounded-xl w-full block">
        <div className="flex flex-row items-center gap-2">
          <img src={walletLogo.src} alt={walletLogo.alt} className="w-8 h-8" />
          {walletName}
        </div>
        <div className="text-black dark:text-white">Connected</div>
      </div>
    );
  } else if (isWalletInstalled) {
    return (
      <button
        onClick={connectHandler}
        className="mt-6 p-4 flex items-center justify-between border border-manta-gray text-secondary rounded-xl w-full block"
      >
        <div className="flex flex-row items-center gap-2">
          <img src={walletLogo.src} alt={walletLogo.alt} className="w-8 h-8" />
          {walletName}
        </div>
        <div className="text-link">Connect</div>
      </button>
    );
  } else {
    return (
      <a
        href={walletInstallLink}
        target="_blank"
        className="mt-6 p-4 text-sm flex items-center justify-between border border-manta-gray text-secondary rounded-xl w-full block"
        rel="noreferrer"
      >
        <div className="flex flex-row items-center gap-2">
          <img src={walletLogo.src} alt={walletLogo.alt} className="w-8 h-8" />
          {walletName}
        </div>
        <div className="text-link">Install</div>
      </a>
    );
  }
};

const ConnectWalletModal = () => {
  const { connectWalletExtension } = useKeyring();
  const { setHasAuthConnectMetamask, ethAddress, setIsMetamaskSelected, provider } = useMetamask();

  const onSubstrateWalletConnectHandler = (walletName) => () => {
    connectWalletExtension(walletName)
    setIsMetamaskSelected && setIsMetamaskSelected(false)
  }
  const onEvmWalletConnecthandler = () => {
    if (ethAddress) {
      setHasAuthToConnectMetamaskStorage(true);
      setHasAuthConnectMetamask(true)
    } else {
      provider.request({ method: 'eth_requestAccounts' });
    }
  }
  return (
    <div className="p-4 w-96">
      <h1 className="text-secondary text-xl">Connect wallet</h1>
      {getWallets().map((wallet) => (
        <ConnectWalletBlock
          key={wallet.extensionName}
          walletName={wallet.extensionName}
          isWalletInstalled={wallet.installed}
          walletInstallLink={wallet.installUrl}
          walletLogo={wallet.logo}
          // wallet.extension would not be defined if enabled not called
          isWalletEnabled={wallet.extension}
          connectHandler={onSubstrateWalletConnectHandler(wallet.extensionName)}
        />
      ))}
      {/* setHasAuthConnectMetamask would be undefined when not in bridge page */}
      {setHasAuthConnectMetamask && <ConnectWalletBlock
        key={'metamask'}
        walletName={'metamask'}
        isWalletInstalled={!!window.ethereum}
        walletInstallLink={"https://metamask.io/"}
        walletLogo={{src: Svgs.Metamask, alt: ''}}
        isWalletEnabled={!!ethAddress}
        connectHandler={onEvmWalletConnecthandler}
      />}
    </div>
  );
};

export default ConnectWalletModal;
