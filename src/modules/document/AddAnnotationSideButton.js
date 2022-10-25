import Tooltip from '@ui/Tooltip';
import {motion, AnimatePresence} from 'framer-motion';
import produce from 'immer';

import {rightSidebarState} from '@document';
import {nFormatter} from '@utils/transformers';

import {ReactComponent as Plus} from '@svgs/PlusSign.svg';
import {RightSidebarModes} from '@utils/constants';

//NOTE(Rejon): This component is on hold until we can figure out how to place it properly due to shadow dom issues.
const AddAnnotationSideButton = () => {
  const {currentMode, addModeState} = rightSidebarState.useValue(); //Active Annotation Data.

  //Enable Review Mode on button click, it will hide this element, but that's on purpose.
  const enableAddMode = () => {
    if (!addModeState.disabled) {
      rightSidebarState.set((prev) =>
        produce(prev, (updated) => {
          updated.currentMode = RightSidebarModes.ADD;
        })
      );
    }
  };

  return (
    <AnimatePresence>
      {addModeState && currentMode !== RightSidebarModes.ADD && (
        <motion.div
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: 32
          }}
          initial={{
            opacity: 0,
            x: 32
          }}
          transition={{
            type: 'ease',
            duration: 0.32
          }}
          className="absolute"
          style={{
            right: '-1rem',
            top: addModeState.buttonPosition,
            transition: 'all .2s ease'
          }}
          key="document-side-add-button">
          <Tooltip
            content={
              addModeState.disabled ? (
                <span className="text-center flex items-center justify-center">
                  Unable to add <br /> annotations over <br /> existing
                  annotations
                </span>
              ) : (
                `Add ${nFormatter(
                  addModeState.query.results.length,
                  1
                )} Annotation${
                  addModeState.query.results.length > 1 ? 's' : ''
                }`
              )
            }
            placement="bottom">
            <div
              className={`bg-white select-none border ${
                addModeState.disabled
                  ? 'border-grey-200 cursor-not-allowed'
                  : 'border-grey-500 cursor-pointer hover:bg-grey-50'
              } rounded-md px-1.5 py-1.5 relative text-center  flex flex-col items-center justify-center`}
              onClick={enableAddMode}
              style={{width: '30px'}}>
              <div
                className={`${
                  addModeState.disabled ? 'text-grey-200' : 'text-grey-500 mb-1'
                }`}>
                <Plus />
              </div>
              {!addModeState.disabled && (
                <span className="text-xs font-inter">
                  {nFormatter(addModeState.query.results.length, 1)}
                </span>
              )}
            </div>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddAnnotationSideButton;
