import { HttpStatusCode } from "../../../../http-status-code";
import { SignUpFormSnapShot } from "../../../sign-up-form-snapshot";
import { ROOT_ID } from "../../../../get-sign-up-form";

const cypressHost = Cypress.env('WEB_HOST');

describe('Get sign up form', () => {
  it('Should get sign up form successfully', () => {
    cy.request("Get", cypressHost + '/sign-up-form.html').should((response) => {
      expect(response.status).equal(HttpStatusCode.OK)
      expect(response.body).equal(SignUpFormSnapShot)
    });
  })

  it('Should see sign up form on first visit', () => {
    cy.visit(cypressHost)
    cy.get('#' + ROOT_ID).should('be.visible')
    cy.get('#' + ROOT_ID).contains('Stay Updated!')
  })
})