import {Children, cloneElement} from 'react';
import PropTypes from 'prop-types';

import Tippy, {useSingleton} from '@tippyjs/react';

//NOTE(Rejon): This component mimic's Tippy's Singleton example: https://github.com/atomiks/tippyjs/blob/master/website/src/components/examples/Singleton.js
const TooltipGroup = ({children, delay, size, dark, theme, transition}) => {
  const [source, target] = useSingleton();

  let initialDelay = delay || 500;
  const tooltipDelay = transition ? [100, initialDelay] : initialDelay;

  //Should build out a string like 'annotate-small' or 'annotate-dark-large'.
  //NOTE(Rejon): See theme name definitions in index.css.
  //NOTE(Rejon): We have to apply style here as well because our singleton Tippy instance won't render
  //				our styles if we don't provide them to the top level parent tooltip.
  const styleTheme = theme || `annotate${dark ? '-dark' : ''}-${size}`;

  return (
    <>
      <Tippy
        singleton={source}
        delay={tooltipDelay}
        theme={styleTheme}
        moveTransition={
          transition ? 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)' : ''
        }
      />
      {Children.map(children, (child) =>
        cloneElement(child, {singleton: target})
      )}
    </>
  );
};

TooltipGroup.defaultProps = {
  size: 'medium'
};

TooltipGroup.propTypes = {
  //Children/Targets of the TooltipGroup
  children: PropTypes.node.isRequired,
  //Millisecond delay of the tooltip leaving after moving our mouse away
  delay: PropTypes.number,
  //If the tooltips should animate between positions or not.
  transition: PropTypes.bool,
  //Tooltip theme size (large, medium, or small)
  //medium is default
  //NOTE(Rejon): See index.css for theme size definitions
  size: PropTypes.oneOf(['medium', 'small', 'large']),
  //Tooltip dark theme, if this prop is on the tooltip it will use
  //an alternate dark theme defined in index.css
  dark: PropTypes.any,
  //Custom theme name incase we want to use an existing tippy theme instead.
  theme: PropTypes.string
};

export default TooltipGroup;
