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

const copyToClipboard = (
  address: string,
) => {
  navigator.clipboard.writeText(address);
  return false;
};

const AvaliableMetamaskAccounts = () => {
  const { ethAddress } = useMetamask();
  const { externalAccount } = useExternalAccount();
  const [addressCopied, setAddressCopied] = useState(-1);

  useEffect(() => {
    const timer = setTimeout(
      () => addressCopied && setAddressCopied(-1),
      1500
    );
    return () => clearTimeout(timer);
  }, [addressCopied]);

  return (
    <div
      key={ethAddress}
      className="hover:bg-thirdry cursor-pointer flex items-center gap-5 justify-between border border-secondary rounded-lg px-3 py-2 mb-5 text-secondary"
    >
      <div>
        <div className="text-sm flex flex-row items-center gap-3">
          <Identicon value={externalAccount.address} size={32} theme="polkadot" />
          <div className="flex flex-col gap-1">
            <div className="font-medium">{'Metamask Account'}</div>
            <div className="flex flex-row items-center gap-2">
              {`${ethAddress?.slice(0, 4)}...${ethAddress?.slice(-5)}`}
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
              {addressCopied === 1 ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <FontAwesomeIcon
                  className="cursor-pointer"
                  icon={faCopy}
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(ethAddress);
                    setAddressCopied(1);
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
  const config = useConfig();
  const [addressCopied, setAddressCopied] = useState(-1);
  const { externalAccount, externalAccountOptions, changeExternalAccount } =
    useExternalAccount();

  const getBlockExplorerLink = (address) =>
    `${config.SUBSCAN_URL}/account/${address}`;

  useEffect(() => {
    const timer = setTimeout(
      () => addressCopied && setAddressCopied(-1),
      1500
    );
    return () => clearTimeout(timer);
  }, [addressCopied]);

  return externalAccountOptions.map((account: any, index: number) => (
    <div
      key={account.address}
      className="hover:bg-thirdry cursor-pointer flex items-center gap-5 justify-between border border-secondary rounded-lg px-3 py-2 mb-5 text-secondary"
      onClick={() => {
        changeExternalAccount(account, externalAccountOptions);
      }}
    >
      <div>
        <div className="text-sm flex flex-row items-center gap-3">
          <Identicon value={account.address} size={32} theme="polkadot" />
          <div className="flex flex-col gap-1">
            <div className="font-medium">{account.meta.name}</div>
            <div className="flex flex-row items-center gap-2">
              {`${account.address.slice(0, 4)}...${account.address.slice(-5)}`}
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
                    copyToClipboard(account.address);
                    setAddressCopied(index)
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

const AccountSelectDropdown = () => {
  const { isMetamaskSelected } = useMetamask();
  return isMetamaskSelected ? (
    <AvaliableMetamaskAccounts />
  ) : (
    <AvaliableSubstrateAccounts />
  );
};

export default AccountSelectDropdown;
