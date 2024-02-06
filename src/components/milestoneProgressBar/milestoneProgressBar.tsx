import React from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import { useGetMilestoneCompletionPercentage } from '../../api/query/milestone/useGetMilestoneCompletionPercentage';

interface CustomProgressBarProps {
  milestoneId: string
}

const MilestoneProgressBar: React.FC<CustomProgressBarProps> = ({milestoneId }) => {
  const { data: completionPercentage } = useGetMilestoneCompletionPercentage(
    milestoneId ?? ''
  );

  return (
    <ProgressBar completed={completionPercentage} bgColor='green'/>
  );
};

export default MilestoneProgressBar;