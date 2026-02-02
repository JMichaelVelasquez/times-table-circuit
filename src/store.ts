import type { UserAccount, Mode } from './types';

const ACCOUNTS_KEY = 'ttc_accounts';
const SESSION_KEY = 'ttc_session';

function getAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: UserAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

// Simple hash for password (not cryptographic - just for localStorage demo)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_ttc_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function signIn(
  username: string,
  password: string,
  mode: Mode
): Promise<{ success: boolean; isNew: boolean; error?: string }> {
  const accounts = getAccounts();
  const existing = accounts.find(
    a => a.username.toLowerCase() === username.toLowerCase() && a.mode === mode
  );
  const hash = await hashPassword(password);

  if (existing) {
    if (existing.passwordHash === hash) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ username: existing.username, mode }));
      return { success: true, isNew: false };
    }
    return { success: false, isNew: false, error: 'Wrong password! Try again ⚡' };
  }

  // Create new account
  const newAccount: UserAccount = {
    username,
    passwordHash: hash,
    mode,
    createdAt: Date.now(),
  };
  accounts.push(newAccount);
  saveAccounts(accounts);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username, mode }));
  return { success: true, isNew: true };
}

export function getSession(): { username: string; mode: Mode } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function signOut(): void {
  localStorage.removeItem(SESSION_KEY);
}
