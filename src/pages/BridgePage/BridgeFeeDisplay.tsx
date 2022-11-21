// @ts-nocheck
import React from 'react';
import { useBridgeData } from './BridgeContext/BridgeDataContext';

const BridgeFeeDisplay = () => {
  const { originFee, destinationFee } = useBridgeData();

  const originFeeText = originFee ? originFee.toFeeDisplayString() : '--';
  const destinationFeeText = destinationFee ? destinationFee.toFeeDisplayString() : '--';

  return (
    <div className="flex flex-col gap-2 py-1">
      <div className="px-2 text-manta-gray flex flex-row justify-between">
        <div>{`Origin fee: `}</div>
        <div>{originFeeText}</div>
      </div>
      <div className="px-2 text-manta-gray flex flex-row justify-between">
        <div>{`Destination fee: `}</div>
        <div>{destinationFeeText}</div>
      </div>
    </div>
  );
};

export default BridgeFeeDisplay;
