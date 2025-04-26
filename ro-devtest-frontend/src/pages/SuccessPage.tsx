const SuccessPage = () => {
  const token = localStorage.getItem('accessToken');

  return (
    <div>
      <h2>Login realizado com sucesso!</h2>
      <p>Token: {token}</p>
    </div>
  );
};

export default SuccessPage;
