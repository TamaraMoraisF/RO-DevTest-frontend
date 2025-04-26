import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      navigate('/login'); 
    }
  }, [navigate]);

  return (
    <div>
      <h1>Success!</h1>
      <p>You have successfully logged in.</p>
    </div>
  );
}

export default SuccessPage;