import request from 'supertest';
import app from '../server/index'; // Adjusted import to the correct path



import { query } from '../db'; // Adjust the import based on your db file location



describe('User Authentication', () => {
  // Mock the database query
  jest.mock('../db', () => ({
    query: jest.fn(),
  }));

  afterAll(async () => {
    // Remove the actual database connection test

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

  it('should not register with an existing email', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        user_name: 'existinguser',
        user_email: 'testuser@example.com', // Existing email
        user_password: 'Password123'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Email already exists');
  });

  it('should not create a user with invalid data', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        user_name: '', // Invalid name
        user_email: 'invalidemail', // Invalid email
        user_password: '123' // Invalid password
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid input data');
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

  it('should not log in with unregistered email', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'unregistered@example.com', // Unregistered email
        password: 'Password123'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Correo electrónico o contraseña incorrectos');
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
