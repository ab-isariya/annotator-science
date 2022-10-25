import {forwardRef} from 'react';
import PropTypes from 'prop-types';

import ReactSelect, {components} from 'react-select';

import {ReactComponent as SortNumAsc} from '@svgs/Sort_Asc_Numeric.svg';
import {ReactComponent as SortNumDesc} from '@svgs/Sort_Desc_Numeric.svg';
import {ReactComponent as SortAlphaAsc} from '@svgs/Sort_Asc_Alphabetical.svg';
import {ReactComponent as SortAlphaDesc} from '@svgs/Sort_Desc_Alphabetical.svg';

//Sorting Options used for "Expanded" Form and Filter Form
export const SORT_OPTIONS = [
  {
    label: 'Descending',
    //NOTE(Rejon): 'desc: false' may seem wrong, but it's because the initial array
    //             without sorting IS sorted. This is so we don't reverse an already
    //             correct array in the wrong direction.
    value: {key: 'count', desc: false},
    icon: <SortNumDesc />
  },
  {
    label: 'Ascending',
    //NOTE(Rejon): 'desc: true' may seem wrong, but it's because the initial array
    //             without sorting IS sorted. This is so we don't reverse an already
    //             correct array in the wrong direction.
    value: {key: 'count', desc: true},
    icon: <SortNumAsc />
  },
  {
    label: 'A to Z',
    value: {key: 'name', desc: true},
    icon: <SortAlphaDesc />
  },
  {
    label: 'Z to A',
    value: {key: 'name', desc: false},
    icon: <SortAlphaAsc />
  }
];

/**
 * Custom Sort Component
 * Located next to search bar based on Specs.
 *
 * @param {Object} props {className, onSortChange} - Tailwind classes, onChange callback
 * @param {Object} ref Ref forwarded to the select element so we can clear it properly
 */
const ConceptsWidget_Sort = forwardRef(({className, onSortChange}, ref) => {
  const Menu = (props) => (
    <components.Menu
      className=" min-w-2/5 m-0 rounded-md overflow-hidden shadow-sm w-auto right-0"
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
    const {
      isSelected,
      isDisabled,
      isFocused,
      data: {label, icon}
    } = props;

    const selectedClass = `${
      isSelected && !isDisabled && 'bg-blue-500 text-white'
    }`;
    const disabledClass = `${isDisabled && 'text-grey-300 bg-white'}`;
    const hoverClass = `${!isDisabled && 'hover:bg-grey-50 hover:text-black'}`;
    const focusClass = `focus:bg-grey-50 focus:text-black ${
      isFocused && !isSelected && 'bg-grey-50 text-black'
    }`;
    const baseClass = 'font-inter flex items-center cursor-pointer';

    const optionClass = `${baseClass} ${hoverClass} ${disabledClass} ${selectedClass} ${focusClass}`;

    return (
      <components.Option {...props} className={optionClass}>
        <div className="mr-2" style={{width: '17px', height: '17px'}}>
          {icon}
        </div>
        {label}
      </components.Option>
    );
  };

  Option.propTypes = {
    //Prop from react-select for if the option is selected or not
    isSelected: PropTypes.bool.isRequired,
    //Prop from react-select for if the option is disabled for selection or not
    isDisabled: PropTypes.bool.isRequired,
    //Prop from react-select for if the option is focused or not.
    isFocused: PropTypes.bool.isRequired,
    //Data blob containing this option's object data from SORT_OPTIONS
    data: PropTypes.object.isRequired
  };

  const ValueContainer = (props) => (
    <components.ValueContainer
      className="font-inter flex items-center justify-center text-black"
      {...props}
    />
  );

  const SingleValue = ({
    data: {icon},
    selectProps: {menuIsOpen},
    ...otherProps
  }) => {
    return (
      <components.SingleValue className="text-black" {...otherProps}>
        <div
          className={`text-grey-500 ${menuIsOpen ? 'text-blue-500' : ''}`}
          style={{width: '18px', height: '18px'}}>
          {icon}
        </div>
      </components.SingleValue>
    );
  };

  SingleValue.propTypes = {
    //Current selection's value data object (See SORT_OPTIONS above )
    data: PropTypes.object.isRequired,
    //Select component's props. See: https://react-select.com/props#select-props
    selectProps: PropTypes.object.isRequired
  };

  const Control = (props) => {
    const {isFocused} = props; //NOTE(Rejon): Need to pull this out since actual focus is on Input not Control.
    const activeClass = 'active:border-blue-500';
    const focusClass = 'focus:outline-none focus:filter-active';
    const baseClass =
      'cursor-pointer rounded-md border border-grey-500 text-sm';
    const hoverClass = 'hover:bg-grey-50';

    const controlClass = `${baseClass} ${
      isFocused && 'outline-none filter-active'
    } shadow-none flex-1 ${activeClass} ${hoverClass} ${focusClass}`;

    return (
      <div className="w-11 flex relative">
        <components.Control className={controlClass} {...props} />
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
      ref={ref}
      className={`${className}`}
      blurInputOnSelect={true}
      isSearchable={false}
      onChange={onSortChange}
      options={SORT_OPTIONS}
      isOptionDisabled={(option) => option.disabled}
      defaultValue={SORT_OPTIONS[0]}
    />
  );
});

ConceptsWidget_Sort.propTypes = {
  //TailwindCSS Classes
  className: PropTypes.string,
  //Callback method applied to "onChange" on react-select
  onSortChange: PropTypes.func.isRequired
};

export default ConceptsWidget_Sort;
