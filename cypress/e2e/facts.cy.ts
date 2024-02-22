const login = () => {
  const username = 'admin';
  const password = 'admin123';

  cy.get('[data-cy=login-input]').type(username);
  cy.get('[data-cy=password-input]').type(password, { force: true });
  cy.get('[data-cy=login-button]').click();
};

describe('FactsComponent', () => {
  beforeEach(() => {
    cy.visit('/login');
    login();
  });

  it('should display initial facts on load', () => {
    cy.get('[data-cy=viewport]').should('exist');
    cy.get('[data-cy=item]').should('have.length.gt', 0);
  });

  it('should load more facts when scrolling', () => {
    cy.get('[data-cy=viewport]').scrollTo('bottom');
    cy.get('[data-cy=spinner]').should('be.visible');
    cy.get('[data-cy=item]').should('have.length.gt', 3);
  });
});
