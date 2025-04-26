import { useState } from 'react';
import { createUser, CreateUserRequest } from '../api/user';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const CreateUserPage = () => {
  const [form, setForm] = useState<CreateUserRequest>({
    userName: '',
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    role: 1,
  });
  const [errorMessages, setErrorMessages] = useState<string[]>([]); // Agora é um array de erros
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'role') {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);
    setSuccessMessage(null);

    try {
      const result = await createUser(form);
      setSuccessMessage(`User ${result.userName} successfully created!`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErrors = error.response.data?.Errors;
        if (Array.isArray(apiErrors) && apiErrors.length > 0) {
          setErrorMessages(apiErrors);
        } else {
          setErrorMessages(['An unexpected error occurred.']);
        }
      } else {
        console.error('Error creating user:', error);
        setErrorMessages(['Failed to create user.']);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create User</h2>

      {successMessage && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          {successMessage}
        </div>
      )}

      {errorMessages.length > 0 && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <ul style={{ paddingLeft: '20px' }}>
            {errorMessages.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <input name="userName" placeholder="Username" value={form.userName} onChange={handleChange} />
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
      <input type="password" name="passwordConfirmation" placeholder="Confirm Password" value={form.passwordConfirmation} onChange={handleChange} />
      
      <select name="role" value={form.role} onChange={handleChange}>
        <option value={0}>Admin</option>
        <option value={1}>Customer</option>
      </select>

      <button type="submit">Register</button>

      <div style={{ marginTop: '16px' }}>
        <Link to="/login">
          <button type="button">Back to Login</button>
        </Link>
      </div>
    </form>
  );
};
