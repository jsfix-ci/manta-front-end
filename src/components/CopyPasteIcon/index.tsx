import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';

type ICopyPastIconProps = {
  textToCopy: string;
};

const CopyPasteIcon: React.FC<ICopyPastIconProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => copied && setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return copied ? (
    <FontAwesomeIcon icon={faCheck} />
  ) : (
    <FontAwesomeIcon
      icon={faCopy}
      className="cursor-pointer"
      onMouseDown={copyToClipboard}
    />
  );
};

export default CopyPasteIcon;
