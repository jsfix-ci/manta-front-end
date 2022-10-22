import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import ZkAccountModal from '../ZkAccoutModal';
import MantaIcon from 'resources/images/manta.png';

const ZkAddress = () => {
  const [showZkModal, setShowZkModal] = useState(false);

  return (
    <div className="relative">
      <OutsideClickHandler onOutsideClick={() => setShowZkModal(false)}>
        <div
          className="flex gap-3 py-3 p-6 bg-secondary text-secondary font-medium cursor-pointer rounded-xl"
          onClick={() => setShowZkModal(true)}
        >
          <img className="w-6 h-6" src={MantaIcon} alt="Manta" />
          zkAddress
        </div>
        {showZkModal ? <ZkAccountModal /> : null}
      </OutsideClickHandler>
    </div>
  );
};

export default ZkAddress;