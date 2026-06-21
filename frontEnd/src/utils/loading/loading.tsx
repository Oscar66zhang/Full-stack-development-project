import { Spin } from 'antd';

export const Loading = () => {
  return (
    <Spin description="Loading" size="large" className="request-loading" />
  );
};
