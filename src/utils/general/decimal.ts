// @ts-nocheck
import Decimal from 'decimal.js';

const decimalToUsdString = (value) => {
  return `$${value
    .toDecimalPlaces(2, Decimal.ROUND_DOWN)
    .toNumber()
    .toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })}`;
};

export default decimalToUsdString;
