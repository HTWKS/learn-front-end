const cypressHost = Cypress.env('WEB_HOST');

describe('Get sign up form', () => {
  it('Should get sign up form successfully', () => {
    cy.request("Get", cypressHost + '/sign-up-form.html');
  })
})