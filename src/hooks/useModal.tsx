import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

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
              <div style={{ position: 'relative' }}>
                <div
                  onClick={() => hideModal()}
                  style={{
                    position: 'absolute',
                    top: -36,
                    right: 0,
                    color: 'white',
                    display: 'flex',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ marginRight: '4px' }}>Close</div>
                  <div>&#x2715;</div>
                </div>
                {children}
              </div>
            ) : (
              <div style={{ position: 'relative' }}>{children}</div>
            )}
          </ModalContainer>
        ) : null;
      },
    [open, hideModal]
  );

  return { ModalWrapper, showModal, hideModal, open };
};
