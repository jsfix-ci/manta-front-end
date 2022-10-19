// @ts-nocheck
import React, { useEffect, createContext, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import AssetType from 'types/AssetType';

const UsdPricesContext = createContext();

export const UsdPricesContextProvider = (props) => {
  const [usdPrices, setUsdPrices] = useState({});

  const fetchUsdPrices = async () => {
    const assets = AssetType.AllCurrencies(false);
    const ids = assets.reduce((res, asset, index) => {
      return `${res}${asset.coingeckoId}${
        index < assets.length - 1 ? ',' : ''
      }`;
    }, '');

    const res = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );

    if (res.data) {
      const prices = {};
      Object.keys(res.data).map((id) => (prices[id] = res.data[id]['usd']));
      setUsdPrices({ ...usdPrices, ...prices });
    }
  };

  useEffect(() => {
    fetchUsdPrices();
  }, []);

  const value = {
    usdPrices,
    fetchUsdPrices
  };

  return (
    <UsdPricesContext.Provider value={value}>
      {props.children}
    </UsdPricesContext.Provider>
  );
};

UsdPricesContextProvider.propTypes = {
  children: PropTypes.any
};

export const useUsdPrices = () => ({
  ...useContext(UsdPricesContext)
});
