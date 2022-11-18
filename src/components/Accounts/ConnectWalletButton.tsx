// @ts-nocheck
import { useModal } from 'hooks';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConnectWalletModal from 'components/Modal/connectWallet';
import Button from 'components/Button';

const ConnectAccountButton = ({ isButton }) => {
  const { ModalWrapper, showModal } = useModal();
  const handleOnClick = () => showModal();
  return (
    <>
      {isButton ? (
        <Button
          className="btn-secondary rounded-lg relative z-10"
          onClick={handleOnClick}
        >
          Connect Wallet
        </Button>
      ) : (
        <FontAwesomeIcon
          className="w-6 h-6 cursor-pointer z-10 text-secondary"
          icon={faPlusCircle}
          onClick={handleOnClick}
        />
      )}
      <ModalWrapper>
        <ConnectWalletModal />
      </ModalWrapper>
    </>
  );
};


export default ConnectAccountButton;