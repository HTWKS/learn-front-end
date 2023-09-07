/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach } from '@jest/globals';
import { SignUpFormSnapShot, SuccessFormSnapShot } from '../snapshots';
import { HttpStatusCode } from '../../http-status-code';
import 'isomorphic-fetch'
import { getSignUpFormAsync, setBody, getSuccessFormAsync, removeCaches, wireUpSignUpFormSubmitEvent, SIGNUP_ID, SUCCESS_ID, wireUpSuccessClickEvent, initialize, signUpFormElementSubmitEventHandler } from '../../sign-up-form';

describe("Sign up form", () => {

    beforeEach(() => {
        document.body.innerHTML = ''
        removeCaches()
    })

    it("Should run in jsdom environment", () => {
        expect(document).toBeTruthy()
    })

    it("Should get sign up form successfully", async () => {
        // Act
        const actual = await getSignUpFormAsync(getSignUpFormFetchMock())
        // Assert
        expect(actual).toEqual(SignUpFormSnapShot)
    })

    it("Should cache sign up form", async () => {
        // Act
        await getSignUpFormAsync(getSignUpFormFetchMock())
        const actual = await getSignUpFormAsync(getNotFoundFetchMock())
        // Assert
        expect(actual).toEqual(SignUpFormSnapShot)
    })

    it("Should handle api call fail gracefully", async () => {
        // Act
        const actual = await getSignUpFormAsync(getNotFoundFetchMock())
        // Assert
        expect(actual).toEqual('')
    })

    it("Should get success form successfully", async () => {
        // Act
        const actual = await getSuccessFormAsync(getSuccessFormFetchMock())
        // Assert
        expect(actual).toEqual(SuccessFormSnapShot)

    })

    it("Should cache success form", async () => {
        // Act
        await getSuccessFormAsync(getSuccessFormFetchMock())
        const actual = await getSuccessFormAsync(getNotFoundFetchMock())
        // Assert
        expect(actual).toEqual(SuccessFormSnapShot)
    })

    it("Should assign sign up form to body successfully", () => {
        // Arrange
        const signUpFormDom = getSignUpFormDom();
        // Act
        setBody(document, SignUpFormSnapShot, SIGNUP_ID)
        // Assert
        expect(document.body).toEqual(signUpFormDom.body);
        expect(SIGNUP_ID).toEqual((document.body.firstChild as HTMLDivElement).id);
    })

    it("Should get submit form successfully", () => {
        // Act
        setBody(document, SignUpFormSnapShot, SIGNUP_ID)
        // Assert
        expect(document.getElementById(SIGNUP_ID)).toEqual(getSignUpFormDom().body.firstChild)
    })

    it("Should get success form successfully", () => {
        // Act
        setBody(document, SuccessFormSnapShot, SUCCESS_ID)
        // Assert
        expect(document.getElementById(SUCCESS_ID)).toEqual(getSuccessFormDom().body.firstChild)
    })

    it("Should submit form on button click", () => {
        //Arrange
        setBody(document, SignUpFormSnapShot, SIGNUP_ID)
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
        setBody(document, SignUpFormSnapShot, SIGNUP_ID)
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
        setBody(document, SignUpFormSnapShot, SIGNUP_ID)
        const signUpElement = document.getElementById(SIGNUP_ID) as HTMLFormElement
        wireUpSignUpFormSubmitEvent(document, signUpElement, SuccessFormSnapShot)
        // Act
        signUpElement.getElementsByTagName("input")[0].value = 'hung@gmail.com'
        signUpElement.getElementsByTagName("button")[0].click()
        // Assert
        expect(document.getElementById(SUCCESS_ID)).toBeTruthy()
    })

    it("Should comeback to submit view on returning", () => {
        // Arrange
        setBody(document, SuccessFormSnapShot, SUCCESS_ID)
        const successElement = document.getElementById(SUCCESS_ID) as HTMLElement
        wireUpSuccessClickEvent(document, successElement, SignUpFormSnapShot)
        // Act
        successElement.getElementsByTagName("button")[0].click()
        // Assert
        expect(document.getElementById(SIGNUP_ID)).toEqual(getSignUpFormDom().body.firstChild)
    })

    it("Should navigate back and forth between views", async () => {
        initialize(getAllFormFetchMock())
        await new Promise(process.nextTick);
        const submitForm = document.getElementById(SIGNUP_ID) as HTMLFormElement

        submitForm.getElementsByTagName("input")[0].value = 'hung@gmail.com'
        submitForm.getElementsByTagName("button")[0].click()

        expect(document.getElementById(SUCCESS_ID)).toBeTruthy()
        const successForm = document.getElementById(SUCCESS_ID) as HTMLElement
        successForm.getElementsByTagName("button")[0].click()
        expect(document.getElementById(SIGNUP_ID)).toBeTruthy()
    })

    it("Should bring submitted email over to success view", async () => {
        initialize(getAllFormFetchMock())
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
        signUpFormElementSubmitEventHandler(submitEvent)
        expect(prevented).toBeTruthy()
    })

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

    function getFetchMock(snapShot: string, requestInfo: string) {
        return (input: RequestInfo | URL) => {
            if (input == requestInfo) {
                const OkResponse = new Response(snapShot, { status: HttpStatusCode.OK });
                return Promise.resolve(OkResponse);
            }
            const BadResponse = new Response("", { status: HttpStatusCode.NOT_FOUND });
            return Promise.resolve(BadResponse);
        };
    }

    function getSuccessFormFetchMock(): (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response> {
        return getFetchMock(SuccessFormSnapShot, 'success-form.html');
    }

    function getSignUpFormFetchMock(): (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response> {
        return getFetchMock(SignUpFormSnapShot, 'sign-up-form.html');
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
        (signUpFormDom.body.firstChild as HTMLElement).id = SIGNUP_ID;
        return signUpFormDom;
    }

    function getSuccessFormDom() {
        const parser = new DOMParser();
        const successFormDom = parser.parseFromString(SuccessFormSnapShot, 'text/html');
        (successFormDom.body.firstChild as HTMLElement).id = SUCCESS_ID;
        return successFormDom;
    }
})


