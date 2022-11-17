// @ts-nocheck
import classNames from 'classnames';
import Button from 'components/Button';
import ConnectWalletModal from 'components/Modal/connectWallet';
import { useConfig } from 'contexts/configContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { useKeyring } from 'contexts/keyringContext';
import { useTxStatus } from 'contexts/txStatusContext';
import { useModal } from 'hooks';
import { useMetamask } from 'contexts/metamaskContext';
import { useBridgeData } from 'pages/BridgePage/BridgeContext/BridgeDataContext';
import React, { useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { setHasAuthToConnectStorage } from 'utils/persistence/connectAuthorizationStorage';
import {
  faArrowUpRightFromSquare,
  faCheck,
  faCopy,
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons';
import Svgs from 'resources/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Identicon from '@polkadot/react-identicon';
import { getWallets } from '@talismn/connect-wallets';

const AccountSelect = () => {
  const config = useConfig();
  const { txStatus } = useTxStatus();
  const { externalAccount, externalAccountOptions, changeExternalAccount } =
    useExternalAccount();

  const { selectedWallet } = useKeyring();
  const [showAccountList, setShowAccountList] = useState(false);
  const [addressCopied, setAddressCopied] = useState(-1);
  const disabled = txStatus?.isProcessing();

  const { destinationChain, originChain } = useBridgeData();
  const { ethAddress } = useMetamask();
  const [isMetamaskSelected, setIsMetamaskSelected] = useState(false);

  const isMoonriverEnabled =
    (originChain?.name === 'moonriver' ||
      destinationChain?.name === 'moonriver') &&
    !!ethAddress;

  const copyToClipboard = (address: string, index: number) => {
    navigator.clipboard.writeText(address);
    setAddressCopied(index);
    return false;
  };

  useEffect(() => {
    const timer = setTimeout(
      () => addressCopied >= 0 && setAddressCopied(-1),
      2000
    );
    return () => clearTimeout(timer);
  }, [addressCopied]);

  const getBlockExplorerLink = (address) => {
    return `${config.SUBSCAN_URL}/account/${address}`;
  };

  const onClickAccountSelect = () => {
    !disabled && setShowAccountList(!showAccountList);
  };

  const WalletSelect = () => {
    const { subscribeWalletAccounts, selectedWallet } = useKeyring();
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
          // (BD todo) switch to Metamask
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

  const AvaliableMetamaskAccounts = () => {
    return (
      <div
        key={ethAddress}
        className="hover:bg-thirdry cursor-pointer flex items-center gap-5 justify-between border border-secondary rounded-lg px-3 py-2 mb-5 text-secondary"
      >
        <div>
          <div className="text-sm flex flex-row items-center gap-3">
            <Identicon
              value={externalAccount.address}
              size={32}
              theme="polkadot"
            />
            <div className="flex flex-col gap-1">
              <div className="font-medium">{'Metamask Account'}</div>
              <div className="flex flex-row items-center gap-2">
                {`${ethAddress.slice(0, 4)}...${ethAddress.slice(-5)}`}
                <a
                  onClick={(e) => e.stopPropagation()}
                  href={`https://etherscan.io/address/${ethAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    icon={faArrowUpRightFromSquare}
                  />
                </a>
                {addressCopied === 999 ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    icon={faCopy}
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(ethAddress, 999);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="py-1 px-6">
          <FontAwesomeIcon
            className="fa-xl"
            icon={faCheck}
            style={{ color: 'green' }}
          />
        </div>
      </div>
    );
  };

  const AvaliableSubstrateAccounts = () => {
    return externalAccountOptions.map((account: any, index: number) => (
      <div
        key={account.address}
        className="hover:bg-thirdry cursor-pointer flex items-center gap-5 justify-between border border-secondary rounded-lg px-3 py-2 mb-5 text-secondary"
        onClick={() => {
          changeExternalAccount(account, externalAccountOptions);
          setShowAccountList(false);
        }}
      >
        <div>
          <div className="text-sm flex flex-row items-center gap-3">
            <Identicon value={account.address} size={32} theme="polkadot" />
            <div className="flex flex-col gap-1">
              <div className="font-medium">{account.meta.name}</div>
              <div className="flex flex-row items-center gap-2">
                {`${account.address.slice(0, 4)}...${account.address.slice(
                  -5
                )}`}
                <a
                  onClick={(e) => e.stopPropagation()}
                  href={getBlockExplorerLink(account.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    icon={faArrowUpRightFromSquare}
                    href={getBlockExplorerLink(account.address)}
                  />
                </a>
                {addressCopied === index ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    icon={faCopy}
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(account.address, index);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="py-1 px-6">
          {externalAccount.address === account.address && (
            <FontAwesomeIcon
              className="fa-xl"
              icon={faCheck}
              style={{ color: 'green' }}
            />
          )}
        </div>
      </div>
    ));
  };

  const DisplayAccountsButton = ({
    isMoonriverEnabled,
    setIsMetamaskSelected
  }) => {
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
                <WalletSelect />
                <ConnectAccountButton
                  isButton={false}
                  setIsMetamaskSelected={setIsMetamaskSelected}
                />
              </div>
              <div className="max-h-96 overflow-y-auto pr-4">
                {isMetamaskSelected ? (
                  <AvaliableMetamaskAccounts />
                ) : (
                  <AvaliableSubstrateAccounts />
                )}
              </div>
            </div>
          ) : null}
        </OutsideClickHandler>
      </div>
    );
  };

  return externalAccount ? (
    <DisplayAccountsButton
      isMoonriverEnabled={isMoonriverEnabled}
      setIsMetamaskSelected={setIsMetamaskSelected}
    />
  ) : (
    <ConnectAccountButton
      isButton={true}
      setIsMetamaskSelected={setIsMetamaskSelected}
    />
  );
};

const ConnectAccountButton = ({ isButton, setIsMetamaskSelected }) => {
  const { ModalWrapper, showModal } = useModal();
  const handleOnClick = () => {
    showModal();
  };
  return (
    <>
      {isButton ? (
        <Button
          className="btn-secondary rounded-lg relative z-10"
          onClick={handleOnClick}
        >
          Connect Wallet
        </Button>
      ) : (
        <FontAwesomeIcon
          className="w-6 h-6 cursor-pointer z-10 text-secondary"
          icon={faPlusCircle}
          onClick={handleOnClick}
        />
      )}
      <ModalWrapper>
        <ConnectWalletModal setIsMetamaskSelected={setIsMetamaskSelected} />
      </ModalWrapper>
    </>
  );
};

export default AccountSelect;
