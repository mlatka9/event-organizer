import { loginUser } from '../support/utils';

describe('auth', () => {
  beforeEach(() => cy.visit('/'));

  it('show login validation errors when passed wrong data', () => {
    cy.get('[data-cy="logo"]').click();
    cy.get('[data-cy="hamburger"]').click();
    cy.get('[data-cy="login-button"]').click();

    cy.get('[data-cy="submit"]').click();

    cy.contains('Wprowadz poprawny adres email');
    cy.contains('Hasło musi miec co najmniej 6 znaków');

    cy.get('#email').type('invalidEmail');
    cy.contains('Wprowadz poprawny adres email');

    cy.get('#email').type('wrong@email.com');
    cy.get('#hasło').type('wrongpassword123');

    cy.get('[data-cy="submit"]').click();

    cy.contains('Niepoprawny email lub hasło');
  });

  it('login when provided valid data', () => {
    loginUser();
    cy.get('[data-cy="events-page-header"]');
    cy.get('[data-cy="hamburger"]').click();
    cy.contains('test123');
  });

  it('logout user', () => {
    loginUser();

    cy.get('[data-cy="events-page-header"]');
    cy.get('[data-cy="hamburger"]').click();
    cy.get('[data-cy="settings-button"]').click();
    cy.get('[data-cy="login-button"]').should('not.exist');
    cy.get('[data-cy="logout-button"]').click();
    cy.get('[data-cy="login-button"]');
  });
});
