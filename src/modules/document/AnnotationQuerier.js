import PropTypes from 'prop-types';

import flattenDeep from 'lodash/flattenDeep';
import isArray from 'lodash/isArray';
import SmoothCollapse from 'react-smooth-collapse';
import produce from 'immer';
import ReactSelect, {components} from 'react-select';
import {indexOf, pullAt} from 'lodash';

import {annotationQueryState, allEntitiesState} from '@document';
import Button from '@ui/Button';
import Badge from '@ui/Badge';

import {ReactComponent as ArrowIcon} from '@svgs/Arrow.svg';
import {ReactComponent as FilterIcon} from '@svgs/Filter.svg';
import {ReactComponent as CloseIcon} from '@svgs/Close.svg';

const Filter = ({className}) => {
  const {filter} = annotationQueryState.useValue();

  return (
    <Button secondary className={`flex items-center ${className}`}>
      <div className="text-grey-500">
        <FilterIcon />
      </div>
      <p>{'   Filters'}</p>
      {filter.length > 0 && <Badge className="ml-2">{filter.length}</Badge>}
    </Button>
  );
};

Filter.propTypes = {
  // Tailwind Classes
  className: PropTypes.string
};

const Sort = ({className}) => {
  const {sort} = annotationQueryState.useValue();

  if (!sort) {
    return <></>;
  }

  const options = [
    {
      label: 'Sequential',
      value: 'start'
    },
    {
      label: 'Confidence Score',
      value: 'entity_p'
    }
  ];

  const toggleSortOrder = () => {
    annotationQueryState.set((prev) =>
      produce(prev, (updated) => {
        const prevDirection = prev.sort[0].desc;

        updated.isDefault = false;

        updated.sort = [
          {
            ...prev.sort[0],
            desc: !prevDirection
          }
        ];
      })
    );
  };

  const setSortField = ({value}) => {
    annotationQueryState.set((prev) =>
      produce(prev, (updated) => {
        updated.sort = [
          {
            ...prev.sort[0],
            field: value
          }
        ];
        updated.isDefault = false;
      })
    );
  };

  const Menu = (props) => (
    <components.Menu
      className="m-0 rounded-md overflow-hidden shadow-sm"
      {...props}
    />
  );

  const MenuList = (props) => (
    <components.MenuList
      className="p-0 overflow-hidden rounded-md text-sm"
      {...props}
    />
  );

  const Option = (props) => {
    const {isSelected, isDisabled, isFocused} = props;

    const selectedClass = `${
      isSelected && !isDisabled && 'bg-blue-500 text-white'
    }`;
    const disabledClass = `${isDisabled && 'text-grey-300 bg-white'}`;
    const hoverClass = `${!isDisabled && 'hover:bg-grey-50 hover:text-black'}`;
    const focusClass = `focus:bg-grey-50 focus:text-black ${
      isFocused && !isSelected && 'bg-grey-50 text-black'
    }`;
    const baseClass = 'font-inter';

    const optionClass = `${baseClass} ${hoverClass} ${disabledClass} ${selectedClass} ${focusClass}`;

    return <components.Option {...props} className={optionClass} />;
  };

  Option.propTypes = {
    //Prop from react-select for if the option is selected or not
    isSelected: PropTypes.bool.isRequired,
    //Prop from react-select for if the option is disabled for selection or not
    isDisabled: PropTypes.bool.isRequired,
    //Prop from react-select for if the option is focused or not.
    isFocused: PropTypes.bool.isRequired
  };

  const ValueContainer = (props) => (
    <components.ValueContainer className="font-inter text-black" {...props} />
  );

  const SingleValue = (props) => (
    <components.SingleValue className="text-black" {...props} />
  );

  const Control = (props) => {
    const {isFocused, isDisabled} = props; //NOTE(Rejon): Need to pull this out since actual focus is on Input not Control.

    const activeClass = 'active:border-blue-500';
    const focusClass = 'focus:outline-none focus:filter-active';
    const baseClass = 'rounded-md border border-grey-500 text-sm';
    const hoverClass = 'hover:bg-grey-50';

    const controlClass = `${baseClass} ${
      isFocused && 'outline-none filter-active'
    } shadow-none flex-1 border-r-0 rounded-br-none rounded-tr-none ${activeClass} ${hoverClass} ${focusClass}`;
    const arrowClass = `${baseClass} w-9 bg-white rounded-bl-none rounded-tl-none flex items-center justify-center text-grey-500 ${hoverClass} ${activeClass} ${focusClass}`;

    return (
      <div className="flex relative w-full">
        <components.Control className={controlClass} {...props} />
        <Button
          className={arrowClass}
          disabled={isDisabled}
          onClick={toggleSortOrder}>
          <ArrowIcon
            className={`filter-none ${!sort[0].desc && 'transform rotate-180'}`}
          />
        </Button>
      </div>
    );
  };

  Control.propTypes = {
    //Prop from react-select for if the select is focused or not
    isFocused: PropTypes.bool.isRequired,
    //Prop from react-select for if the select has been disabled or not
    isDisabled: PropTypes.bool.isRequired
  };

  return (
    <ReactSelect
      components={{
        Menu,
        MenuList,
        ValueContainer,
        DropdownIndicator: null,
        IndicatorSeparator: null,
        Control,
        Option,
        SingleValue
      }}
      className={`min-w-2/5 ${className}`}
      blurInputOnSelect={true}
      isSearchable={false}
      onChange={setSortField}
      options={options}
      isOptionDisabled={(option) => option.disabled}
      defaultValue={options[0]}
    />
  );
};

Sort.propTypes = {
  // Tailwind Classes
  className: PropTypes.string
};

const AnnotationQuerier = () => {
  const {filter} = annotationQueryState.useValue();
  const {showFilters} = allEntitiesState.useValue();

  const getFilterValues = (filterArr) =>
    flattenDeep(
      filterArr.map((f, index) => {
        if (isArray(f.value)) {
          return f.value.map((v) => ({index, value: v}));
        } else {
          return {index, value: f.value};
        }
      })
    );

  const filtersToShow = getFilterValues(filter);
  const setShowFilters = (show) => {
    allEntitiesState.set((prev) => ({
      ...prev,
      showFilters: show
    }));
  };

  const clearFilters = () => {
    annotationQueryState.set((prev) =>
      produce(prev, (updated) => {
        updated.filter = [];
        updated.isDefault = false;
      })
    );
  };

  const filterToLabel = {
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
    NOT_REVIEWED: 'Unreviewed',
    MANUAL: 'User Generated'
  };

  const removeFilter = ({index, value}) => {
    annotationQueryState.set((prev) =>
      produce(prev, (updated) => {
        let oldFilters = updated.filter;

        if (isArray(oldFilters[index].value)) {
          if (oldFilters[index].value.length === 1) {
            //Last element in value array. Remove the filter.
            pullAt(oldFilters, [index]);
          } //Not the last element in the filter array. Remove element from value array.
          else {
            pullAt(oldFilters[index].value, [
              indexOf(oldFilters[index].value, value)
            ]);
          }
        } //Value is not an array, remove the entire filter.
        else {
          pullAt(oldFilters, [index]);
        }

        updated.filter = oldFilters;
      })
    );
  };

  return (
    <>
      <Sort className="inline-flex flex-1 mr-2.5" />
      <Filter className="inline-flex flex-1 mb-2" />
      <SmoothCollapse expanded={filter.length > 0}>
        {showFilters ? (
          <>
            {filtersToShow.map((f, index) => {
              return (
                <div
                  key={`filters-list-${index}`}
                  className="rounded-md border-grey-300 border bg-white inline-flex items-center px-2 py-1 mr-1 mb-1 font-inter">
                  <p className="text-sm">{filterToLabel[f.value] || f.value}</p>
                  <CloseIcon
                    onClick={() => removeFilter(f)}
                    className="text-grey-400 ml-1 cursor-pointer"
                  />
                </div>
              );
            })}
          </>
        ) : (
          <>
            {filtersToShow.slice(0, 3).map((f, index) => {
              return (
                <div
                  key={`filters-list-${index}`}
                  className="rounded-md border-grey-300 bg-white border inline-flex items-center px-2 py-1 mr-1 mb-1 font-inter">
                  <p className="text-sm">{filterToLabel[f.value] || f.value}</p>
                  <CloseIcon
                    onClick={() => removeFilter(f)}
                    className="text-grey-400 ml-1 cursor-pointer"
                  />
                </div>
              );
            })}
          </>
        )}
        {filtersToShow.length > 3 && (
          <>
            {showFilters ? (
              <div
                onClick={() => setShowFilters(false)}
                className="rounded-md border-grey-300 bg-white border inline-flex items-center px-2 py-1 mr-1 text-sm cursor-pointer mb-1 font-inter">
                Hide
              </div>
            ) : (
              <div
                onClick={() => setShowFilters(true)}
                className="rounded-md border-grey-300 bg-white border inline-flex items-center px-2 py-1 mr-1 text-sm cursor-pointer mb-1 font-inter">
                +2
              </div>
            )}
          </>
        )}
        <p
          onClick={clearFilters}
          className="text-sm text-grey-500 inline-block cursor-pointer ml-1 font-inter">
          Clear Filters
        </p>
      </SmoothCollapse>
    </>
  );
};

export default AnnotationQuerier;
