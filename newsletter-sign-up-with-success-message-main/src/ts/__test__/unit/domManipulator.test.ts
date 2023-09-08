/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach } from '@jest/globals';
import { SignUpFormSnapShot, SuccessFormSnapShot, getSignUpFormDom, getSuccessFormDom } from '../snapshots';
import { HttpStatusCode, SIGNUP_ID, SUCCESS_ID } from '../../constants';
import { DomManipulator, initialize, preventDefault } from '../../domManipulator';
import 'isomorphic-fetch'

describe("Sign up form", () => {
    let sut: DomManipulator

    beforeEach(() => {
        document.body.innerHTML = ''
        sut = getSut(document)
    })

    it("Should run in jsdom environment", () => {
        expect(document).toBeTruthy()
    })

    it("Should assign sign up form to body successfully", () => {
        // Act
        sut.setSignUpForm()
        // Assert
        expect(document.body).toEqual(getSignUpFormDom().body);
        expect(SIGNUP_ID).toEqual((document.body.firstChild as HTMLDivElement).id);
    })

    it("Should get submit form successfully", () => {
        // Act
        sut.setSignUpForm()
        // Assert
        expect(document.getElementById(SIGNUP_ID)).toEqual(getSignUpFormDom().body.firstChild)
    })

    it("Should get success form successfully", () => {
        // Act
        sut.setSuccessForm()
        // Assert
        expect(document.getElementById(SUCCESS_ID)).toEqual(getSuccessFormDom().body.firstChild)
    })

    it("Should submit form on button click", () => {
        //Arrange
        sut.setSignUpForm()
        const submitForm = document.getElementById(SIGNUP_ID) as HTMLFormElement
        let formSubmitted = false
        // Act
        submitForm.addEventListener("submit", () => { formSubmitted = true })
        submitForm.getElementsByTagName("input")[0].value = 'hung@gmail.com'
        submitForm.getElementsByTagName("button")[0].click()
        // Assert
        expect(formSubmitted).toBeTruthy()
    })

    it("Should validate form on submit", () => {
        //Arrange
        sut.setSignUpForm()
        const submitForm = document.getElementById(SIGNUP_ID) as HTMLFormElement
        let formSubmitted = false
        // Act
        submitForm.addEventListener("submit", () => { formSubmitted = true })
        submitForm.getElementsByTagName("button")[0].click()
        // Assert
        expect(formSubmitted).toBeFalsy()
    })

    it("Should update to success view on submit", async () => {
        // Arrange
        sut.setSignUpForm()
        const signUpElement = document.getElementById(SIGNUP_ID) as HTMLFormElement
        sut.wireUpSignUpFormSubmitEvent(signUpElement)
        // Act
        signUpElement.getElementsByTagName("input")[0].value = 'hung@gmail.com'
        signUpElement.getElementsByTagName("button")[0].click()
        // Assert
        expect(document.getElementById(SUCCESS_ID)).toBeTruthy()
    })

    it("Should comeback to submit view on returning", () => {
        // Arrange
        sut.setSuccessForm()
        const successElementButton = document.getElementById(SUCCESS_ID)!.getElementsByTagName("button")[0]
        sut.wireUpSuccessClickEvent(successElementButton)
        // Act
        successElementButton.click()
        // Assert
        expect(document.getElementById(SIGNUP_ID)).toEqual(getSignUpFormDom().body.firstChild)
    })

    it("Should navigate back and forth between views", async () => {
        initialize(getAllFormFetchMock(), document)
        await new Promise(process.nextTick);
        const submitForm = document.getElementById(SIGNUP_ID) as HTMLFormElement

        submitForm.getElementsByTagName("input")[0].value = 'hung@gmail.com'
        submitForm.getElementsByTagName("button")[0].click()

        expect(document.getElementById(SUCCESS_ID)).toBeTruthy()
        const successForm = document.getElementById(SUCCESS_ID) as HTMLElement
        successForm.getElementsByTagName("button")[0].click()
        expect(document.getElementById(SIGNUP_ID)).toBeTruthy()

        const submitForm2 = document.getElementById(SIGNUP_ID) as HTMLFormElement

        submitForm2.getElementsByTagName("input")[0].value = 'hung@gmail.com'
        submitForm2.getElementsByTagName("button")[0].click()
        expect(document.getElementById(SUCCESS_ID)).toBeTruthy()
    })

    it("Should bring submitted email over to success view", async () => {
        initialize(getAllFormFetchMock(), document)
        await new Promise(process.nextTick);
        const submitForm = document.getElementById(SIGNUP_ID) as HTMLFormElement
        const expectedEmail = 'hung@gmail.com'
        submitForm.getElementsByTagName("input")[0].value = expectedEmail
        submitForm.getElementsByTagName("button")[0].click()

        expect(document.getElementById(SUCCESS_ID)).toBeTruthy()
        const successForm = document.getElementById(SUCCESS_ID) as HTMLElement
        expect(successForm.querySelector('span[name="sign-up-form--email"]')).toBeTruthy()
        const successFormEmail = successForm.querySelector('span[name="sign-up-form--email"]') as HTMLSpanElement
        expect(successFormEmail.textContent).toBe(expectedEmail)
    })

    it("Should prevent default event from happening", () => {
        let prevented = false
        const submitEvent = {
            preventDefault: () => { prevented = true }
        }
        preventDefault(submitEvent)
        expect(prevented).toBeTruthy()
    })


    function getSut(document: Document) {
        return new DomManipulator({ signUp: SignUpFormSnapShot, success: SuccessFormSnapShot }, document);
    }

    function getAllFormFetchMock() {
        return (input: RequestInfo | URL) => {
            if (input == 'success-form.html') {
                const OkResponse = new Response(SuccessFormSnapShot, { status: HttpStatusCode.OK });
                return Promise.resolve(OkResponse);
            }
            if (input == 'sign-up-form.html') {
                const OkResponse = new Response(SignUpFormSnapShot, { status: HttpStatusCode.OK });
                return Promise.resolve(OkResponse);
            }
            const BadResponse = new Response("", { status: HttpStatusCode.NOT_FOUND });
            return Promise.resolve(BadResponse);
        };
    }
})


