import {createElement} from 'react';
import PropTypes from 'prop-types';

import {FileTypes} from '@utils/constants';

const FileTypeIcon = ({type, className}) => {
  const _type = type.replace('.', '');
  const icon = FileTypes[_type];

  if (!icon) {
    return <></>;
  }

  return createElement(FileTypes[_type], {
    className
  });
};

FileTypeIcon.propTypes = {
  //Tailwind classes
  className: PropTypes.string,
  //Filetype string
  type: PropTypes.oneOf(Object.keys(FileTypes).map(e => e.replace('.', ''))).isRequired
};

export default FileTypeIcon;
