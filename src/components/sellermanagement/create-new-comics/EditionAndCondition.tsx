import React, { useState } from "react";
import { Slider } from "antd";
import type { SliderSingleProps } from "antd";
import {
  ConditionGradingScale,
  conditionGradingScales,
} from "../../../common/constances/comicsConditions";

const formatGradingScaleToMarks = (
  gradingScale: ConditionGradingScale[]
): SliderSingleProps["marks"] => {
  const marks: SliderSingleProps["marks"] = {};

  gradingScale.forEach((item) => {
    marks[item.value] = {
      label: (
        <p className={`whitespace-nowrap`}>
          {item.value % 10 !== 0 ? "" : item.symbol}
        </p>
      ),
    };
  });

  return marks;
};

const getConditionInfo = (value: number) => {
  return conditionGradingScales.find((grade) => grade.value === value);
};

export default function EditionAndCondition() {
  const [conditionValue, setConditionValue] = useState<number>(50);

  return (
    <div className="flex flex-col items-stretch md:w-1/2 mx-auto gap-8">
      <Slider
        marks={formatGradingScaleToMarks(conditionGradingScales)}
        step={null}
        defaultValue={50}
        tooltip={{ open: false }}
        onChange={(value: number) => setConditionValue(value)}
      />
      <p>{getConditionInfo(conditionValue).conditionState}</p>
    </div>
  );
}
