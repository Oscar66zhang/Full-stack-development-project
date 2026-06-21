import React from 'react';
import { Spin } from 'antd';

interface LoadingProps {
  size?: 'small' | 'default' | 'large';
  wrapperClassName?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'default',
  wrapperClassName = '',
}) => {
  return (
    <div
      className={`flex justify-center items-center w-full h-full min-h-[200px] ${wrapperClassName}`}
    >
      <Spin size={size} />
    </div>
  );
};

export default Loading;
