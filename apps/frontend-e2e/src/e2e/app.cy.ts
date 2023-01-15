describe('auth', () => {
  beforeEach(() => cy.visit('/'));

  it('should display landing page', () => {
    cy.get('h1').contains('consectetur adipiscing');
  });
});
