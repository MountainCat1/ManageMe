export interface Account {
  id: string;
  username: string;
  name: string;
  surname: string;
  role: AccountRole;
}

export enum AccountRole {
  DevOps = 'DevOps',
  Developer = 'Developer',
  Admin = 'Admin'
}

declare global {
  interface Account {
    getDisplayName(): string;
  }
}

export function getDisplayName(account: Account): string {
  return `${account.name} ${account.surname} (${account.username})`;
}
