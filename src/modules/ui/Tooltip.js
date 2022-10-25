import React from 'react';
import PropTypes from 'prop-types';

import Tippy from '@tippyjs/react';
import {followCursor} from 'tippy.js';

const Tooltip = ({children, content, size, dark, theme, ...otherProps}) => {
  //Should build out a string like 'annotate-small' or 'annotate-dark-large'.
  //NOTE(Rejon): See theme name definitions in index.css.
  const styleTheme = theme || `annotate${dark ? '-dark' : ''}-${size}`;

  //NOTE(Rejon): We use a fragment around the children so Tippy doesn't randomly
  //             complain about children not being in the type it expects. (String or Node)
  return (
    <Tippy
      plugins={[followCursor]}
      content={content}
      theme={styleTheme}
      {...otherProps}>
      <>{children}</>
    </Tippy>
  );
};

Tooltip.defaultProps = {
  size: 'medium'
};

Tooltip.propTypes = {
  //React Node child that triggers the tooltip to show
  children: PropTypes.node.isRequired,
  //Content that renders inside of the tooltip
  content: PropTypes.any.isRequired,
  //Tooltip theme size (large, medium, or small)
  //medium is default
  //NOTE(Rejon): See index.css for theme size definitions
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  //Tooltip dark theme, if this prop is on the tooltip it will use
  //an alternate dark theme defined in index.css
  dark: PropTypes.any,
  //Custom theme name incase we want to use an existing tippy theme instead.
  theme: PropTypes.string
};

export default Tooltip;
