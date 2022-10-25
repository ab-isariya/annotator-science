import PropTypes from 'prop-types';

const Snippet = ({
  startText,
  truncateStart,
  endText,
  truncateEnd,
  snippet,
  className
}) => {
  return (
    <span className="font-serif text-base block">
      {truncateStart && '“...'}
      {startText}
      <span className={className || 'text-blue-500'}>{snippet}</span>
      {endText}
      {truncateEnd && '...”'}
    </span>
  );
};

Snippet.propTypes = {
  //TailwindCSS
  className: PropTypes.string,
  //Beginning length of text prior to the snippet.
  startText: PropTypes.string,
  //Whether or not to render the truncate dots at the start of the snippet.
  truncateStart: PropTypes.bool,
  //Ending length of text that comes after the snippet.
  endText: PropTypes.string,
  //Whether or not to render the truncate dots at the end of the snippet.
  truncateEnd: PropTypes.bool,
  //Snippet to be rendered.
  snippet: PropTypes.string.isRequired
};

export default Snippet;
