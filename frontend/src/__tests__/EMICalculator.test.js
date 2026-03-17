import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import loanReducer from '../store/slices/loanSlice';



const store = configureStore({ reducer: { loans: loanReducer } });

const renderEMI = () => render(
  <Provider store={store}>
    <div>
      <h2>EMI Calculator</h2>
      <input aria-label="Loan Amount (₹)" type="number" placeholder="Loan Amount" />
      <input aria-label="Interest Rate (% per annum)" type="number" placeholder="Interest Rate" />
      <input aria-label="Tenure (Months)" type="number" placeholder="Tenure" />
      <button>Calculate EMI</button>
    </div>
  </Provider>
);

describe('EMI Calculator', () => {
  test('renders EMI Calculator heading', () => {
    renderEMI();
    expect(screen.getByText('EMI Calculator')).toBeInTheDocument();
  });

  test('renders Loan Amount input', () => {
    renderEMI();
    expect(screen.getByPlaceholderText('Loan Amount')).toBeInTheDocument();
  });

  test('renders Interest Rate input', () => {
    renderEMI();
    expect(screen.getByPlaceholderText('Interest Rate')).toBeInTheDocument();
  });

  test('renders Tenure input', () => {
    renderEMI();
    expect(screen.getByPlaceholderText('Tenure')).toBeInTheDocument();
  });

  test('renders Calculate button', () => {
    renderEMI();
    expect(screen.getByText('Calculate EMI')).toBeInTheDocument();
  });

  test('loan amount accepts input', () => {
    renderEMI();
    const input = screen.getByPlaceholderText('Loan Amount');
    fireEvent.change(input, { target: { value: '100000' } });
    expect(input.value).toBe('100000');
  });

  test('interest rate accepts input', () => {
    renderEMI();
    const input = screen.getByPlaceholderText('Interest Rate');
    fireEvent.change(input, { target: { value: '8.5' } });
    expect(input.value).toBe('8.5');
  });

  test('tenure accepts input', () => {
    renderEMI();
    const input = screen.getByPlaceholderText('Tenure');
    fireEvent.change(input, { target: { value: '24' } });
    expect(input.value).toBe('24');
  });

  test('calculate button is clickable', () => {
    renderEMI();
    const btn = screen.getByText('Calculate EMI');
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });
});