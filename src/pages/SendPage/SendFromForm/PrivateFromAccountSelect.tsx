// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import { useModal } from 'hooks';
import AccountModalDisplay from 'components/AccountModalDisplay';
import CopyPasteIcon from 'components/CopyPasteIcon';

const PrivateFromAccountSelect = () => {
  const { privateAddress } = usePrivateWallet();
  const {
    ModalWrapper,
    showModal: showAccountModal,
    hideModal: hideAccountModal
  } = useModal();

  return (
    <>
      <div className="px-6 py-5 leading-5 h-16 flex items-center gap-2 text-lg text-primary relative gradient-border rounded-full">
        Private{' '}
        <span
          className="manta-gray text-xs cursor-pointer"
          onClick={() => showAccountModal()}
        >
          {privateAddress?.slice(0, 10)}...{privateAddress?.slice(-10)}
        </span>
        <data id="clipBoardCopy" value={privateAddress} />
        <div className="text-black dark:text-white ml-auto cursor-pointer absolute right-6 top-1/2 transform -translate-y-1/2 text-base">
          <CopyPasteIcon textToCopy={privateAddress} />
        </div>
      </div>
    </>
  );
};

export default PrivateFromAccountSelect;
