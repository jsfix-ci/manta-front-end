import React, { useEffect, useState } from 'react';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { useUsdPrices } from 'contexts/usdPricesContext';
import { usePublicBalances } from 'contexts/publicBalancesContext';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import { useExternalAccount } from 'contexts/externalAccountContext';
import AssetType from 'types/AssetType';
import Balance from 'types/Balance';
import decimalToUsdString from 'utils/general/decimal';
import CopyPasteIcon from 'components/CopyPasteIcon';

const AccountDisplay = () => {
  const { privateAddress, getSpendableBalance, signerIsConnected, isReady } =
    usePrivateWallet();
  const { usdPrices } = useUsdPrices();

  const assets = AssetType.AllCurrencies(true);
  const [balances, setBalances] = useState<any>([]);
  const [totalBalance, setTotalBalance] = useState('$0.00');

  const fetchPrivateBalances = async () => {
    let total = new Decimal(0);
    const balances = await Promise.all(
      assets.map(async (assetType: any) => {
        const privateBalance = await getSpendableBalance(assetType);

        if (privateBalance) {
          const usdBalanceString = privateBalance.toUsdString(
            usdPrices[assetType.coingeckoId]
              ? usdPrices[assetType.coingeckoId]
              : new Decimal(0)
          );
          const usdBalance = privateBalance.toUsd(
            usdPrices[assetType.coingeckoId]
              ? usdPrices[assetType.coingeckoId]
              : new Decimal(0)
          );
          total = total.add(usdBalance);

          return {
            assetType,
            usdBalanceString,
            privateBalance
          };
        }

        return {
          assetType,
          usdBalanceString: new Balance(assetType, new Decimal(0)).toUsdString(
            new Decimal(0)
          ),
          privateBalance
        };
      })
    );

    setBalances([
      ...balances.filter(
        (balance) =>
          balance.privateBalance &&
          balance.privateBalance.gt(new Balance(balance.assetType, new BN(0)))
      )
    ]);
    setTotalBalance(decimalToUsdString(total));
  };

  useEffect(() => {
    if (isReady && privateAddress) {
      fetchPrivateBalances();
    }
  }, [isReady, usdPrices, privateAddress]);

  return (
    <div className="mt-3 bg-secondary rounded-3xl p-6 absolute right-0 top-full z-50 border border-manta-gray text-secondary">
      <div className="border border-secondary rounded-xl px-6 py-4 mb-5 text-secondary">
        {privateAddress ? (
          <>
            <div className="flex items-center justify-between gap-5">
              <span>
                {privateAddress.slice(0, 10)}...{privateAddress.slice(-10)}
              </span>
              <CopyPasteIcon textToCopy={privateAddress} />
            </div>
            <div className="mt-4 flex flex-col justify-center items-center">
              <span>Total Balance</span>
              <div className="text-white">{totalBalance}</div>
            </div>
          </>
        ) : (
          <span className="whitespace-nowrap">You have no zkAccount yet.</span>
        )}
      </div>
      {privateAddress ? (
        <div className="border border-secondary rounded-xl px-6 py-4 mb-5 text-secondary">
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
                    <div className="text-white">{balance.assetType.ticker}</div>
                    <div className="text-secondary">
                      {balance.privateBalance.toString()}
                    </div>
                  </div>
                </div>
                <div className="text-black dark:text-white">
                  {balance.usdBalanceString}
                </div>
              </div>
            ))
          ) : (
            <span className="whitespace-nowrap">You have no zkAssets yet.</span>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default AccountDisplay;
