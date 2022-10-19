import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faCaretUp,
  faCaretDown
} from '@fortawesome/free-solid-svg-icons';

import { usePublicBalances } from 'contexts/publicBalancesContext';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import AssetType from 'types/AssetType';

import GradientText from 'components/GradientText';
import CopyPasteIcon from 'components/CopyPasteIcon';

const AccountDisplay = () => {
  const { privateAddress, getSpendableBalance, signerIsConnected } =
    usePrivateWallet();
  const { getPublicBalance, publicBalances, senderPublicAccount } =
    usePublicBalances();
  const { externalAccount } = useExternalAccount();

  const [balances, setBalances] = useState<any>([]);

  const fetchPrivateBalances = async () => {
    const assets = AssetType.AllCurrencies(false);
    const balances = await Promise.all(
      assets.map(async (assetType: AssetType) => {
        const privateBalance = await getSpendableBalance(assetType);
        console.log({ privateBalance });
        return {
          assetType,
          privateBalance: privateBalance.toString()
        };
      })
    );
    setBalances(balances);
  };

  useEffect(() => {
    if (signerIsConnected) {
      fetchPrivateBalances();
    }
  }, [signerIsConnected]);

  return (
    <div className="mt-3 bg-secondary rounded-3xl p-6 absolute right-0 top-full z-50 border border-manta-gray text-secondary">
      <div className="flex items-center gap-5 justify-between border border-secondary rounded-xl px-6 py-4 mb-5 text-secondary">
        <span>
          {privateAddress.slice(0, 10)}...{privateAddress.slice(-10)}
        </span>
        <CopyPasteIcon textToCopy={privateAddress} />
      </div>
    </div>
  );
};

export default AccountDisplay;
