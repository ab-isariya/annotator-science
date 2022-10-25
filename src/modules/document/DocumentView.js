import {motion, AnimateSharedLayout, AnimatePresence} from 'framer-motion';

import TextHighlighter from '@document/TextHighlighter';
import {
  useDocument,
  RightSidebar,
  DocumentHeader,
  ExportTable,
  BatchReviewSideButton
  // AddAnnotationSideButton
} from '@document';
import {documentViewState} from '@document/data/useDocument';
import {DocumentViewTypes} from '@utils/constants';

const DocumentView = () => {
  const {data: document} = useDocument();
  const {currentView} = documentViewState.useValue();

  const isTableView = currentView === DocumentViewTypes.TABLE;

  return (
    <AnimateSharedLayout>
      <motion.div
        className={`m-auto  mt-5 rounded-t-md transition-shadow ease-in duration-75 ${
          isTableView ? 'w-full shadow-none' : 'shadow-document max-w-docView'
        }`}
        layout
        initial={{width: '100%'}}
        transition={{type: 'ease', duration: 0.4, layoutX: {duration: 0}}}>
        {document && (
          <>
            <DocumentHeader />
            <motion.div
              className="relative w-full mx-auto min-h-docView"
              transition={{type: 'ease', duration: 0.4, layoutX: {duration: 0}}}
              layout>
              <AnimatePresence exitBeforeEnter>
                {!isTableView ? (
                  <motion.div
                    key="document"
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    exit={{
                      opacity: 0,
                      y: 32
                    }}
                    initial={{
                      opacity: 0,
                      y: 32
                    }}
                    layout="position"
                    transition={{
                      type: 'ease',
                      duration: 0.45,
                      layoutX: {duration: 0}
                    }}
                    className="max-w-docView rounded-md mx-auto rounded-t-none">
                    <TextHighlighter />
                  </motion.div>
                ) : (
                  <motion.div
                    key="table"
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    exit={{
                      opacity: 0,
                      y: 32
                    }}
                    initial={{
                      opacity: 0,
                      y: 32
                    }}
                    layout
                    transition={{
                      type: 'ease',
                      duration: 0.45,
                      layoutY: {duration: 0},
                      layoutX: {duration: 0}
                    }}
                    className="mx-auto">
                    <ExportTable />
                  </motion.div>
                )}
              </AnimatePresence>
              {!isTableView && <RightSidebar />}
              {!isTableView && <BatchReviewSideButton />}
              {/* NOTE(Rejon): Commenting out due to Y positioning not working. */}
              {/* {!isTableView && <AddAnnotationSideButton />} */}
            </motion.div>
          </>
        )}
      </motion.div>
    </AnimateSharedLayout>
  );
};

export default DocumentView;
