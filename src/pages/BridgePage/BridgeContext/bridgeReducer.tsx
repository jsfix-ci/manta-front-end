// @ts-nocheck
import { localStorageKeys } from 'constants/LocalStorageConstants';
import store from 'store';
import AssetType from 'types/AssetType';
import Balance from 'types/Balance';
import Chain from 'types/Chain';
import BRIDGE_ACTIONS from './bridgeActions';

const getDestinationChainOptions = (originChain, originChainOptions) => {
  return originChainOptions
    .filter(chain => chain.name !== originChain.name)
    .filter(chain => originChain.canTransferXcm(chain));
};

const getSenderAssetTypeOptions = (config, originChain, destinationChain) => {
  return AssetType.AllCurrencies(config, false).filter(
    assetType => assetType.canTransferXcm(originChain, destinationChain));
};

const getNewSenderAssetType = (prevSenderAssetType, senderAssetTypeOptions) => {
  return (
    senderAssetTypeOptions.find(assetType => assetType.name === prevSenderAssetType?.name)
    || senderAssetTypeOptions[0] || null
  );
};

const getNewSenderAssetTargetBalance = (newSenderAssetType, prevTargetBalance) => {
  let targetBalance = null;
  if (prevTargetBalance && newSenderAssetType) {
    targetBalance = Balance.fromBaseUnits(
      newSenderAssetType, prevTargetBalance.valueBaseUnits()
    );
  }
  return targetBalance;
}

export const buildInitState = (config) => {
  const initOriginChainOptions = Chain.All(config);
  const initOriginChain = initOriginChainOptions[0];
  const initDestinationChainOptions = getDestinationChainOptions(
    initOriginChain, initOriginChainOptions
  );
  const initDestinationChain = initDestinationChainOptions[0];
  const initSenderAssetTypeOptions = getSenderAssetTypeOptions(
    config, initOriginChain, initDestinationChain
  );
  const initSenderAssetType = initSenderAssetTypeOptions[0];

  return {
    config,
    bridge: null,

    senderEthAccount: null,
    senderAssetType: initSenderAssetType,
    senderAssetTypeOptions: initSenderAssetTypeOptions,
    senderAssetCurrentBalance: null,
    senderAssetTargetBalance: null,
    maxInput: null,
    minInput: null,
    senderNativeAssetCurrentBalance: null,

    originChain: initOriginChain,
    originChainOptions: initOriginChainOptions,
    originFee: null,

    destinationChain: initDestinationChain,
    destinationChainOptions: initDestinationChainOptions,
    destinationFee: null,
  };
}

const bridgeReducer = (state, action) => {
  switch (action.type) {
  case BRIDGE_ACTIONS.SET_BRIDGE:
    return setBridge(state, action);

  case BRIDGE_ACTIONS.SET_SELECTED_ASSET_TYPE:
    return setSelectedAssetType(state, action);

  case BRIDGE_ACTIONS.SET_SENDER_ASSET_CURRENT_BALANCE:
    return setSenderAssetCurrentBalance(state, action);

  case BRIDGE_ACTIONS.SET_SENDER_ASSET_TARGET_BALANCE:
    return setSenderAssetTargetBalance(state, action);

  case BRIDGE_ACTIONS.SET_FEE_ESTIMATES:
    return setFeeEstimates(state, action)

  case BRIDGE_ACTIONS.SET_ORIGIN_CHAIN:
    return setOriginChain(state, action);

  case BRIDGE_ACTIONS.SET_DESTINATION_CHAIN:
    return setDestinationChain(state, action);

  case BRIDGE_ACTIONS.SWITCH_ORIGIN_AND_DESTINATION:
    return switchOriginAndDestination(state);

  case BRIDGE_ACTIONS.SET_SENDER_NATIVE_ASSET_CURRENT_BALANCE:
    return setSenderNativeAssetCurrentBalance(state, action)

  default:
    throw new Error(`Unknown type: ${action.type}`);
  }
};

const balanceUpdateIsStale = (stateAssetType, updateAssetType) => {
  if (!updateAssetType) {
    return false;
  }
  return stateAssetType?.assetId !== updateAssetType.assetId;
};

const setBridge = (state, { bridge }) => {
  return {
    ...state,
    bridge
  }
}

const setSelectedAssetType = (state, action) => {
  store.set(localStorageKeys.CurrentToken, action.selectedAssetType.baseTicker);
  const senderAssetType = action.selectedAssetType;
  let senderAssetTargetBalance = null;
  if (state.senderAssetTargetBalance) {
    senderAssetTargetBalance = Balance.fromBaseUnits(
      senderAssetType, state.senderAssetTargetBalance.valueBaseUnits()
    );
  }
  return {
    ...state,
    senderAssetCurrentBalance: null,
    senderAssetTargetBalance,
    senderAssetType
  };
};

const setSenderAssetCurrentBalance = (state, action) => {
  if (balanceUpdateIsStale(state?.senderAssetType, action.senderAssetCurrentBalance?.assetType)) {
    return state;
  }
  return {
    ...state,
    senderAssetCurrentBalance: action.senderAssetCurrentBalance
  };
};


const setSenderNativeAssetCurrentBalance = (state, {senderNativeAssetCurrentBalance}) => {
  if (
    balanceUpdateIsStale(
      state?.originChain?.nativeAsset, senderNativeAssetCurrentBalance?.assetType
  )) {
    return state;
  }
  return {
    ...state,
    senderNativeAssetCurrentBalance
  }
}

const setSenderAssetTargetBalance = (state, action) => {
  return {
    ...state,
    senderAssetTargetBalance: action.senderAssetTargetBalance
  };
};

const setFeeEstimates = (state, action) => {
  const { originFee, destinationFee, maxInput, minInput  } = action;
  return {
    ...state,
    originFee,
    destinationFee,
    maxInput,
    minInput
  };
}

const setOriginChain = (state, { originChain }) => {
  let destinationChain = state.destinationChain;
  const destinationChainOptions = getDestinationChainOptions(originChain, state.originChainOptions);
  if (!originChain.canTransferXcm(destinationChain)) {
    destinationChain = destinationChainOptions[0];
  }
  const senderAssetTypeOptions = getSenderAssetTypeOptions(
    state.config, originChain, destinationChain
  );
  const senderAssetType = getNewSenderAssetType(state.senderAssetType, senderAssetTypeOptions);
  const senderAssetTargetBalance = getNewSenderAssetTargetBalance(
    senderAssetType, state.senderAssetTargetBalance
  );

  return {
    ...state,
    originChain,
    destinationChain,
    destinationChainOptions,
    senderAssetType,
    senderAssetTypeOptions,
    senderAssetTargetBalance,
    senderNativeAssetCurrentBalance: null,
    senderAssetCurrentBalance: null,
    originFee: null,
    destinationFee: null
  };
};

const setDestinationChain = (state, { destinationChain }) => {
  const senderAssetTypeOptions = getSenderAssetTypeOptions(
    state.config, state.originChain, destinationChain
  );
  const senderAssetType = getNewSenderAssetType(state.senderAssetType, senderAssetTypeOptions);
  let senderAssetTargetBalance = getNewSenderAssetTargetBalance(
    senderAssetType, state.senderAssetTargetBalance
  );

  return {
    ...state,
    senderAssetTypeOptions,
    senderAssetType,
    destinationChain,
    senderAssetTargetBalance,
    senderNativeAssetCurrentBalance: null,
    senderAssetCurrentBalance: null,
    originFee: null,
    destinationFee: null
  };
};

const switchOriginAndDestination = (state) => {
  const { originChain, destinationChain, senderAssetType, senderAssetTypeOptions} = state;
  if (destinationChain.canTransferXcm(originChain)) {
    return {
      ...state,
      originChain: destinationChain,
      destinationChain: originChain,
      senderAssetType: getNewSenderAssetType(senderAssetType, senderAssetTypeOptions),
      senderNativeAssetCurrentBalance: null,
      senderAssetCurrentBalance: null,
      originFee: null,
      destinationFee: null
    }
  }
}

export default bridgeReducer;
