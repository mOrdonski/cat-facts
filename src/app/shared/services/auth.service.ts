import { Injectable } from '@angular/core';

import { accounts } from '../accounts.mock';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = false;

  authenticate(username: string, password: string): boolean {
    const user: User | undefined = accounts.find((account) => {
      return account.username === username && account.password === password;
    });

    if (!user) return false;

    this.isAuthenticated = true;
    return true;
  }
}
