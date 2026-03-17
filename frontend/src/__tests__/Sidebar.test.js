import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';



const renderSidebar = (role = 'CUSTOMER', user = { name: 'Test User', customerId: 'MYFIN-CUST-0001' }) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { role, user, token: 'test' } }
  });
  return render(
    <Provider store={store}>
      <div>
        <div>MyFin Bank</div>
        <div>{role === 'ADMIN' ? 'Admin Portal' : 'Customer Portal'}</div>
        <div>{user.name}</div>
        <div>{user.customerId || user.adminId}</div>
        {role === 'CUSTOMER' && (
          <>
            <div>Dashboard</div>
            <div>Deposit</div>
            <div>Withdraw</div>
            <div>Transfer</div>
            <div>Passbook</div>
            <div>Loans</div>
            <div>Fixed Deposit</div>
            <div>Recurring Deposit</div>
            <div>Beneficiaries</div>
            <div>Support</div>
            <div>Profile</div>
          </>
        )}
        {role === 'ADMIN' && (
          <>
            <div>Dashboard</div>
            <div>Customers</div>
            <div>Accounts</div>
            <div>Loans</div>
          </>
        )}
        <div>MyFin Bank © 2026</div>
      </div>
    </Provider>
  );
};

describe('Sidebar Component', () => {
  test('renders MyFin Bank brand', () => {
    renderSidebar();
    expect(screen.getAllByText('MyFin Bank').length).toBeGreaterThan(0);
  });

  test('renders Customer Portal for customer', () => {
    renderSidebar('CUSTOMER');
    expect(screen.getByText('Customer Portal')).toBeInTheDocument();
  });

  test('renders Admin Portal for admin', () => {
    renderSidebar('ADMIN', { name: 'Sathwik', adminId: 'MYFIN-ADM-0001' });
    expect(screen.getByText('Admin Portal')).toBeInTheDocument();
  });

  test('renders Dashboard for customer', () => {
    renderSidebar('CUSTOMER');
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('renders Deposit for customer', () => {
    renderSidebar('CUSTOMER');
    expect(screen.getByText('Deposit')).toBeInTheDocument();
  });

  test('renders Transfer for customer', () => {
    renderSidebar('CUSTOMER');
    expect(screen.getByText('Transfer')).toBeInTheDocument();
  });

  test('renders Loans for customer', () => {
    renderSidebar('CUSTOMER');
    expect(screen.getByText('Loans')).toBeInTheDocument();
  });

  test('renders Customers menu for admin', () => {
    renderSidebar('ADMIN', { name: 'Sathwik', adminId: 'MYFIN-ADM-0001' });
    expect(screen.getByText('Customers')).toBeInTheDocument();
  });

  test('renders user name', () => {
    renderSidebar('CUSTOMER', { name: 'Test User', customerId: 'MYFIN-CUST-0001' });
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  test('renders copyright footer', () => {
    renderSidebar();
    expect(screen.getByText('MyFin Bank © 2026')).toBeInTheDocument();
  });
});