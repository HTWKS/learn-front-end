/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach } from '@jest/globals';
import { SignUpFormSnapShot, SuccessFormSnapShot } from '../snapshots';
import { HttpStatusCode } from '../../http-status-code';
import 'isomorphic-fetch'
import { getSignUpFormAsync, getRootElement, setToBody, ROOT_ID } from '../../get-sign-up-form';

describe("Sign up form", () => {

    beforeEach(() => {
        document.body.innerHTML = ''
    })

    it("Should run in jsdom environment", () => {
        expect(document).toBeTruthy()
    })

    it("Should get sign up form successfully", async () => {
        // Act
        const actual = await getSignUpFormAsync(getFetchMock())
        // Assert
        expect(actual).toEqual(SignUpFormSnapShot)
    })

    it("Should handle api call fail gracefully", async () => {
        // Act
        const actual = await getSignUpFormAsync(getNotFoundFetchMock())
        // Assert
        expect(actual).toEqual('')
    })

    it("Should assign sign up form to body successfully", () => {
        // Arrange
        const signUpFormDom = getSignUpFormDom();
        // Act
        setToBody(document, SignUpFormSnapShot)
        // Assert
        expect(document.body).toEqual(signUpFormDom.body);
        expect('sign-up-form').toEqual((document.body.firstChild as HTMLDivElement).id);
    })

    it("Should get submit form successfully", () => {
        // Act
        setToBody(document, SignUpFormSnapShot)
        // Assert
        expect(getRootElement(document)).toEqual(getSignUpFormDom().body.firstChild)
    })

    it("Should submit form on button click", () => {
        //Arrange
        setToBody(document, SignUpFormSnapShot)
        const submitForm = getRootElement(document)
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
        setToBody(document, SignUpFormSnapShot)
        const submitForm = getRootElement(document)
        let formSubmitted = false
        // Act
        submitForm.addEventListener("submit", () => { formSubmitted = true })
        submitForm.getElementsByTagName("button")[0].click()
        // Assert
        expect(formSubmitted).toBeFalsy()
    })

    it("Should update to success view on submit", () => {
        // Arrange
        setToBody(document, SignUpFormSnapShot)
        const rootElement = getRootElement(document)
        // Act
        rootElement.getElementsByTagName("input")[0].value = 'hung@gmail.com'
        rootElement.getElementsByTagName("button")[0].click()
        // Assert
        expect(rootElement).toEqual(getSuccessFormDom().body.firstChild)
    })

    function getFetchMock() {
        return (input: RequestInfo | URL) => {
            if (input == 'sign-up-form.html') {
                const OkResponse = new Response(SignUpFormSnapShot, { status: HttpStatusCode.OK });
                return Promise.resolve(OkResponse);
            }
            const BadResponse = new Response("", { status: HttpStatusCode.NOT_FOUND });
            return Promise.resolve(BadResponse);
        };
    }

    function getNotFoundFetchMock() {
        return () => {
            const BadResponse = new Response("Not Good", { status: HttpStatusCode.NOT_FOUND });
            return Promise.resolve(BadResponse);
        };
    }

    function getSignUpFormDom() {
        const parser = new DOMParser();
        const signUpFormDom = parser.parseFromString(SignUpFormSnapShot, 'text/html');
        (signUpFormDom.body.firstChild as HTMLElement).id = ROOT_ID;
        return signUpFormDom;
    }

    function getSuccessFormDom() {
        const parser = new DOMParser();
        const successFormDom = parser.parseFromString(SuccessFormSnapShot, 'text/html');
        (successFormDom.body.firstChild as HTMLElement).id = ROOT_ID;
        return successFormDom;
    }
})


