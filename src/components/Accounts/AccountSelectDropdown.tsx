// @ts-nocheck
import { useEffect, useState } from 'react';
import { useConfig } from 'contexts/configContext';
import { useMetamask } from 'contexts/metamaskContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import Svgs from 'resources/icons';
import Identicon from '@polkadot/react-identicon';
import {
  faArrowUpRightFromSquare,
  faCheck,
  faCopy
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import makeBlockie from 'ethereum-blockies-base64';

const SingleAccountDisplay = ({
  accountName,
  accountAddress,
  isAccountSelected,
  isMetamaskSelected,
  onClickAccountHandler
}) => {
  const config = useConfig();
  const [addressCopied, setAddressCopied] = useState(null);
  const succinctAddress = `${accountAddress?.slice(
    0,
    5
  )}...${accountAddress?.slice(-4)}`;

  const succinctAccountName =
    accountName.length > 12
      ? `${accountName?.slice(0, 12)}...`
      : accountName;

  const blockExplorerLink = isMetamaskSelected
    ? `https://etherscan.io/address/${accountAddress}`
    : `${config.SUBSCAN_URL}/account/${accountAddress}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountAddress);
    return false;
  };

  const BlockExplorerButton = () => (
    <a
      className="pt-2"
      onClick={(e) => e.stopPropagation()}
      href={blockExplorerLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon
        className="cursor-pointer w-3 h-3"
        icon={faArrowUpRightFromSquare}
        href={blockExplorerLink}
      />
    </a>
  );

  const AddressCopyButton = () =>
    addressCopied === accountAddress ? (
      <FontAwesomeIcon className="w-3 h-3" icon={faCheck} />
    ) : (
      <FontAwesomeIcon
        className="cursor-pointer w-3 h-3 hover:text-link"
        icon={faCopy}
        onClick={(e) => {
          e.stopPropagation();
          copyToClipboard(accountAddress);
          setAddressCopied(accountAddress);
        }}
      />
    );

  const AccountIcon = () =>
    isMetamaskSelected ? (
      <img
        className="ml-1 rounded-full w-6 h-6"
        src={makeBlockie(accountAddress)}
        alt={'blockie address icon'}
      />
    ) : (
      <Identicon
        value={accountAddress}
        size={24}
        theme="polkadot"
        className="px-1"
      />
    );

  useEffect(() => {
    const timer = setTimeout(
      () => addressCopied && setAddressCopied(null),
      1500
    );
    return () => clearTimeout(timer);
  }, [addressCopied]);

  return (
    <div
      key={accountAddress}
      className="bg-white bg-opacity-5 cursor-pointer flex items-center gap-5 justify-between border border-white border-opacity-20 rounded-lg px-3 text-green w-68 h-16"
      onClick={onClickAccountHandler}
    >
      <div>
        <div className="flex flex-row items-center gap-3">
          <AccountIcon />
          <div className="flex flex-col">
            <div className="text-base">{succinctAccountName}</div>
            <div className="flex flex-row items-center gap-2 text-white opacity-60 text-sm">
              {succinctAddress}
              <div>
                <BlockExplorerButton />
              </div>
              <div>
                <AddressCopyButton />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative right-2">
        {isAccountSelected && (
          <img src={Svgs.GreenCheckIcon} alt={'green check'} />
        )}
      </div>
    </div>
  );
};

const AccountSelectDropdown = ({ isMetamaskSelected }) => {
  const { ethAddress } = useMetamask();
  const { externalAccount, externalAccountOptions, changeExternalAccount } =
    useExternalAccount();

  return isMetamaskSelected ? (
    <SingleAccountDisplay
      accountName={'Metamask Account'}
      accountAddress={ethAddress}
      isAccountSelected={true}
      isMetamaskSelected={isMetamaskSelected}
      onClickAccountHandler={() => {}}
    />
  ) : (
    <div className="flex flex-col gap-5">
      {externalAccountOptions.map((account: any) => (
        <SingleAccountDisplay
          key={account.address}
          accountName={account.meta.name}
          accountAddress={account.address}
          isAccountSelected={account.address === externalAccount.address}
          isMetamaskSelected={isMetamaskSelected}
          onClickAccountHandler={() => changeExternalAccount(account)}
        />
      ))}
    </div>
  );
};

export default AccountSelectDropdown;
