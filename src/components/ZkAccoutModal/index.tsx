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
  const { getPublicBalance, publicBalances } = usePublicBalances();
  const { externalAccount } = useExternalAccount();
  const assets = AssetType.AllCurrencies(false);

  // const fetchPublicBalances = async () => {
  //   const balances = await Promise.all(
  //     senderAssetTypeOptions.map(async (assetType: AssetType) => {
  //       const publicBalance = await fetchPublicBalance(
  //         senderPublicAccount?.address,
  //         assetType
  //       );
  //       const privateBalance = await getSpendableBalance(assetType);
  //       return {
  //         assetType,
  //         publicBalance: publicBalance.toString(),
  //         privateBalance: privateBalance.toString()
  //       };
  //     })
  //   );
  //   setBalances(balances);
  // };

  // useEffect(() => {
  //   if (
  //     senderAssetTypeOptions &&
  //     senderAssetTypeOptions.length > 0 &&
  //     senderPublicAccount
  //   ) {
  //     fetchPublicBalances();
  //   }
  // }, [senderAssetTypeOptions, senderPublicAccount]);
  console.log({ assets, publicBalances });
  console.log({ privateAddress, signerIsConnected });
  return (
    <div className="mt-3 bg-secondary rounded-3xl p-6 absolute right-0 top-full z-50 border border-manta-gray text-secondary">
      <div className="flex items-center gap-5 justify-between border border-secondary rounded-xl px-6 py-4 mb-5 text-secondary">
        <span>{privateAddress}</span>
        <CopyPasteIcon textToCopy={privateAddress} />
      </div>
    </div>
  );
};

export default AccountDisplay;
