import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();
  const handleClisk = () => {
    navigate('/');
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={handleClisk}>
          Back Home
        </Button>
      }
    />
  );
}

export default NotFound;
