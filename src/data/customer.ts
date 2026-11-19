export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** Builds checkout data; each test can override only the fields it cares about. */
export function aCustomer(overrides: Partial<Customer> = {}): Customer {
  const suffix = Date.now().toString().slice(-5);
  return {
    firstName: `Test${suffix}`,
    lastName: 'Automation',
    postalCode: '06510',
    ...overrides,
  };
}
