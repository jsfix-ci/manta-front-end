// @ts-nocheck
import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import detectEthereumProvider from '@metamask/detect-provider';
import Chain from 'types/Chain';
import { useConfig } from './configContext';

const MetamaskContext = createContext();

export const MetamaskContextProvider = (props) => {
  const config = useConfig();
  const [provider, setProvider] = useState(null);
  const [hasAuthConnectMetamask, setHasAuthConnectMetamask] = useState(false)
  const ethAddress = provider?.selectedAddress;

  const configureMoonRiver = async () => {
    try {
      await provider.request({ method: 'eth_requestAccounts'});
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [Chain.Moonriver(config).ethMetadata]
      });
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const detectMetamask = async () => {

      if (!provider && hasAuthConnectMetamask) {
        const metamask = await detectEthereumProvider({ mustBeMetaMask: true });
        if (metamask) {
          setProvider(metamask);
        }
      }
    };
    detectMetamask();
  }, [hasAuthConnectMetamask]);


  const value = {
    provider,
    setProvider,
    ethAddress,
    configureMoonRiver,
    setHasAuthConnectMetamask
  };

  return (
    <MetamaskContext.Provider value={value}>
      {props.children}
    </MetamaskContext.Provider>
  );
};

MetamaskContextProvider.propTypes = {
  children: PropTypes.any,
};

export const useMetamask = () => ({
  ...useContext(MetamaskContext),
});
