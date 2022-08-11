import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';

const ModalContainer: React.FC<{ children: React.ReactNode }> = ({
  children
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50
    }}
  >
    {children}
  </div>
);

const ModalBackDrop: React.FC<{ onClick: MouseEventHandler }> = ({
  onClick
}) => (
  <div
    onClick={onClick}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      WebkitBackdropFilter: 'blur(8px)',
      backdropFilter: 'blur(8px)',
      zIndex: -1
    }}
  />
);

type IUseModal = {
  closeDisabled?: boolean;
  closeCallback?: () => void;
};

export const useModal: (options?: IUseModal) => any = (
  options = {
    closeDisabled: false,
    closeCallback: () => {}
  }
) => {
  const { closeDisabled, closeCallback } = options;

  const [open, setOpen] = useState(false);

  const showModal = useCallback(() => setOpen(true), []);
  const hideModal = useCallback(() => {
    setOpen(false);
    if (closeCallback) {
      closeCallback();
    }
  }, []);

  useEffect(() => {
    // prevents horizontal scroll when modal is open
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [open]);

  const ModalWrapper = useMemo(
    () =>
      ({ children }: { children: React.ReactNode }) => {
        return open ? (
          <ModalContainer>
            <ModalBackDrop
              onClick={() => {
                if (!closeDisabled) {
                  hideModal();
                }
              }}
            />
            {!closeDisabled ? (
              <div className="relative inline-block px-6 py-4 bg-secondary rounded-lg text-white">
                <div
                  className="absolute top-4 right-4 text-white cursor-pointer"
                  onClick={() => hideModal()}
                >
                  <FontAwesomeIcon icon={faTimes} size="2x" />
                </div>
                {children}
              </div>
            ) : (
              <div className="relative inline-block px-6 py-4 rounded-lg bg-secondary text-white">
                {children}
              </div>
            )}
          </ModalContainer>
        ) : null;
      },
    [open, hideModal]
  );

  return { ModalWrapper, showModal, hideModal, open };
};
