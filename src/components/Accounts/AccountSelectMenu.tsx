// @ts-nocheck
import classNames from 'classnames';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { useKeyring } from 'contexts/keyringContext';
import { useTxStatus } from 'contexts/txStatusContext';
import { useMetamask } from 'contexts/metamaskContext';
import { useBridgeData } from 'pages/BridgePage/BridgeContext/BridgeDataContext';
import React, { useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import Svgs from 'resources/icons';
import WalletSelectBar from './WalletSelectIconBar';
import ConnectWallet from './ConnectWallet';
import AccountSelectDropdown from './AccountSelectDropdown';

const DisplayAccountsButton = () => {
  const { txStatus } = useTxStatus();
  const disabled = txStatus?.isProcessing();
  const { selectedWallet } = useKeyring();
  const { ethAddress } = useMetamask();
  const { externalAccount } = useExternalAccount();
  const { destinationChain, originChain } = useBridgeData();
  const [showAccountList, setShowAccountList] = useState(false);
  const [addressCopied, setAddressCopied] = useState(-1);
  const [isMetamaskSelected, setIsMetamaskSelected] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => addressCopied >= 0 && setAddressCopied(-1),
      2000
    );
    return () => clearTimeout(timer);
  }, [addressCopied]);

  const onClickAccountSelect = () => {
    !disabled && setShowAccountList(!showAccountList);
  };

  const isMoonriverEnabled = !!ethAddress && (originChain?.name === 'moonriver' || destinationChain?.name === 'moonriver');

  return (
    <div className="relative">
      <OutsideClickHandler onOutsideClick={() => setShowAccountList(false)}>
        <div
          className={classNames(
            'flex gap-3 py-3 p-6 border border-white border-opacity-20 bg-white bg-opacity-5 dark:text-black dark:text-white',
            'font-medium cursor-pointer rounded-lg items-center',
            { disabled: disabled }
          )}
          onClick={onClickAccountSelect}
        >
          <img
            className="w-6 h-6"
            src={selectedWallet.logo.src}
            alt={selectedWallet.logo.alt}
          />
          {isMoonriverEnabled && (
            <img className="w-6 h-6" src={Svgs.Metamask} alt={'metamask'} />
          )}
          {externalAccount?.meta.name}
        </div>
        {showAccountList && (
          <div className="flex flex-col mt-3 absolute right-0 top-full border border-white border-opacity-20 rounded-lg text-black dark:text-white">
            <div className="flex flex-row items-center justify-between bg-account-icon-bar rounded-lg">
              <div className="flex flex-row items-center">
                <WalletSelectBar
                  isMetamaskSelected={isMetamaskSelected}
                  setIsMetamaskSelected={setIsMetamaskSelected}
                />
              </div>
              <div className="relative top-1">
                <ConnectWallet
                  isButtonShape={false}
                  setIsMetamaskSelected={setIsMetamaskSelected}
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto bg-account-display px-5 py-5 rounded-lg">
              <AccountSelectDropdown isMetamaskSelected={isMetamaskSelected} />
            </div>
          </div>
        )}
      </OutsideClickHandler>
    </div>
  );
};

const AccountSelectMenu = () => {
  const { externalAccount } = useExternalAccount();

  return externalAccount ? (
    <DisplayAccountsButton />
  ) : (
    <ConnectWallet isButtonShape={true} />
  );
};

export default AccountSelectMenu;
