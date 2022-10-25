/* eslint-disable */
import {useEffect, useRef, useState} from 'react';

import sortBy from 'lodash/sortBy';
import {motion, AnimatePresence} from 'framer-motion';
import produce from 'immer';
import {useForm} from 'react-hook-form';

import Button from '@ui/Button';
import Card from '@ui/Card';
import Loading from '@ui/Loading';
import Tooltip from '@ui/Tooltip';
import {
  annotationTypes,
  AnnotationStatus,
  RightSidebarModes
} from '@utils/constants';
import {Checkbox} from '@form';
import {getLinker, addAnnotations} from '@document/api';
import {
  rightSidebarState,
  Snippet,
  useDocument,
  useAnnotations
} from '@document';
import {useUser} from '@user';
import {nFormatter} from '@utils/transformers';

import typeStyles from '@styles/TypeStyles';
import {ReactComponent as HorizontalSort} from '@assets/svgs/Horizontal_Sort.svg';
import {ReactComponent as Close} from '@assets/svgs/Close.svg';
import {ReactComponent as Plus} from '@svgs/PlusSign.svg';
import {ReactComponent as Search} from '@svgs/Search.svg';
import {findIndex} from 'lodash';

const FORM_NAME = 'AddMode';

const AddModeSidebar = () => {
  const formElement = useRef();
  const [showConceptError, setConceptError] = useState(false);
  const {register, handleSubmit, watch, reset, setValue} = useForm();
  const {currentMode, addModeState} = rightSidebarState.useValue();
  const {data: user} = useUser();
  const {data: _document, mutate: mutateDocument} = useDocument();
  const {data: annotations, mutate: mutateAnnotations} = useAnnotations();

  //On first mount if the user reloads and they were in the middle of loading the linker,
  //attempt to get the linker again on first mount.
  useEffect(() => {
    const getLinkerInitial = async () => {
      //Get the concept type from the linker
      const {results} = await getLinker(addModeState.query.queryText);

      //Update add mode state with the linker results.
      rightSidebarState.set((prev) =>
        produce(prev, (updated) => {
          updated.addModeState = {
            ...prev.addModeState,
            loadingLinker: false,
            linker: results
          };
        })
      );
    };

    if (addModeState && addModeState.loadingLinker) {
      getLinkerInitial();
    }
  }, []);

  const loadingLinker = addModeState?.loadingLinker; //If we're loading the linker or not.
  const linker =
    !loadingLinker && addModeState?.linker ? addModeState.linker[0] : null; //Provide only the first result of the linker or null
  const linkerType = linker
    ? linker.type || annotationTypes.UNASSIGNED
    : annotationTypes.UNASSIGNED; //Get the linker type or set it to UNASSIGNED.
  const ControlF = addModeState?.query; //Our ControlF results from the TextHighlighter.
  //NOTE(Rejon): watch will be a boolean when it should be a string or an array.
  //             This massive check is to ensure it's ALWAYS an array.
  const formValues = watch(FORM_NAME, [])
    ? typeof watch(FORM_NAME, []) === 'string'
      ? [watch(FORM_NAME, [])]
      : watch(FORM_NAME, []) || []
    : []; //Current form values. NOTE(Rejon): Does not persist over reload.

  /**
   * Trigger for enabling add mode when clicking the "Add X Annoations" button
   * Only runs if Add Mode State is NOT disabled.
   *
   * 1. Update the current mode to Add Mode, set Loading Linker to true.
   * 2. Get Linker results based on our query text
   * 3. Update add mode state, set loading to false, provide linker results.
   */
  const enableAddMode = async () => {
    if (!addModeState.disabled) {
      //Initiate Add Mode, set Loading Linker to True
      rightSidebarState.set((prev) =>
        produce(prev, (updated) => {
          updated.currentMode = RightSidebarModes.ADD;
          updated.addModeState = {
            ...prev.addModeState,
            loadingLinker: true,
            linker: null
          };
        })
      );

      //Get the concept type from the linker
      const {results} = await getLinker(addModeState.query.queryText, user.accessToken);

      //Update add mode state with the linker results.
      rightSidebarState.set((prev) =>
        produce(prev, (updated) => {
          updated.addModeState = {
            ...prev.addModeState,
            loadingLinker: false,
            linker: results
          };
        })
      );
    }
  };

  /**
   * Trigger to close add mode.
   * 1. Scroll back to the initial location of where we started our range selection.
   * 2. Remove the addmode state and unset the current mode to default.
   */
  const onCloseAddMode = () => {
    //Get the initial range selection mention.
    const node = document.getElementById(
      `doc-control-f-${addModeState.query.initialIndex}`
    );

    //Scroll the window to it.
    if (node) {
      window.scroll({
        top: node.offsetTop - 10,
        left: 0,
        behavior: 'smooth'
      });
    }

    //Unset the current mode and the state.
    rightSidebarState.set((prev) =>
      produce(prev, (updated) => {
        updated.currentMode = null;
        updated.addModeState = null;
      })
    );
  };

  /**
   * Trigger for when clicking the detatched checkbox for Select All.
   */
  const onSelectAllToggle = ({target}) => {
    if (target.checked) {
      //If checked, stringify results and provide all of them to the form state.
      const stringfiedAllResults = ControlF.results.map((r) =>
        JSON.stringify(r)
      );
      setValue(FORM_NAME, stringfiedAllResults, {
        shouldDirty: true
      });
    } else {
      //If not checked, reset the form.
      reset();
    }
  };

  /**
   * Trigger for resetting the form when clicking the "-" checkbox.
   */
  const onDeselectAll = () => {
    reset();
  };

  //TODO(Rejon): Actual submission of the form results to mutate backend state.
  const onSubmitAnnotations = async ({AddMode}) => {
    if (!linker) {
      setConceptError(true);
      return;
    }

    setConceptError(false);

    const _data = typeof AddMode === 'string' ? [AddMode] : AddMode;

    const newAnnotations = _data.map((res, index) => {
      const parsed = JSON.parse(res);

      return {
        text: parsed.text,
        start: parsed.start,
        end: parsed.end,
        canonical_id: linker.id,
        canonical_name: linker.name,
        tag: linkerType,
        entity_p: 0,
        status: AnnotationStatus.MANUAL,
        id: `annotation-preflight-${index}`
      };
    });

    let preFlightAnnotations = sortBy(
      [...annotations, ...newAnnotations],
      [(o) => o.start]
    );

    let preflightProgressCount = _document.aggregations.progress.count;

    const indexOfManual = findIndex(
      _document.aggregations.progress.status,
      (o) => o === AnnotationStatus.MANUAL
    );

    preflightProgressCount[indexOfManual] =
      preflightProgressCount[indexOfManual] + newAnnotations.length;

    const preFlightAggregation = {
      ..._document.aggregations,
      progress: {
        count: preflightProgressCount,
        ..._document.aggregations.progress
      }
    };

    mutateDocument(
      {
        ..._document,
        aggregations: preFlightAggregation,
        annotations: preFlightAnnotations
      },
      false
    );

    mutateAnnotations(preFlightAnnotations, false);

    //TODO(Rejon): Need endpoint to work to continue this.
    const {aggregations: newAgg, annotations: newAnns} = await addAnnotations(
      user.id,
      user.accessToken,
      _document.id,
      newAnnotations
    );

    const postFlightAnnotations = sortBy(
      [...annotations, ...newAnns],
      [(o) => o.start]
    );

    mutateDocument({
      ..._document,
      aggregations: newAgg,
      annotations: postFlightAnnotations
    });

    mutateAnnotations(postFlightAnnotations);

    let activeMention = ControlF.results[ControlF.activeIndex];
    let newActiveAnnotation = newAnns.find(
      (an) => an.start === activeMention.start
    );
    let linkedCanonicalAnnotations = annotations.filter(
      (el) => el.canonical_id === newActiveAnnotation.canonical_id
    );

    rightSidebarState.set((prev) =>
      produce(prev, (updated) => {
        updated.currentMode = null;
        updated.addModeState = null;
        updated.activeAnnotation = {
          ...newActiveAnnotation,
          linkedCanonicalAnnotations
        };
      })
    );
  };

  /**
   * Trigger method for when a user clicks any of the cards in the list.
   *
   * 1. Get the mention element on the document.
   * 2. Scroll to it.
   * 3. Update the right sidebar's add mode State for the active mention index.
   *
   * @param {Integer} index
   */
  const scrollToMention = (index) => {
    const node = document.getElementById(`doc-control-f-${index}`);

    window.scroll({
      top: node.offsetTop - 10,
      left: 0,
      behavior: 'smooth'
    });

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
  };

  return (
    <motion.div
      transition={{ease: 'easeInOut', duration: '0.32'}}
      initial={{opacity: 0, y: 40}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: 60}}
      key="right-sidebar-add-mode"
      style={{width: '268px'}}>
      <AnimatePresence>
        {addModeState && currentMode !== RightSidebarModes.ADD && (
          <motion.div
            transition={{ease: 'easeInOut', duration: '0.32'}}
            initial={{opacity: 0, y: 40}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 60}}
            style={{width: '268px'}}
            className={`rounded text-sm ${
              addModeState.disabled || addModeState?.query.results.length === 0
                ? 'border border-grey-300 cursor-not-allowed'
                : 'bg-blue-500 text-white cursor-pointer'
            } select-none flex flex-row justify-center  p-2 items-center mt-7`}
            key="right-sidebar-add-button"
            onClick={enableAddMode}>
            {addModeState.disabled ? (
              <>
                Unable to add over existing annotations. <br />
                <br />
                If not visible, you may have filters applied.
              </>
            ) : addModeState?.query.results.length === 0 ? (
              <>
                Unable to add annotations. Please select an entire word or
                phrase.
              </>
            ) : (
              <>
                <Plus className="mr-2" /> Add{' '}
                {nFormatter(addModeState?.query.results.length, 1)} Annotations
              </>
            )}
          </motion.div>
        )}
        {currentMode === RightSidebarModes.ADD && (
          <motion.div
            transition={{ease: 'easeInOut', duration: '0.32'}}
            initial={{opacity: 0, y: 40}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 60}}
            className="w-65 mt-7 flex flex-col"
            style={{maxHeight: 'calc(100vh - 1.75rem)'}}
            key="right-sidebar-add-mode-active">
            <form
              ref={formElement}
              onSubmit={handleSubmit(onSubmitAnnotations)}>
              <h2 className="font-inter font-light flex flex-row items-center text-xl mb-2">
                <Tooltip content={'Close'} placement="bottom">
                  <Close
                    className="mr-2.5 text-grey-500 cursor-pointer"
                    onClick={onCloseAddMode}
                  />
                </Tooltip>
                Add Annotations
              </h2>
              <div className="rounded-lg bg-grey-50 p-2.5 mb-4">
                {loadingLinker || !linker ? (
                  !linker ? (
                    <>
                      <div className="rounded-lg bg-white border border-grey-100 p-4 text-center font-light mb-2">
                        <p className="font-inter text-base mb-2">
                          No Concept Found <br />
                          <span className="text-sm">
                            We couldn't find a concept that matched your current
                            selection
                          </span>
                        </p>
                        <div
                          className="bg-grey-50 rounded-md py-1.5 px-2 cursor-pointer flex flex-row items-center text-xs font-light font-inter justify-center m-auto text-grey-500"
                          style={{maxWidth: '141px'}}>
                          <Search className="text-grey-500 mr-2" />
                          Search Concepts
                        </div>
                      </div>
                      {showConceptError && (
                        <p className="text-left text-red-500 text-xs">
                          Choose a concept before adding annotations
                        </p>
                      )}
                    </>
                  ) : (
                    <Loading />
                  )
                ) : (
                  <>
                    <div className="mb-2.5 flex flex-row justify-between items-center">
                      <p className="text-xs font-inter font-light text-grey-500">
                        Suggested Concept <br />
                        <span className="text-sm text-black font-serif font-normal line-clamp-1">
                          for {addModeState.query.queryText}
                        </span>
                      </p>
                      <Button tertiaryIcon className="w-8 h-8">
                        <Tooltip
                          content={'Change Linked Concept'}
                          size={'small'}
                          placement="bottom">
                          <HorizontalSort className="text-grey-500" />
                        </Tooltip>
                      </Button>
                    </div>
                    <div className="rounded-lg bg-white border border-grey-100 p-4">
                      <div
                        className={`font-sans font-bold mb-2 text-${typeStyles[linkerType]['textColor']}`}>
                        {linker.name}
                      </div>
                      <div className="flex justify-between">
                        <div className="flex flex-row">
                          <Tooltip
                            content={typeStyles[linkerType]['label']}
                            arrow={false}
                            followCursor={true}
                            size="small">
                            {typeStyles[linkerType]['icon']}
                          </Tooltip>
                          <Tooltip
                            content={linker.name}
                            arrow={false}
                            followCursor={true}
                            size="small">
                            <span className="block ml-2 text-grey-500 underline font-normal font-mono text-sm">
                              {linker.id}
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-row justify-between items-center py-2 border-b border-grey-300">
                <p className="text-sm font-inter flex flex-row items-center">
                  {formValues.length === ControlF.results.length ||
                  formValues.length === 0 ? (
                    <Checkbox
                      className={'mr-1.5'}
                      id={'add-annotation-select-all'}
                      onChange={onSelectAllToggle}
                      defaultChecked={
                        formValues.length === ControlF.results.length
                      }
                    />
                  ) : (
                    //We have selected > 0 & < all options, render a checkbox like element with a crossed line.
                    <div
                      className="cursor-pointer relative rounded-sm w-4 h-4 mr-1 border-2 border-grey-400 bg-grey-400"
                      onClick={onDeselectAll}>
                      <span
                        className="block w-2 bg-white absolute -trans left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        style={{height: '2px'}}></span>
                    </div>
                  )}
                  {formValues.length === 0 ? (
                    <>
                      <b>{nFormatter(ControlF.results.length, 1)}</b>
                      <span className="ml-1 font-light">Mentions</span>
                    </>
                  ) : (
                    <>
                      Selected <b className="mx-1">{formValues.length}</b>
                      Mention{formValues.length > 1 && 's'}
                    </>
                  )}
                </p>
                <Button
                  primary
                  disabled={formValues.length === 0}
                  type="submit"
                  className="flex flex-row items-center font-normal">
                  <Plus className="mr-2" />
                  Add
                </Button>
              </div>
              <div
                id={'add-annotation-sidebar-list'}
                className="pt-4 px-2.5 overflow-auto relative flex-1"
                style={{maxHeight: 'calc(100vh - 290px)'}}>
                {ControlF.results.map((result, index) => {
                  return (
                    <Card
                      hover
                      id={`add-annotation-${index}`}
                      active={ControlF.activeIndex === index}
                      className="cursor-pointer mb-2.5 flex flex-row"
                      onClick={() => scrollToMention(index)}
                      key={`add-annotation-${index}`}>
                      <Checkbox
                        className={'mr-1.5'}
                        value={JSON.stringify(result)}
                        defaultChecked={formValues?.find(
                          (el) => el.start === result.start
                        )}
                        ref={register}
                        name={FORM_NAME}
                      />
                      <Snippet
                        className="bg-grey-100 py-1.5"
                        {...result.snippet}
                      />
                    </Card>
                  );
                })}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddModeSidebar;
