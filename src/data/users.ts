/** Demo users published on the SauceDemo login page. Override with env variables in CI if needed. */
const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password: PASSWORD },
  locked: { username: 'locked_out_user', password: PASSWORD },
} as const;

export type UserKey = keyof typeof users;
