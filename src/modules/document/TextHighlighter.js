import { useRef, useEffect } from 'react';

import clamp from 'lodash/clamp';
import sortBy from 'lodash/sortBy';
import isEmpty from 'lodash/isEmpty';
import { produce } from 'immer';

import Loading from '@ui/Loading';
import DocumentAnnotation from '@document/DocumentAnnotation';
import { useDocument, useAnnotations, rightSidebarState } from '@document';
import { RightSidebarModes, SNIPPET_CLAMP } from '@utils/constants';

/**
 * Control F like algorithm for searching the current document
 * for instances of highlighted text.
 *
 * It first trims and lowercases the document text and query,
 *
 * Then, it gets a loop iteration count by performing a regex match to
 * our query WITH WORD BOUNDARY. So if someone selects "virus" as part of "coronavirus"
 * then that virus won't count as part of the query, but every other singular instance of "virus"
 * will count.
 *
 * Then, it loops based on the match count, slices down the document and runs a regex search,
 * and then checks if the index of the current position in text matches an annotation's "start" data.
 * If it does, we skip to the next instance.
 *
 * Finally, it outputs an object with the results (a snippet component object, and the text information),
 * and if we found an annotation as part of our query or not.
 *
 *
 * @param {String} searchText - query text to use on document text.
 * @param {Integer} caretPosition - caretPosition of the range selection on the document.
 * @returns {Object} (results(Array), foundAnnotation(Boolean))
 */
//TODO(Rejon): FULL Word on Regex only
export const ControlF = (searchText, caretPosition, _document) => {
  //Lowercase all document text so querying is consistent and not case based.
  const lowercaseText = _document.text.toLowerCase();
  //Lower case the query as well.
  //Remove any leading/trailing white space that could interfere with the query
  const query = searchText.toLowerCase().trim();

  const regexFormula =
    '\\b' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b';

  //Number of times to loop is based on the number of times the query is found.
  //NOTE(Rejon): The replace in there is to ensure special characters get escaped else the regex will fail!
  const loopCount = (lowercaseText.match(new RegExp(regexFormula, 'g')) || [])
    .length;
  let results = []; //The results of the query.
  let foundAnnotation = false; //Boolean for if we found an annotation or not.
  let activeIndex = 0; //<- Active highlight span to have active when add mode starts.

  let sliceIndex = 0; //<- Index of the copy from the document sliced when using regex search.
  let trueIndex = 0; //<- Actual _document.text postion
  let sliceLength = 0; //<- Current carret position in document, ignoring sliceIndex always being an incorrect number.
  //Loop through and find our instances
  //to build the output objects.
  for (var i = 0; i < loopCount; i++) {
    //Slice the lowercase document text the length of our virtual caret position,
    //then search that slice for our query with word boundaries.
    //NOTE(Rejon): We slice this way because ".search()" only returns the first index in the text and not all instances.
    //             So we use trueIndex to keep track of our virtual caret in the full document text, while using sliceIndex,
    //             as the distance from last slice. (ie. lastIndexOfQueryInSliceUpToPoint + amountSlicedSoFar = true position in full text)
    sliceIndex = lowercaseText
      .slice(sliceLength, lowercaseText.length)
      .search(new RegExp(regexFormula));
    trueIndex = sliceIndex + sliceLength;
    sliceLength += sliceIndex + 1; //NOTE(Rejon): We plus one here to avoid looping the search on the same slice. (ie. this pushes the caret forward by 1 when searching again)

    //Minimum snippet caret position
    const minSnip = clamp(trueIndex - SNIPPET_CLAMP, 0, trueIndex);
    //Maximum snippet caret position
    const maxSnip = clamp(
      trueIndex + query.length + SNIPPET_CLAMP,
      trueIndex + query.length,
      _document.text.length
    );

    //Double check that our search result's caret position isn't inside/part of an annotation.
    if (
      _document.annotations.some(
        (an) => trueIndex >= an.start && trueIndex <= an.end
      )
    ) {
      foundAnnotation = true;
      continue;
    }

    //Get the text "as is" in the document.
    const textInDocument = _document.text.slice(
      trueIndex,
      trueIndex + query.length
    );

    //If the true index in the document matches our range caretPosition,
    //this is the active instance to highlight when opening add mode.
    if (trueIndex === caretPosition) {
      activeIndex = i;
    }

    results.push({
      //Snippet object structure. See the Snippet Component for more.
      snippet: {
        startText: _document.text.slice(minSnip, trueIndex),
        truncateStart: trueIndex - SNIPPET_CLAMP > 0,
        endText: _document.text.slice(trueIndex + query.length, maxSnip),
        truncateEnd: trueIndex + SNIPPET_CLAMP < _document.text.length,
        snippet: textInDocument
      },
      start: trueIndex, //Char span start
      end: trueIndex + query.length, //Char span end
      text: textInDocument //Actual text in the document.
    });
  }

  return {
    results,
    foundAnnotation,
    queryText: searchText,
    activeIndex,
    initialIndex: activeIndex //<- NOTE(Rejon): Used so we scroll back to where the user highlighted
  };
};

const TextHighlighter = () => {
  const textContainer = useRef();
  const { data: _document } = useDocument();
  const { data: annotations } = useAnnotations();
  const { addModeState, currentMode } = rightSidebarState.useValue();

  //Document listener for when a selection is collapsed or is empty to close the add mode state.
  //NOTE(Rejon): This is to solve for if the user clicks outside of the text highlighter and cancels their selection anywhere.
  useEffect(() => {
    const onSelectionChange = () => {
      const sel = document.getSelection();
      if (
        (sel.isCollapsed || sel.toString() === '') &&
        currentMode !== RightSidebarModes.ADD
      ) {
        rightSidebarState.set((prev) =>
          produce(prev, (updated) => {
            updated.addModeState = null;
          })
        );
      }
    };

    document.addEventListener('selectionchange', onSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  });

  //NOTE(Rejon): This code is a direct migration of onMouseUpHandler in HighlightedTextViewer.js of the DEPRECARED-tat-client repo
  const onSelection = () => {
    const selection = window.getSelection();

    //Don't worry about extra selections if we're currently in ADD mode.
    if (currentMode === RightSidebarModes.ADD) {
      return;
    }

    // anchorNode: the Node in which the selection begins
    // focusNode: the Node in which the selection ends
    // If there is selection opened and it isn't empty, accept it.
    //NOTE(Rejon): If the string is empty don't make an annotation.

    if (!selection.isCollapsed && selection.toString() !== '') {
      // If selection starts and ends in different node, it's no go
      //TODO: Figure out how to reconnect text nodes after inserting a marker and removing it.
      //      This is causing issues when dragging over the same area.
      if (selection.anchorNode === selection.focusNode) {
        let caretPosition = 0;
        let range = selection.getRangeAt(0);
        let preCaretRange = range.cloneRange();

        preCaretRange.selectNodeContents(textContainer.current);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretPosition =
          preCaretRange.toString().length - selection.toString().length;

        rightSidebarState.set((prev) =>
          produce(prev, (updated) => {
            //Unset the active annotation.
            updated.activeAnnotation = null;

            //If we're in Review Mode unset Review Mode.
            if (prev.currentMode === RightSidebarModes.REVIEW) {
              updated.currentMode = null;
            }

            //Updated addMode state
            updated.addModeState = {
              query: ControlF(selection.toString(), caretPosition, _document)
            };
          })
        );
      } else {
        //There's an annotation in the mix of the selection.
        //Set the add button to disabled.

        rightSidebarState.set((prev) =>
          produce(prev, (updated) => {
            //Unset the active annotation.
            updated.activeAnnotation = null;

            //If we're in Review Mode unset Review Mode.
            if (prev.currentMode === RightSidebarModes.REVIEW) {
              updated.currentMode = null;
            }

            //Updated addMode state
            updated.addModeState = {
              disabled: true
            };
          })
        );
      }
    } else {
      //Remove the add mode state if there's no proper selection.
      rightSidebarState.set((prev) =>
        produce(prev, (updated) => {
          updated.addModeState = null;
        })
      );
    }
  };

  /**
   * Add styling to annotations
   *
   * @param {Array} annotations - array of annotations
   * @param {String} text - plain text string
   * @return {Array} array of React objects
   */
  const formatDoc = (annotations, text, results = []) => {
    if (isEmpty(annotations)) {
      return [text];
    }

    /**
     * Convert annotations to array of formatted tags
     * This is an array of React objects, NOT annotations
     */
    const formattedArray = annotations.map((ann, index) => (
      <DocumentAnnotation key={`docAnn-${index}-${ann.id}`} annotation={ann} />
    ));

    const formattedResults = results.map((res, index) => (
      <span
        className={`bg-grey-100 cursor-pointer py-1.5 ${addModeState.query.activeIndex === index ? 'filter-active' : ''
        }`}
        onClick={() => {
          //On Click, scroll to to the mention card in the sidebar list.
          rightSidebarState.set((prev) =>
            produce(prev, (updated) => {
              updated.addModeState = {
                ...prev.addModeState,
                query: {
                  ...prev.addModeState.query,
                  activeIndex: index
                }
              };
            })
          );

          const mentionList = document.getElementById(
            'add-annotation-sidebar-list'
          );

          mentionList.scroll({
            top:
              document.getElementById(`add-annotation-${index}`).offsetTop - 10,
            left: 0,
            behavior: 'smooth'
          });
        }}
        id={`doc-control-f-${index}`}
        key={`doc-control-f-${index}`}>
        {res.text}
      </span>
    ));

    const mergedHighlight =
      currentMode !== RightSidebarModes.ADD
        ? sortBy([...annotations, ...results], [(o) => o.start])
        : [...results];

    // Add from beginning of text until first annotation
    let formattedAnnotationsArray = [text.slice(0, mergedHighlight[0].start)];

    let annotationIndex = 0;
    let resultIndex = 0;

    // For all annotations except last one, add styled annotation and then
    // text from current annotation to next one
    for (let i = 0; i < mergedHighlight.length - 1; i++) {
      if (mergedHighlight[i].id) {
        //Has an ID, is an annotation
        formattedAnnotationsArray.push(formattedArray[annotationIndex]);
        formattedAnnotationsArray.push(
          text.slice(mergedHighlight[i].end, mergedHighlight[i + 1].start)
        );
        annotationIndex += 1;
      } else {
        //No ID, is a highlight
        formattedAnnotationsArray.push(formattedResults[resultIndex]);
        formattedAnnotationsArray.push(
          text.slice(mergedHighlight[i].end, mergedHighlight[i + 1].start)
        );
        resultIndex += 1;
      }
    }

    // Finally, add from last annotation to end of text
    if (mergedHighlight[mergedHighlight.length - 1].id) {
      formattedAnnotationsArray.push(formattedArray[formattedArray.length - 1]);
      formattedAnnotationsArray.push(
        text.slice(mergedHighlight[mergedHighlight.length - 1].end)
      );
    } else {
      formattedAnnotationsArray.push(
        formattedResults[formattedResults.length - 1]
      );
      formattedAnnotationsArray.push(
        text.slice(mergedHighlight[mergedHighlight.length - 1].end)
      );
    }

    return formattedAnnotationsArray;
  };
  return (
    <div
      onMouseUp={onSelection}
      onDoubleClick={onSelection}
      ref={textContainer}
      id="text-container"
      className="px-docX py-5 font-serif font-normal text-base leading-extra-loose relative">
      {!_document ? (
        <Loading />
      ) : (
        formatDoc(
          annotations,
          _document.text,
          addModeState && currentMode === RightSidebarModes.ADD
            ? addModeState.query?.results || []
            : []
        )
      )}
    </div>
  );
};

export default TextHighlighter;
