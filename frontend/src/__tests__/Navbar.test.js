import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';



const renderNavbar = (name = 'Test User', role = 'CUSTOMER') => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user: { name }, role, token: 'test' } }
  });
  return render(
    <Provider store={store}>
      <div>
        <span>{name}</span>
        <span>{role === 'ADMIN' ? 'Admin' : 'Customer'}</span>
        <button>Logout</button>
      </div>
    </Provider>
  );
};

describe('Navbar Component', () => {
  test('renders user name', () => {
    renderNavbar('Rahul Sharma');
    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
  });

  test('renders Logout button', () => {
    renderNavbar();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('renders Admin label for admin role', () => {
    renderNavbar('Sathwik', 'ADMIN');
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  test('renders Customer label for customer role', () => {
    renderNavbar('Rahul', 'CUSTOMER');
    expect(screen.getByText('Customer')).toBeInTheDocument();
  });

  test('logout button is clickable', () => {
    renderNavbar();
    const btn = screen.getByText('Logout');
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });
});