// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';
import { usePrivateWallet } from 'contexts/privateWalletContext';
import signerIsOutOfDate from 'utils/validation/signerIsOutOfDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTimes,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useModal } from 'hooks';
import AccountModalDisplay from 'components/AccountModalDisplay';
import Version from 'types/Version';

const SignerConnectionLabelTitle = () => {
  return <p className="text-primary text-sm pb-2">Manta Signer</p>;
};

const SignerNotConnectedLabel = () => {
  return (
    <div>
      <SignerConnectionLabelTitle />
      <p className="text-accent dark:text-white pb-2">
        <FontAwesomeIcon icon={faTimes} color="#FA4D56" /> Not connected
      </p>
    </div>
  );
};

const SignerOutOfDateLabel = ({ signerVersion }) => {
  return (
    <div>
      <SignerConnectionLabelTitle />
      <p className="text-accent dark:text-white pb-2">
        <FontAwesomeIcon icon={faExclamationTriangle} color="#FFC700" />{' '}
        {signerVersion.toString()} (out of date)
      </p>
    </div>
  );
};

SignerOutOfDateLabel.propTypes = {
  signerVersion: PropTypes.instanceOf(Version)
};

const SignerConnectedLabel = ({ signerVersion }) => {
  return (
    <div>
      <SignerConnectionLabelTitle />
      <p className="text-accent dark:text-white pb-2">
        <FontAwesomeIcon icon={faCheck} color="#24A148" />{' '}
        {signerVersion.toString()}
      </p>
    </div>
  );
};

SignerConnectedLabel.propTypes = {
  signerVersion: PropTypes.instanceOf(Version)
};

const SignerConnectionStatusLabel = () => {
  const { signerVersion } = usePrivateWallet();
  const { ModalWrapper, showModal } = useModal();
  return (
    <>
      <div
        className="flex text-center items-center text-green-500 pr-6 cursor-pointer"
        onClick={showModal}
      >
        {!signerVersion ? (
          <SignerNotConnectedLabel />
        ) : signerIsOutOfDate(signerVersion) ? (
          <SignerOutOfDateLabel signerVersion={signerVersion} />
        ) : (
          <SignerConnectedLabel signerVersion={signerVersion} />
        )}
      </div>
      <ModalWrapper>
        <AccountModalDisplay />
      </ModalWrapper>
    </>
  );
};

export default SignerConnectionStatusLabel;
