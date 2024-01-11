import React, { useState } from "react";

const NumericStepper = ({
  value,
  minValue,
  maxValue,
  step,
  onChange,
}: {
  value: any;
  minValue: any;
  maxValue: any;
  step: any;
  onChange: any;
}) => {
  const [currentValue, setCurrentValue] = useState(value);

  const increment = () => {
    if (currentValue + step <= maxValue) {
      setCurrentValue(currentValue + step);
      onChange(currentValue + step);
    }
  };

  const decrement = () => {
    if (currentValue - step >= minValue) {
      setCurrentValue(currentValue - step);
      onChange(currentValue - step);
    }
  };

  return (
    <div className="absolute  right-10 flex justify-center items-center space-x-2">
      <button
        className=" px-3 py-1 border border-gray-400 rounded-lg hover:bg-gray-200"
        onClick={decrement}
        disabled={currentValue <= minValue}
      >
        -
      </button>
      {/* <span>{currentValue}</span> */}
      <button
        className=" px-3 py-1 border border-gray-400 rounded-lg hover:bg-gray-200"
        onClick={increment}
        disabled={currentValue >= maxValue}
      >
        +
      </button>
    </div>
  );
};

export default NumericStepper;
