import { loginUser } from '../support/utils';

describe('profile', () => {
  beforeEach(() => cy.visit('/'));

  it('show login validation errors when passed wrong data', () => {
    loginUser();
    cy.get('[data-cy="hamburger"]').click();
    cy.get('[data-cy="settings-button"]').click();
    cy.get('[data-cy="profile-button"]').click();
    cy.get('newusername123').should('not.exist');
    cy.get('[data-cy="edit-profile-button"]').click();
    cy.get('#name').clear().type('newusername123');
    cy.get('[data-cy="submit-button"]').click();
    cy.contains('newusername123');

    //revert changes
    cy.get('[data-cy="edit-profile-button"]').click();
    cy.get('#name').clear().type('test123');
    cy.get('[data-cy="submit-button"]').click();
  });
});
