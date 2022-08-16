import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';

import { usePublicBalancesContext } from 'contexts/publicBalancesContext';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import GradientText from 'components/GradientText';
import AssetType from 'types/AssetType';

const AccountModalDisplay = () => {
  const { privateAddress, getSpendableBalance } = usePrivateWallet();
  const { getPublicBalance } = usePublicBalancesContext();
  const { externalAccount } = useExternalAccount();
  const assets = AssetType.AllCurrencies(false);

  const [addressCopied, setAddressCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(privateAddress);
    setAddressCopied(true);
  };

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

  useEffect(() => {
    const timer = setTimeout(
      () => addressCopied && setAddressCopied(false),
      2000
    );
    return () => clearTimeout(timer);
  }, [addressCopied]);

  return (
    <div style={{ width: '768px' }}>
      <h1 className="text-center mt-6 text-2xl">My Account</h1>
      <div className="flex justify-center gap-3 mt-8">
        <h2 className="text-xl">My Private Address</h2>
        <p className="w-80 break-all">{privateAddress}</p>
        {addressCopied ? (
          <FontAwesomeIcon icon={faCheck} />
        ) : (
          <FontAwesomeIcon
            icon={faCopy}
            className="cursor-pointer"
            onMouseDown={copyToClipboard}
          />
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-lg">Balances</h2>
        <div className="mt-4">
          <div className="flex gap-4">
            <div className="w-52">Asset</div>
            <div className="w-52">Public</div>
            <div className="w-52">Private</div>
          </div>
          {assets.map((asset: AssetType) => {
            const balance = getPublicBalance(asset);
            console.log({ balance, asset });
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
                {/* <div className="w-52">{balance.privateBalance.toString()}</div> */}
              </div>
            );
          })}
          <div className="flex gap-4"></div>
        </div>
      </div>
    </div>
  );
};

export default AccountModalDisplay;
