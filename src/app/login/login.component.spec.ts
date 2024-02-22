import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['authenticate']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty username and password', () => {
    expect(component.form.get('username')?.value).toEqual('');
    expect(component.form.get('password')?.value).toEqual('');
  });

  it('should call authenticate method of authService and navigate to /facts if authentication succeeds', () => {
    const username = 'testuser';
    const password = 'testpassword';

    authService.authenticate.and.returnValue(true);

    component.logIn({ username, password });

    expect(authService.authenticate).toHaveBeenCalledWith(username, password);
    expect(router.navigate).toHaveBeenCalledWith(['/facts']);
  });

  it('should set invalidCredentials error if authentication fails', () => {
    const username = 'testuser';
    const password = 'testpassword';

    authService.authenticate.and.returnValue(false);

    component.logIn({ username, password });

    expect(authService.authenticate).toHaveBeenCalledWith(username, password);
    expect(component.form.hasError('invalidCredentials')).toBeTruthy();
  });

  it('should authenticate with correct username and password and navigate to /facts', () => {
    const username = 'admin';
    const password = 'admin123';

    authService.authenticate.and.returnValue(true);

    component.logIn({ username, password });

    expect(authService.authenticate).toHaveBeenCalledWith(username, password);
    expect(router.navigate).toHaveBeenCalledWith(['/facts']);
  });
});
