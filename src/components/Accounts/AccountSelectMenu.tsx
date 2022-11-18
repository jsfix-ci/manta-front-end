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
import ConnectWalletButton from './ConnectWalletButton';
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
            'flex gap-3 py-3 p-6 bg-secondary text-secondary',
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
        {showAccountList ? (
          <div className="flex flex-col gap-3 mt-3 bg-secondary rounded-xl p-6 pr-2 absolute right-0 top-full z-50 border border-manta-gray">
            <div className="text-lg font-medium text-black dark:text-white">
              Wallet
            </div>
            <div className="flex flex-row items-center gap-4 pl-2">
              <WalletSelectBar />
              <ConnectWalletButton isButton={false} />
            </div>
            <div className="max-h-96 overflow-y-auto pr-4">
              <AccountSelectDropdown />
            </div>
          </div>
        ) : null}
      </OutsideClickHandler>
    </div>
  );
};

const AccountSelectMenu = () => {
  const { externalAccount } = useExternalAccount();

  return externalAccount ? (
    <DisplayAccountsButton />
  ) : (
    <ConnectWalletButton isButton={true} />
  );
};

export default AccountSelectMenu;
