import {useState, useRef} from 'react';

import Fuse from 'fuse.js';
import isNil from 'lodash/isNil';
import map from 'lodash/map';

import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';
import zipWith from 'lodash/zipWith';
import produce from 'immer';
import {useFormContext} from 'react-hook-form';

import Bar from '@ui/Bar';
import Button from '@ui/Button';
import Loading from '@ui/Loading';
import Sort, {SORT_OPTIONS} from './ConceptsWidget_Sort';
import Title from '@ui/Title';
import Tooltip from '@ui/Tooltip';
import TypeStyles from '@styles/TypeStyles';
import {AnnotationFilterKeys} from '@utils/constants';
import {Checkbox} from '@form';
import {NumberCommaSuffix} from '@utils/transformers';
import {
  useDocument,
  spotlightFilterState,
  annotationQueryState
} from '@document';

import {ReactComponent as CloseIcon} from '@svgs/Close.svg';
import {ReactComponent as Filter} from '@svgs/Filter.svg';
import {ReactComponent as FilterFilled} from '@svgs/FilterFilled.svg';
import {ReactComponent as Search} from '@svgs/Search.svg';

//Maximum number of concepts to render when collapsed based on design spec.
const MAX_CONCEPTS_COLLAPSE = 5;

export const queryConcepts = ({
  isCollapsed,
  entities,
  currentFilterQuery,
  filterOpen,
  filterActive,
  isExpanded,
  sort,
  searchIndex,
  searchQuery
}) => {
  let _inputSearchQuery = searchQuery?.trim();

  //Entity list to map through and render.
  let entitiesToRender = isCollapsed
    ? entities.slice(0, MAX_CONCEPTS_COLLAPSE)
    : entities;

  //Search result entity canonical_id's to render.
  //NOTE(Rejon): We use a check during the entitiesToRender map for whether an element should display or not.
  //             No elements are removed from the DOM to ensure we can keep their "checked" states during filter form
  //             querying.
  let searchEntitiesToRender = [];

  //If this widget has active filters, and our form is closed:
  //only render elements inside of our currentFilterQuery.
  if (filterActive && !filterOpen) {
    entitiesToRender = entities.filter((o) =>
      currentFilterQuery.value.includes(o.canonical_id)
    );
  } else if (isExpanded || filterOpen) {
    //This widget is showing the expanded view OR the filter form is open:
    //use all entities and sort them if a sort is available

    entitiesToRender = entities; //This is to solve for the case where it's expanded, but we're in the form view.

    //If the sort is ascending reverse the array.
    //NOTE(Rejon): entitiesObj.count should ALWAYS come back in sorted descending order
    //             from the backend. Given this rule, we can assume if we're not descending,
    //             we can just reverse the array.
    if (!isNil(sort)) {
      //NOTE(Rejon): sortBy also sorts lowercase letters. This is to ensure elements are sorted only by letter, not case.
      if (sort.key === 'name') {
        entitiesToRender = sortBy(entitiesToRender, (o) =>
          String(o[sort.key]).toLowerCase()
        );
      } else {
        entitiesToRender = sortBy(entitiesToRender, (o) => o[sort.key]);
      }

      //If the sort object is ascending reverse the object.
      //NOTE(Rejon): This is because the initial array is sorted descending by 'count'.
      if (!sort.desc) {
        reverse(entitiesToRender);
      }
    }
  }

  //Perform search
  if (_inputSearchQuery && _inputSearchQuery !== '') {
    //NOTE(Rejon): Search returns our data inside of a custom query object, we map to get it out of there.
    searchEntitiesToRender = searchIndex
      .search(searchQuery)
      .map((o) => o.item.canonical_id);
  }

  return {
    searchEntitiesToRender,
    entitiesToRender
  };
};

const ConceptsWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false); //Whether to show expanded view style or not.
  const [sort, setSort] = useState(null); //Descending by default is true based on backend data order.
  const [searchQuery, setSearchQuery] = useState(null); //Search input value state

  const searchInput = useRef(null); //Search Input element ref. Used for reseting form value.
  const sortSelect = useRef(null); //Sorting Select component ref. Passed to ConceptsWidget_Sort.js
  const conceptList = useRef(null); //Concept's list element. Used for reseting scrollTop on sort change.

  const {data: document} = useDocument();
  const {register, reset, setValue, watch} = useFormContext();
  const {concepts} = spotlightFilterState.useValue();
  const {filter} = annotationQueryState.useValue();

  if (!document) {
    //TODO(Rejon): Need loading state for top entities.
    return <Loading className="px-4 pb-4" />;
  }

  /**
   * Array of entity concepts pulled from the document aggregation.
   *
   * NOTE(Rejon): We zip this up in an array of objects because aggregations,
   *              returns each thing we need in individual arrays and sorted by count.
   *              This enables us to cleanly pass the data to the Fuse.js searchIndex.
   */
  const entitiesObj = zipWith(
    document.aggregations.entities.names,
    document.aggregations.entities.count,
    document.aggregations.entities.types,
    document.aggregations.entities.ids,
    (name, count, type, canonical_id) => {
      return {
        name: name,
        count: count,
        type: type,
        canonical_id: canonical_id
      };
    }
  );

  //Fuse.js searchIndex. See this for more:https://fusejs.io/#why-should-i-use-it
  //Search is on 'name' from our zipped objects above.
  //Threshold is set to 0.1 or 1 character fuzzy distance on search terms.
  const searchIndex = new Fuse(entitiesObj, {keys: ['name'], threshold: 0.1});

  //Current Filter Query for this Widget
  //Find the filter query based on the filter key for this widget.
  const currentFilterQuery = filter.find(
    (o) => o.field === AnnotationFilterKeys.Concepts
  );

  //This widget's filter is active if it has a query.
  const filterActive = currentFilterQuery !== undefined;

  //Form values that update whenever we change a checkbox in form mode.
  //Mostly used to keep the "Select All" checkbox properly updated.
  let formValues =
    watch(AnnotationFilterKeys.Concepts, undefined) ||
    currentFilterQuery?.value ||
    [];

  /**
   * Toggle whether the form for applying filters is open or not.
   * Can be set to a specific state if the setOpen parameter is provided.
   *
   *
   * @param {Boolean} setOpen
   */
  const toggleFilterState = (setOpen) => {
    spotlightFilterState.set((prev) =>
      produce(prev, (updated) => {
        let isOpen = !isNil(setOpen) ? setOpen : !prev.concepts.filterOpen;

        //If we're closing the filter form, reset expanded
        if (!isOpen) {
          setSort(null); //Reset current sort
          setIsExpanded(false);
          sortSelect.current.select.setValue(SORT_OPTIONS[0]); //Reset value on sort dropdown to default
        } else {
          //We're opening the filter form, set expanded to true
          setSort(null); //Reset sort

          if (sortSelect.current) {
            //NOTE(Rejon): Since this has a chance of initially mounting the select, check if it exists.
            sortSelect.current.select.setValue(SORT_OPTIONS[0]); //Reset value on sort dropdown to default
          }
        }

        //If filterState doesn't have concepts or the filter isn't open.
        //Open it.
        updated.concepts = {
          ...prev.concepts,
          //NOTE(Rejon): If setOpen is provided then we don't toggle based
          //             on current state, but set based on boolean provided
          filterOpen: isOpen
        };
      })
    );
  };

  /**
   * Clear the filter from the spotlight form,
   * close the filter form on this widget,
   * remove the filter from the annotationQueryState,
   * set isExpanded to false.
   */
  const onClearFilter = () => {
    let resetObj = {};
    resetObj[AnnotationFilterKeys.Concepts] = null;
    //Reset the Spotlight Form
    reset(resetObj);
    setIsExpanded(false);

    //Close the filter
    spotlightFilterState.set((prev) =>
      produce(prev, (updated) => {
        updated.concepts = {
          filterOpen: prev.concepts.filterOpen
        };
      })
    );

    //Remove the filter from the query
    annotationQueryState.set((prev) =>
      produce(prev, (updated) => {
        //Remove all instances of this filter from the query
        const newFilterQuery = prev.filter.filter(
          (o) => o.field !== AnnotationFilterKeys.Concepts
        );

        updated.filter = newFilterQuery;

        //Reset to default if there are no more filters.
        //NOTE(Rejon): We reset to increase speed of UI update back to normal.
        //             See useAnnotations return statement (line 47) as to why.
        updated.isDefault = newFilterQuery.length === 0;
      })
    );
  };

  /**
   * Toggle for if the select all checkbox to check
   * or un-check all form checkboxes.
   *
   * NOTE(Rejon): Must be placed on the Checkbox component,
   *              NOT a div.
   *
   * See the react-hook-form "setValue" for more: https://react-hook-form.com/api/useform/setvalue
   *
   * @param {Event: HTMLElement} target
   */
  const onSelectAllToggle = ({target}) => {
    if (target.checked) {
      //Update the Spotlight Form for Types to include all types.
      setValue(
        AnnotationFilterKeys.Concepts,
        map(entitiesObj, 'canonical_id'),
        {
          shouldDirty: true
        }
      );
    } else {
      //Update Spotlight form to include no values.
      //NOTE(Rejon): We don't use "reset" from useFormContext here since the
      //             intended action is to update the form values to unchecked.
      setValue(AnnotationFilterKeys.Concepts, [], {shouldDirty: true});
    }
  };

  /**
   * Deselect
   *
   * See the react-hook-form "setValue" for more: https://react-hook-form.com/api/useform/setvalue
   */
  const onDeselectAll = () => {
    setValue(AnnotationFilterKeys.Concepts, [], {shouldDirty: true});
  };

  /**
   * Toggle Expanded view.
   * Resets the search input query and the input's value.
   *
   * NOTE(Rejon): We don't set the searchInput's value to empty here,
   *              because this action is what mounts the input.
   *              It wouldn't exist yet.
   */
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setSearchQuery(null);
  };

  /**
   * Reset the search query by "Click the X in the input"
   * Reset's the search query state and the inputs value.
   *
   */
  const resetSearchQuery = () => {
    setSearchQuery(null);
    searchInput.current.value = '';
  };

  /**
   * Callback method invoked by ConceptsWidget_Sort
   * react-select component's onChange prop.
   *
   * Set's the concept list scroll back to the top
   * when it changes a sort.
   *
   * @param {Object} data: {value} - value object from SORT_OPTIONS
   */
  const onSortChange = ({value}) => {
    setSort(value); //Update the Sort.
    conceptList.current.scrollTop = 0; //Scroll list back to top when sort changes
  };

  //Whether to show "All Concepts" or "Top Concepts"
  const showAllConcepts = isExpanded && !filterActive;

  const widgetTitle = (
    <div className="flex items-center justify-between mb-3.5 px-4">
      <Title size="lg" className="text-grey-900">
        {concepts.filterOpen
          ? 'Filters'
          : showAllConcepts
            ? 'All Concepts'
            : 'Top Concepts'}
      </Title>
      {/* Size defined to make clickable an area larger than icon:
            add onClick to div, not icon
             https://www.figma.com/file/1nNRtyjS81HhHrBLFFIxjp/Collapsible-Widget?node-id=1%3A1425 */}
      <div style={{minWidth: '36px'}}>
        {concepts.filterOpen ? (
          //Filter Form is open: Render the "Cancel" and "Apply" buttons
          <div className="flex flex-row items-center">
            <div
              className="font-inter text-sm mr-2 text-grey-500 cursor-pointer"
              onClick={() => {
                toggleFilterState(false);
                setSearchQuery(null);
              }}>
              Cancel
            </div>
            <Button
              className="text-sm border border-grey-500 px-2 py-1"
              onClick={() => {
                toggleFilterState(false);
                setSearchQuery(null);
              }}
              type="submit">
              Apply
            </Button>
          </div>
        ) : filterActive ? (
          // Filter form is NOT open: Render the the "Clear" and filled in Filter button
          <div className="flex flex-row items-center">
            <div
              className="font-inter text-sm mr-2 text-grey-500 cursor-pointer"
              onClick={() => onClearFilter()}>
              Clear
            </div>
            <FilterFilled
              onClick={() => toggleFilterState()}
              className="ml-auto text-blue-500 cursor-pointer"
            />
          </div>
        ) : (
          //Filter form is NOT open AND no active filters: Render the normal Filter button
          <Tooltip content="Filter" placement="left">
            <Filter
              onClick={() => toggleFilterState()}
              className="ml-auto cursor-pointer text-grey-500"
            />
          </Tooltip>
        )}
      </div>
    </div>
  );

  //Whether to render the "Expand" / "Collapse" buttons
  const showExpandCollapse = !concepts.filterOpen && !filterActive;

  //Whether to render the search/sort inputs.
  const showSearchSort = (isExpanded && !filterActive) || concepts.filterOpen;

  const widgetSubTitle = (
    <div className="mb-2 px-4">
      <div className="flex justify-between font-inter text-xs font-light text-grey-500 mb-2">
        {/* Subtext when form is open */}
        {concepts.filterOpen ? (
          //Filter Form is open: Render the "Select All"/"Currently Selected" Checkbox
          <div className="flex row">
            {/* NOTE(Rejon): We don't use the same Checkbox because the input doesn't support 
                             an intermediate state based on the designs. We fake it with a div.*/}
            {formValues.length === entitiesObj.length ||
            formValues.length === 0 ? ( //We have selected all or 0 form checkboxes. Render the Checkbox
                <Checkbox
                  className={'mr-1'}
                  id={'types-select-all'}
                  onChange={onSelectAllToggle}
                  defaultChecked={formValues.length === entitiesObj.length}
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

            {/* 0 "X Types" vs. Multiple "Selected X Type(s)" */}
            <p className="text-xs text-grey-500">
              {formValues.length === 0 ? (
                <>
                  <span className="font-medium">{entitiesObj.length}</span>{' '}
                  Concepts
                </>
              ) : (
                <>
                  Selected{' '}
                  <span className="font-medium">{formValues.length}</span>{' '}
                  Concept
                  {formValues.length > 1 && 's'}
                </>
              )}
            </p>
          </div>
        ) : filterActive ? (
          // Filter Form is closed, but we have active filters: Render X of Y Concepts
          <p>
            Displaying{' '}
            <span className="font-medium">
              {currentFilterQuery.value.length}{' '}
            </span>
            of <span className="font-medium">{entitiesObj.length} </span>
            Concepts
          </p>
        ) : (
          //No active filters. Render all #
          <p>
            <span className="font-medium">{entitiesObj.length} </span>
            Concepts
          </p>
        )}
        {showExpandCollapse && (
          <p className="cursor-pointer" onClick={toggleExpanded}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </p>
        )}
      </div>
      {/* Search Input & Sorting Inputs */}
      {showSearchSort && (
        <div className="flex row">
          <div className="relative flex w-full flex-wrap items-stretch mr-1">
            <span className="p-2 z-1 h-full leading-snug font-normal absolute text-center text-grey-500 absolute bg-transparent rounded text-base items-center justify-center w-8">
              <Search className="w-full h-full" />
            </span>
            <input
              type="text"
              ref={searchInput}
              className="p-2 z-0 text-xs placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded-md border border-grey-500 w-full pl-7 pr-6"
              onChange={({target}) => {
                setSearchQuery(target.value.trim());
              }}
            />
            {searchQuery && searchQuery.length > 0 && (
              <span
                className="z-10 h-full leading-snug font-normal absolute text-center text-grey-500 absolute bg-transparent rounded text-base items-center justify-center right-1 py-2.5 cursor-pointer"
                style={{width: '1.2rem'}}
                onClick={resetSearchQuery}>
                <CloseIcon className="w-full h-full transform scale-75" />
              </span>
            )}
          </div>

          <Sort onSortChange={onSortChange} ref={sortSelect} />
        </div>
      )}
    </div>
  );

  //If we don't have any concepts to render, show "0 Concepts"
  //instead of rendering a list.
  if (!entitiesObj.length) {
    return (
      <>
        {widgetTitle}
        <p className="text-xs text-grey-500">
          <span className="font-medium">0</span> Types
        </p>
      </>
    );
  } else {
    //We have concepts, render them in the list format we expect.
    const maxWidth = entitiesObj[0].count; //Entities are sorted by frequency, first value is maximum.

    const {entitiesToRender, searchEntitiesToRender} = queryConcepts({
      isCollapsed: showExpandCollapse,
      entities: entitiesObj,
      filterActive,
      filterOpen: concepts.filterOpen,
      currentFilterQuery,
      sort,
      searchQuery,
      searchIndex
    });

    return (
      <>
        {widgetTitle}
        {widgetSubTitle}
        <div
          ref={conceptList}
          className={'px-4 pb-5 overflow-auto overflow-x-hidden'}
          style={{maxHeight: '172px'}}>
          {entitiesToRender.map(({count, type, name, canonical_id}, index) => {
            const progressValue = (count * 100) / maxWidth;
            const entityTypeStyle = TypeStyles[type[0]]; //NOTE(Rejon): Types are an array by default since there's a chance of an entity being assigned 2 types.
            const shouldRender = searchQuery
              ? searchEntitiesToRender.includes(canonical_id)
              : true;

            return (
              <div
                className={`flex items-center ${
                  isExpanded || concepts.filterOpen ? 'mb-px' : 'mb-2'
                } last:mb-0 ${shouldRender ? '' : 'hidden'}`}
                key={`top-entity-${canonical_id}`}>
                {!isExpanded && !concepts.filterOpen && (
                  <p className="text-grey-500 text-xs min-w-4">{index + 1}</p>
                )}
                {concepts.filterOpen && (
                  <Checkbox
                    className={'mr-1'}
                    id={`concepts-widget-${canonical_id}`}
                    value={canonical_id}
                    key={`concepts-widget-${canonical_id}`}
                    name={AnnotationFilterKeys.Concepts}
                    defaultChecked={currentFilterQuery?.value.includes(
                      canonical_id
                    )}
                    ref={register}
                  />
                )}

                <Bar
                  bgColor={`bg-${entityTypeStyle['activeBg']}`}
                  padding={`${
                    isExpanded || concepts.filterOpen ? '' : 'pl-1'
                  } py-1`}
                  size={
                    filter.length === 0 && !concepts.filterOpen && !isExpanded
                      ? progressValue
                      : 0
                  }>
                  <Tooltip followCursor={true} arrow={false} content={name}>
                    <div
                      className={`line-clamp-1 text-xs font-semibold font-sans text-${entityTypeStyle['textColor']}`}>
                      {name}
                    </div>
                  </Tooltip>
                </Bar>

                <p className="min-w-6.5 ml-2.5 text-right">
                  {NumberCommaSuffix(count, 3)}
                </p>
              </div>
            );
          })}
          {searchQuery && searchEntitiesToRender.length === 0 && (
            <p className="text-xs text-grey-500">
              0 Concepts found for "{searchQuery}"
            </p>
          )}
        </div>
      </>
    );
  }
};

export default ConceptsWidget;
