const loginUser = () => {
  cy.get('[data-cy="logo"]').click();
  cy.get('[data-cy="hamburger"]').click();
  cy.get('[data-cy="login-button"]').click();
  cy.get('[data-cy="submit"]').click();
  cy.get('#email').type('test@test.pl');
  cy.get('#hasło').type('test123');
  cy.get('[data-cy="submit"]').click();
};

export { loginUser };
