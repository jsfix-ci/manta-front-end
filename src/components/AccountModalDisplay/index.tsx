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
  const { privateAddress, getSpendableBalance } = usePrivateWallet();
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
  return (
    <div className="w-72 bg-gray-600 z-20 text-white">
      {/* <div className="pt-20 px-8">
        <div className="flex gap-8">
          <div className="w-8" />
          <div className="flex gap-2 items-center text-xss">
            ASSET
            <FontAwesomeIcon icon={faSort} size="1x" />
          </div>
          <div className="flex gap-2 items-center text-xss">
            AMOUNT
            <FontAwesomeIcon icon={faSort} size="1x" />
          </div>
        </div>
        {publicBalances
          ? Object.keys(publicBalances).map((balance) => (
              <div
                className="flex items-center gap-8 mt-4"
                key={publicBalances[balance].assetType.ticker}
              >
                <div className="w-8">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={publicBalances[balance].assetType.icon}
                    alt={publicBalances[balance].assetType.ticker}
                  />
                </div>
                <div>{publicBalances[balance].assetType.ticker}</div>
              </div>
            ))
          : null}
      </div> */}
      <h1 className="text-center mt-6 text-2xl">My Account</h1>
      <div className="flex justify-center gap-3 mt-8">
        <h2 className="text-xl">My Private Address</h2>
        <p className="w-80 break-all">{privateAddress}</p>
        <CopyPasteIcon textToCopy={privateAddress} />
      </div>
      <div className="mt-8">
        <h2 className="text-lg">Balances</h2>
        <div className="mt-4">
          <div className="flex gap-4">
            <div className="w-52">Asset</div>
            <div className="w-52">Public</div>
            <div className="w-52">Private</div>
          </div>
          {/* {assets.map((asset: AssetType) => {
            const balance = getPublicBalance(asset);
            return (
              <div className="flex gap-4">
                <div className="flex items-center gap-3 w-52">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={balance.assetType.icon}
                    alt="icon"
                  />
                  <GradientText
                    className="text-2xl font-bold"
                    text={balance.assetType.ticker}
                  />
                </div>
                <div className="w-52">{balance.toString()}</div>
                <div className="w-52">{balance.privateBalance.toString()}</div>
              </div>
            );
          })} */}
          <div className="flex gap-4"></div>
        </div>
      </div>
    </div>
  );
};

export default AccountDisplay;
