import currency from 'currency.js';

export function getISODate() {
  return new Date().toISOString();
}

export function sum(n1: number, n2: number) {
  return currency(n1).add(n2).value;
}

export function subtract(n1: number, n2: number) {
  return currency(n1).subtract(n2).value;
}

export function multiply(n1: number, n2: number) {
  return currency(n1).multiply(n2).value;
}
