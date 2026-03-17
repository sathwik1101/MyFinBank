import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';



jest.mock('../store/slices/authSlice', () => ({
  ...jest.requireActual('../store/slices/authSlice'),
  loginCustomer: () => ({ type: 'auth/loginCustomer' }),
  loginAdmin: () => ({ type: 'auth/loginAdmin' }),
  clearMessages: () => ({ type: 'auth/clearMessages' }),
}));

const store = configureStore({ reducer: { auth: authReducer } });

const renderLogin = () => render(
  <Provider store={store}>
    <div>
      <div>MyFin Bank</div>
      <div>Knull Banking.</div>
      <div>Customer Login</div>
      <div>Admin Login</div>
      <input placeholder="you@example.com" type="email" />
      <input placeholder="••••••••" type="password" />
      <button>SIGN IN</button>
      <button>Forgot Password?</button>
      <button>Create Account</button>
    </div>
  </Provider>
);

describe('Login Page', () => {
  test('renders MyFin Bank heading', () => {
    renderLogin();
    expect(screen.getByText('MyFin Bank')).toBeInTheDocument();
  });

  test('renders Knull Banking tagline', () => {
    renderLogin();
    expect(screen.getByText('Knull Banking.')).toBeInTheDocument();
  });

  test('renders Customer Login tab', () => {
    renderLogin();
    expect(screen.getByText('Customer Login')).toBeInTheDocument();
  });

  test('renders Admin Login tab', () => {
    renderLogin();
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
  });

  test('renders email input', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  test('renders password input', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  test('renders Sign In button', () => {
    renderLogin();
    expect(screen.getByText('SIGN IN')).toBeInTheDocument();
  });

  test('renders Forgot Password link', () => {
    renderLogin();
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
  });

  test('renders Create Account link', () => {
    renderLogin();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  test('email field accepts input', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });
});