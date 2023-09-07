import { HttpStatusCode } from "../../../../http-status-code";
import { GlobalCSSSnapShot, SignUpFormCSSSnapShot, SignUpFormSnapShot, SuccessFormCSSSnapShot } from "../../../snapshots";
import { SIGNUP_ID, SUCCESS_ID } from "../../../../sign-up-form";

const cypressHost = Cypress.env('WEB_HOST');

describe('Get sign up form', () => {
  it('Should get sign up form successfully', () => {
    cy.request("Get", cypressHost + '/sign-up-form.html').should((response) => {
      expect(response.status).equal(HttpStatusCode.OK)
      expect(response.body).equal(SignUpFormSnapShot)
    });
  })

  it('Should get style forms', () => {
    cy.request("Get", cypressHost + '/css/global.min.css').should((response) => {
      expect(response.status).equal(HttpStatusCode.OK)
      expect(response.body).equal(GlobalCSSSnapShot)
    });

    cy.request("Get", cypressHost + '/css/signup-form.min.css').should((response) => {
      expect(response.status).equal(HttpStatusCode.OK)
      expect(response.body).equal(SignUpFormCSSSnapShot)
    });

    cy.request("Get", cypressHost + '/css/success-form.min.css').should((response) => {
      expect(response.status).equal(HttpStatusCode.OK)
      expect(response.body).equal(SuccessFormCSSSnapShot)
    });
  })

  it('Should see sign up form on first visit', () => {
    cy.visit(cypressHost)
    cy.get('#' + SIGNUP_ID).should('be.visible')
    cy.get('#' + SIGNUP_ID).contains('Stay Updated!')
  })


  it('Should navigate to success form on submit', () => {
    cy.visit(cypressHost)
    cy.get('input').type('hung@gmail')
    cy.get('button').click()
    cy.get('#' + SUCCESS_ID).contains('Thanks for subscribing!')
  })
})