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
    4
  )}...${accountAddress?.slice(-5)}`;

  const blockExplorerLink = isMetamaskSelected
    ? `https://etherscan.io/address/${accountAddress}`
    : `${config.SUBSCAN_URL}/account/${accountAddress}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountAddress);
    return false;
  };

  const BlockExplorerButton = () => (
    <a
      onClick={(e) => e.stopPropagation()}
      href={blockExplorerLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon
        className="cursor-pointer"
        icon={faArrowUpRightFromSquare}
        href={blockExplorerLink}
      />
    </a>
  );

  const AddressCopyButton = () =>
    addressCopied === accountAddress ? (
      <FontAwesomeIcon icon={faCheck} />
    ) : (
      <FontAwesomeIcon
        className="cursor-pointer"
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
      <img className="w-6 h-6" src={Svgs.Metamask} alt={'metamask'} />
    ) : (
      <Identicon value={accountAddress} size={32} theme="polkadot" />
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
      className="hover:bg-thirdry cursor-pointer flex items-center gap-5 justify-between border border-secondary rounded-lg px-3 py-2 mb-5 text-green"
      onClick={onClickAccountHandler}
    >
      <div>
        <div className="text-sm flex flex-row items-center gap-3">
          <AccountIcon />
          <div className="flex flex-col gap-1">
            <div className="font-medium">{accountName}</div>
            <div className="flex flex-row items-center gap-2">
              {succinctAddress}
              <BlockExplorerButton />
              <AddressCopyButton />
            </div>
          </div>
        </div>
      </div>
      <div className="py-1 px-6">
        {isAccountSelected && (
          <FontAwesomeIcon icon={faCheck} className="fa-xl text-green-500" />
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
    externalAccountOptions.map((account: any) => (
      <SingleAccountDisplay
        key={account.address}
        accountName={account.meta.name}
        accountAddress={account.address}
        isAccountSelected={account.address === externalAccount.address}
        isMetamaskSelected={isMetamaskSelected}
        onClickAccountHandler={() =>
          changeExternalAccount(account)
        }
      />
    ))
  );
};

export default AccountSelectDropdown;
