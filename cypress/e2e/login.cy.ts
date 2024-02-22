describe('Login Form', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('[data-cy=login-form]').should('exist');
    cy.get('[data-cy=login-input]').should('exist');
    cy.get('[data-cy=password-input]').should('exist');
    cy.get('[data-cy=login-button]').should('exist');
  });

  it('should log in with valid credentials', () => {
    const username = 'admin';
    const password = 'admin123';

    cy.get('[data-cy=login-input]').type(username);
    cy.get('[data-cy=password-input]').type(password, { force: true });
    cy.get('[data-cy=login-button]').click();

    cy.url().should('contain', '/facts');
  });

  it('should display error for invalid credentials', () => {
    const invalidUsername = 'invalid_username';
    const invalidPassword = 'invalid_password';

    cy.get('[data-cy=login-input]').type(invalidUsername);
    cy.get('[data-cy=password-input]').type(invalidPassword, { force: true });
    cy.get('[data-cy=login-button]').click();

    cy.get('[data-cy=error]').should('contain', 'Wrong credentials!');
  });
});
