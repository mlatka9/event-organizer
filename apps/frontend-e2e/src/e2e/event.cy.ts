import { loginUser } from '../support/utils';

describe('event', () => {
  it('user cannot create event without name', () => {
    cy.visit('/');
    loginUser();
    cy.get('[data-cy="new-event-link"]').click();
    cy.get('button[type="submit"]').click();
    cy.contains('Nazwa musi miec co najmniej 6 znaków', { matchCase: false });
  });

  it('user can create and delete event', () => {
    cy.visit('/');
    loginUser();

    cy.get('[data-cy="new-event-link"]').click();
    cy.get('#nazwa').type('Nazwa wydarzenie do usunięcia');
    cy.get('#description').type('Opis wydarzenaia do usunięcia');
    cy.get('#kategoria').select('muzyka');

    cy.get('[name="street"]').type('Floriańska 10');
    cy.get('[name="city"]').type('Kraków');
    cy.get('[name="postCode"]').type('33-100');
    cy.get('[name="country"]').type('Polska');
    cy.get('[name="startDate"]').type('2023-01-20T08:30');
    cy.get('[name="endDate"]').type('2023-01-20T09:30');

    cy.get('button[type="submit"]').click();
    cy.contains('Pomyślnie dodano wydarzenie');

    // revert changes
    cy.contains('Ustawienia').click();
    cy.contains('Usuń wydarzenie').click();
    cy.get('[data-cy="confirm-delete-event-button"]').click();
    cy.contains('Pomyślnie usunięto wydarzenie');
  });
});
