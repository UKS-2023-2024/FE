import React from 'react';
import ProgressBar from "@ramonak/react-progress-bar";

interface CustomProgressBarProps {
  completionPercentage: number;
}

const CustomProgressBar: React.FC<CustomProgressBarProps> = ({ completionPercentage }) => {
  return (
    <ProgressBar completed={completionPercentage} bgColor='green'/>
  );
};

export default CustomProgressBar;