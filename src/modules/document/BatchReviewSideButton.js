import { useState, useEffect, useRef } from 'react';
import Sticky from 'react-sticky-el';
import Tooltip from '@ui/Tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { produce } from 'immer';

import { rightSidebarState } from '@document';
import { AnnotationStatus, RightSidebarModes } from '@utils/constants';
import { nFormatter } from '@utils/transformers';

import { ReactComponent as ReviewBatch } from '@svgs/Review_Batch.svg';
import { ReactComponent as ReviewAll } from '@svgs/Review_All.svg';
import { ReactComponent as Arrow } from '@svgs/Arrow_Large.svg';

const BatchReviewSideButton = () => {
  const buttonRef = useRef(); //<- Used on the button to get it's viewport position for scrolling
  const [stickyMode, setStickyMode] = useState('top'); //To effect if the button should stick to the top or the bottom.
  const [hardMount, setHardMount] = useState(false); //Hard refresh mount to get sticky working as expected.
  const [stickyDisabled, setStickyDisabled] = useState(false); //Sticky disabler
  const [isStuck, setIsStuck] = useState(false); //If the button is stuck or not.
  const { activeAnnotation, currentMode } = rightSidebarState.useValue(); //Active Annotation Data.

  //Scroll event subscriber for setting whether
  //the sticky mode should be on the top or the bottom.
  useEffect(() => {
    const handleScroll = () => {
      if (buttonRef.current) {
        if (
          buttonRef.current.getBoundingClientRect().top <
          window.innerHeight / 2 &&
          stickyMode !== 'top'
        ) {
          setStickyMode('top');
        } else if (
          buttonRef.current.getBoundingClientRect().top >=
          window.innerHeight / 2 &&
          stickyMode !== 'bottom'
        ) {
          setStickyMode('bottom');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });

  //Hard Mount to force the screen to scroll using stateful re-render.
  useEffect(() => {
    //If we have an annotation, with a node, and we haven't hard mounted yet.
    if (activeAnnotation && !hardMount) {
      let backupNode = activeAnnotation.node;

      if (!backupNode) {
        backupNode = document.getElementById(
          `annotation-${activeAnnotation.id}`
        );
      }

      if (backupNode) {
        backupNode.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'center'
        });
      }
      setHardMount(true);
    }
  }, [activeAnnotation]);

  //Fixes if the activeAnnotation changes and the annotation is stuck,
  //to unstick it by disabling sticky, and then re-enabling it just in time.
  useEffect(() => {
    //Only runs on unmount renders as to not run every single time something unnecessary happens.
    return () => {
      setStickyDisabled(true); //Disable sticky to unstick the button.
      setIsStuck(false); //Unstuck the inner state
      setTimeout(() => {
        //Timeout for renabling sticky.
        setStickyDisabled(false);
      }, 400);
    };
  }, [activeAnnotation]);

  const _node = activeAnnotation
    ? activeAnnotation.node ||
    document.getElementById(`annotation-${activeAnnotation.id}`)
    : null;

  //Check if all linked annotations have been reviewed or not.
  //NOTE(Rejon): This changes the icon that shows up on the button.
  const allReviewed = activeAnnotation?.linkedCanonicalAnnotations
    ?.filter((el) => el.status !== AnnotationStatus.MANUAL)
    .every((el) => el.status !== AnnotationStatus.NOT_REVIEWED);

  //Scroll the annotation to the middle of the screen.
  const scrollToAnnotation = () => {
    _node.scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'center'
    });
  };

  //Enable Review Mode on button click, it will hide this element, but that's on purpose.
  const enableReviewMode = () => {
    rightSidebarState.set((prev) =>
      produce(prev, (updated) => {
        updated.currentMode = RightSidebarModes.REVIEW;
      })
    );
  };

  return (
    <AnimatePresence>
      {activeAnnotation !== null &&
        _node &&
        currentMode !== RightSidebarModes.REVIEW && (
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
          ref={buttonRef}
          style={{
            right: '-1rem',
            top: _node.offsetTop,
            transition: 'all .2s ease'
          }}
          key="document-side-review-button">
          <Sticky
            mode={stickyMode}
            disabled={stickyDisabled}
            onFixedToggle={(stuck) => setIsStuck(stuck)}
            stickyClassName="stuck">
            {isStuck ? (
              <div
                className="relative bg-grey-800 shadow-md text-white rounded-md px-2.5 py-2 w-8 h-8 pb-2 flex items-center justify-center cursor-pointer"
                onClick={scrollToAnnotation}
                style={
                  stickyMode === 'bottom'
                    ? { bottom: '7px', right: '2rem' }
                    : { top: '7px', right: '2rem' }
                }>
                <Arrow
                  className={`text-white relative z-1 ${stickyMode === 'bottom' ? 'transform rotate-180' : ''
                  }`}
                />
                <span
                  className="bg-grey-800 absolute w-4 h-4 left-1/2 transform -translate-x-1/2 rotate-45"
                  style={
                    stickyMode === 'bottom' ? { bottom: '-5px' } : { top: '-5px' }
                  }></span>
              </div>
            ) : activeAnnotation.linkedCanonicalAnnotations?.length > 1 ? (
              <Tooltip
                content={`Review ${nFormatter(
                  activeAnnotation.linkedCanonicalAnnotations.length,
                  1
                )} Annotation${activeAnnotation.linkedCanonicalAnnotations.length > 1
                  ? 's'
                  : ''
                }`}
                placement="bottom">
                <div
                  className="bg-white border border-grey-500 rounded-md px-1.5 py-1.5 relative text-center cursor-pointer hover:bg-grey-50 flex flex-col items-center justify-center"
                  onClick={enableReviewMode}
                  style={{ width: '30px' }}>
                  <div
                    className={`${currentMode === RightSidebarModes.REVIEW
                      ? 'text-blue-500'
                      : 'text-grey-500'
                    } mb-1`}>
                    {allReviewed ? <ReviewAll /> : <ReviewBatch />}
                  </div>
                  <span className="text-xs font-inter">
                    {nFormatter(
                      activeAnnotation.linkedCanonicalAnnotations.length,
                      1
                    )}
                  </span>
                </div>
              </Tooltip>
            ) : (
              <></>
            )}
          </Sticky>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BatchReviewSideButton;
