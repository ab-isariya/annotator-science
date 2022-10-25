import Sticky from 'react-sticky-el';
import {motion, AnimatePresence} from 'framer-motion';

import ActiveAnnotationCard from '@document/ActiveAnnotationCard';

import {rightSidebarState, ReviewSidebar, AddModeSidebar} from '@document';
import {RightSidebarModes} from '@utils/constants';

const RightSidebar = () => {
  const {
    activeAnnotation,
    currentMode,
    addModeState
  } = rightSidebarState.useValue();

  return (
    <motion.div
      className={`absolute top-0 left-full ml-12 ${
        currentMode !== null ? '-mt-20' : '-mt-7'
      }`}
      style={{
        height: 'calc(100vh - 1.25rem)'
      }}>
      <Sticky stickyClassName="stuck">
        {/* NOTE(Rejon): We must use a different initial sticky name. "sticky" gets overriden by the tailwind class and breaks the component */}
        <div className={`relative z-1 ${currentMode === null ? '' : 'mt-7'}`}>
          <AnimatePresence>
            {activeAnnotation && currentMode === null && (
              <motion.div
                key="right-sidebar-active-annotation"
                transition={{ease: 'easeInOut', duration: '0.32'}}
                initial={{opacity: 0, y: 160}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 120}}>
                <ActiveAnnotationCard
                  className="max-w-64  w-72"
                  {...activeAnnotation}
                />
              </motion.div>
            )}
            {currentMode === RightSidebarModes.REVIEW &&
              activeAnnotation &&
              activeAnnotation.linkedCanonicalAnnotations && (
              <motion.div
                transition={{ease: 'easeInOut', duration: '0.32'}}
                initial={{opacity: 0, y: 40}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 60}}
                key="right-sidebar-review-mode">
                <ReviewSidebar />
              </motion.div>
            )}
            {addModeState && <AddModeSidebar />}
          </AnimatePresence>
        </div>
      </Sticky>
    </motion.div>
  );
};

export default RightSidebar;
