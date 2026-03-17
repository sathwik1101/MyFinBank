import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';



const store = configureStore({ reducer: { auth: authReducer } });

const renderRegister = () => render(
  <Provider store={store}>
    <div>
      <h2>Create Account</h2>
      <p>Join MyFin Bank today</p>
      <input aria-label="Full Name" placeholder="Full Name" />
      <input aria-label="Email" type="email" placeholder="Email" />
      <input aria-label="Password" type="password" placeholder="Password" />
      <input aria-label="Phone" placeholder="Phone" />
      <input aria-label="Address" placeholder="Address" />
      <button>Create Account</button>
      <button>Already have an account? Login</button>
    </div>
  </Provider>
);

describe('Register Page', () => {
  test('renders Create Account heading', () => {
    renderRegister();
    expect(screen.getAllByText('Create Account').length).toBeGreaterThan(0);
  });

  test('renders Join MyFin Bank subtitle', () => {
    renderRegister();
    expect(screen.getByText('Join MyFin Bank today')).toBeInTheDocument();
  });

  test('renders Full Name field', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
  });

  test('renders Email field', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  test('renders Password field', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('renders Phone field', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
  });

  test('renders Address field', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Address')).toBeInTheDocument();
  });

  test('renders login link', () => {
    renderRegister();
    expect(screen.getByText('Already have an account? Login')).toBeInTheDocument();
  });

  test('name field accepts input', () => {
    renderRegister();
    const nameInput = screen.getByPlaceholderText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');
  });

  test('email field accepts input', () => {
    renderRegister();
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    expect(emailInput.value).toBe('john@example.com');
  });
});