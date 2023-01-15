const loginUser = (email = 'test@test.pl', password = 'test123') => {
  cy.get('[data-cy="logo"]').click();
  cy.get('[data-cy="hamburger"]').click();
  cy.get('[data-cy="login-button"]').click();
  cy.get('[data-cy="submit"]').click();
  cy.get('#email').type(email);
  cy.get('#hasło').type(password);
  cy.get('[data-cy="submit"]').click();
};

const logoutUser = () => {
  cy.visit('/events');
  cy.get('[data-cy="hamburger"]').click();
  cy.get('[data-cy="settings-button"]').click();
  cy.contains('Wyloguj').click();
};

export { loginUser, logoutUser };
