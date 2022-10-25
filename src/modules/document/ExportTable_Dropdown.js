import {forwardRef} from 'react';
import PropTypes from 'prop-types';

import ReactSelect, {components} from 'react-select';
import {DocumentExportTypes} from '@utils/constants';

import {ReactComponent as Chevron} from '@assets/svgs/Chevron.svg';

//Sorting Options used for "Expanded" Form and Filter Form
export const EXPORT_OPTIONS = [
  {
    label: DocumentExportTypes.CSV,
    value: DocumentExportTypes.CSV
  },
  {
    label: DocumentExportTypes.TSV,
    value: DocumentExportTypes.TSV
  },
  {
    label: DocumentExportTypes.XLSX,
    value: DocumentExportTypes.XLSX
  }
];

/**
 * Custom Sort Component
 * Located next to search bar based on Specs.
 *
 * @param {Object} props {className, onExportChange} - Tailwind classes, onChange callback
 * @param {Object} ref Ref forwarded to the select element so we can clear it properly
 */
const ExportTable_Dropdown = forwardRef(({className, onExportChange}, ref) => {
  const Menu = (props) => (
    <components.Menu
      className=" m-0 rounded-md overflow-hidden shadow-sm w-full right-0"
      style={{minWidth: '100px'}}
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
      data: {label}
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
    //Data blob containing this option's object data from EXPORT_OPTIONS
    data: PropTypes.object.isRequired
  };

  const ValueContainer = (props) => (
    <components.ValueContainer
      className="font-inter flex items-center justify-center text-black"
      {...props}
    />
  );

  const SingleValue = ({children, ...otherProps}) => {
    return (
      <components.SingleValue
        className="text-black relative transform-none max-w-none text-base font-medium flex mx-0 overflow-visible items-center pr-px"
        style={{maxWidth: 'unset', top: 'unset', transform: 'unset'}}
        {...otherProps}>
        {children}
        <Chevron className="ml-3 transform -rotate-90 text-grey-500" />
      </components.SingleValue>
    );
  };

  SingleValue.propTypes = {
    //Current selection's value data object (See EXPORT_OPTIONS above )
    data: PropTypes.object.isRequired,
    //Select component's props. See: https://react-select.com/props#select-props
    selectProps: PropTypes.object.isRequired,
    //Node children
    children: PropTypes.node
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
      <div className="w-full h-full flex relative">
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
      className={`mr-2 ${className}`}
      blurInputOnSelect={true}
      isSearchable={false}
      onChange={onExportChange}
      options={EXPORT_OPTIONS}
      isOptionDisabled={(option) => option.disabled}
      defaultValue={EXPORT_OPTIONS[0]}
    />
  );
});

ExportTable_Dropdown.propTypes = {
  //TailwindCSS Classes
  className: PropTypes.string,
  //Callback method applied to "onChange" on react-select
  onExportChange: PropTypes.func.isRequired
};

export default ExportTable_Dropdown;
