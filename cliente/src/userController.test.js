import request from 'supertest';
import app from './App'; // Adjust the import based on your app's entry point
import { pool } from './db'; // Adjust the import based on your database configuration

describe('User Authentication', () => {
  afterAll(async () => {
    await pool.end(); // Close the database connection after tests
  });

  it('should create a new user and hash the password', async () => {
    const response = await request(app)
      .post('/api/users/register') // Adjust the endpoint as necessary
      .send({
        user_name: 'testuser',
        user_email: 'testuser@example.com',
        user_password: 'Password123'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Usuario creado exitosamente');
    expect(response.body.user).toHaveProperty('user_id');
  });

  it('should log in the user with correct credentials', async () => {
    const response = await request(app)
      .post('/api/users/login') // Adjust the endpoint as necessary
      .send({
        email: 'testuser@example.com',
        password: 'Password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('id');
  });

  it('should not log in with incorrect password', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'WrongPassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Correo electrónico o contraseña incorrectos');
  });
});
