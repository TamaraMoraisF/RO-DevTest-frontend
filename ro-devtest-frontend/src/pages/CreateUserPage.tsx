import { useState } from 'react';
import { createUser, CreateUserRequest } from '../api/user';
import { Link } from 'react-router-dom';

export const CreateUserPage = () => {
  const [form, setForm] = useState<CreateUserRequest>({
    userName: '',
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    role: 1,
  });

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
    try {
      const result = await createUser(form);
      alert(`User ${result.userName} successfully created!`);
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create User</h2>
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
