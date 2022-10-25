import {useCallback, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import {blackToGrey500, toBlack} from '@utils/colorsFilters';
import {ReactComponent as Close} from '@assets/svgs/Close.svg';

const Modal = ({open, toggleModal, children}) => {
  const wrapperRef = useRef(null);

  /**
   * Execute onClose function on pressing Esc
   *
   * @param event
   */
  const handlerEsc = useCallback(
    (event) => {
      // Esc
      if (event.keyCode === 27) {
        toggleModal(false);
      }
    },
    [toggleModal]
  );

  /**
   *
   */
  useEffect(() => {
    document.addEventListener('keydown', handlerEsc, false);

    return () => {
      document.removeEventListener('keydown', handlerEsc, false);
    };
  }, [handlerEsc]);

  return (
    // Modal background
    open && (
      <div
        data-testid="modal"
        className="fixed z-10 inset-0 overflow-y-auto flex">
        <div
          className="relative p-8 bg-white w-full max-w-lg m-auto flex-col flex rounded-md border border-grey-500"
          ref={wrapperRef}>
          <span className="absolute top-0 right-0 p-4">
            <Close
              onClick={() => toggleModal(false)}
              style={{filter: `${toBlack} ${blackToGrey500}`}}
            />
          </span>
          <div>{children}</div>
        </div>
      </div>
    )
  );
};

Modal.propTypes = {
  //Children to render inside of modal
  children: PropTypes.node,
  //If the modal is open or not
  open: PropTypes.bool.isRequired,
  //Toggle for opening/closing the modal.
  toggleModal: PropTypes.func.isRequired
};

export default Modal;
