import React, { useEffect, useState } from 'react';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import MantaIcon from 'resources/images/manta.png';
import { useUsdPrices } from 'contexts/usdPricesContext';
import { useSend } from 'pages/SendPage/SendContext';
import { usePublicBalances } from 'contexts/publicBalancesContext';
import { useTxStatus } from 'contexts/txStatusContext';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import AssetType from 'types/AssetType';
import Balance from 'types/Balance';
import decimalToUsdString from 'utils/general/decimal';
import CopyPasteIcon from 'components/CopyPasteIcon';
import ZkAccountModalSkeleton from './ZkAccountModalSkeleton';

const AccountDisplay = () => {
  const { txStatus } = useTxStatus();
  const { privateAddress, getSpendableBalance, signerIsConnected, isReady } =
    usePrivateWallet();
  const {
    senderAssetCurrentBalance,
    senderAssetType,
    receiverAssetType,
    receiverCurrentBalance
  } = useSend();
  const { usdPrices } = useUsdPrices();

  const assets = AssetType.AllCurrencies(true);
  const [balanceFetching, setBalanceFetching] = useState(false);
  const [balances, setBalances] = useState<any>([]);
  const [totalBalanceString, setTotalBalanceString] = useState('$0.00');

  const fetchPrivateBalances = async () => {
    let total = new Decimal(0);
    setBalanceFetching(true);
    const balances = await Promise.all(
      assets.map(async (assetType: any) => {
        try {
          const privateBalance = await getSpendableBalance(assetType);
          if (privateBalance) {
            const assetUsdValue =
              usdPrices[assetType.baseTicker] || new Decimal(0);
            const usdBalanceString = privateBalance.toUsdString(assetUsdValue);
            const usdBalance = privateBalance.toUsd(assetUsdValue);
            total = total.add(usdBalance);

            return {
              assetType,
              usdBalanceString,
              privateBalance
            };
          }

          return {
            assetType,
            usdBalanceString: '$0.00',
            privateBalance
          };
        } catch (err) {
          return {
            assetType,
            usdBalanceString: '',
            privateBalance: null
          };
        }
      })
    );

    setBalances([
      ...balances.filter(
        (balance) =>
          balance.privateBalance &&
          balance.privateBalance.gt(new Balance(balance.assetType, new BN(0)))
      )
    ]);
    setTotalBalanceString(decimalToUsdString(total));
    setBalanceFetching(false);
  };

  useEffect(() => {
    if (
      isReady &&
      privateAddress &&
      (senderAssetType?.isPrivate || receiverAssetType?.isPrivate)
    ) {
      fetchPrivateBalances();
    }
  }, [
    isReady,
    usdPrices,
    privateAddress,
    txStatus,
    senderAssetCurrentBalance,
    senderAssetType,
    receiverAssetType,
    receiverCurrentBalance
  ]);

  return (
    <div
      style={{
        width: '450px'
      }}
      className="mt-3 bg-secondary rounded-3xl p-6 absolute right-0 top-full z-50 border border-manta-gray text-secondary"
    >
      {balanceFetching ? (
        <ZkAccountModalSkeleton />
      ) : (
        <>
          <div className="border border-secondary rounded-lg px-6 py-4 mb-5 text-secondary">
            {privateAddress ? (
              <>
                <div className="flex items-center justify-center gap-5">
                  <div className="flex items-center gap-5">
                    <img className="w-10 h-10" src={MantaIcon} alt="Manta" />
                    <span>
                      {privateAddress.slice(0, 10)}...
                      {privateAddress.slice(-10)}
                    </span>
                  </div>
                  <CopyPasteIcon textToCopy={privateAddress} />
                </div>
                <div className="mt-4 flex flex-col justify-center items-center">
                  <span>Total Balance</span>
                  <div className="text-black dark:text-white text-xl">
                    {totalBalanceString}
                  </div>
                </div>
              </>
            ) : (
              <div className="whitespace-nowrap text-center">
                You have no zkAccount yet.
              </div>
            )}
          </div>
          {privateAddress ? (
            <div className="border border-secondary rounded-lg px-6 py-4 mb-5 text-secondary">
              {balances && balances.length > 0 ? (
                balances.map((balance: any) => (
                  <div
                    className="flex items-center justify-between gap-2 mb-4"
                    key={`balance-${balance.assetType.ticker}`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={balance.assetType.icon}
                      />
                      <div>
                        <div className="text-black dark:text-white">
                          {balance.assetType.ticker}
                        </div>
                        <div className="text-secondary">
                          {balance.privateBalance.toString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-black dark:text-white">
                      {usdPrices[balance.assetType.baseTicker]
                        ? balance.usdBalanceString
                        : ''}
                    </div>
                  </div>
                ))
              ) : (
                <div className="whitespace-nowrap text-center">
                  You have no zkAssets yet.
                </div>
              )}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default AccountDisplay;
