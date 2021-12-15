import React from 'react';
import PropTypes from 'prop-types';

const BlockSvg = ({ className, fill }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className={className} fill={fill}>
      <path d="M6.10002 8.6999C6.10002 7.26396 7.26408 6.0999 8.70002 6.0999H16.5C17.936 6.0999 19.1 7.26396 19.1 8.6999V16.4999C19.1 17.9358 17.936 19.0999 16.5 19.0999H8.70002C7.26408 19.0999 6.10002 17.9358 6.10002 16.4999V8.6999Z" />
      <path d="M3.50002 0.899902C2.06408 0.899902 0.900024 2.06396 0.900024 3.4999V11.2999C0.900024 12.7358 2.06408 13.8999 3.50002 13.8999L3.50002 3.4999H13.9C13.9 2.06396 12.736 0.899902 11.3 0.899902H3.50002Z" />
    </svg>
  );
};

BlockSvg.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
};

export default BlockSvg;