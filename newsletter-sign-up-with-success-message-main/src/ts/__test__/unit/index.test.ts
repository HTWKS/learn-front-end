/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach } from '@jest/globals';
import { SignUpFormSnapShot, SuccessFormSnapShot } from '../snapshots';
import { HttpStatusCode } from '../../http-status-code';
import 'isomorphic-fetch'
import { getSignUpFormAsync, getRootElement, setRootElement, ROOT_ID, getSuccessFormAsync, removeCaches, wireUpSignUpFormSubmitEvent } from '../../sign-up-form';

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
        setRootElement(document, SignUpFormSnapShot)
        // Assert
        expect(document.body).toEqual(signUpFormDom.body);
        expect(ROOT_ID).toEqual((document.body.firstChild as HTMLDivElement).id);
    })

    it("Should get submit form successfully", () => {
        // Act
        setRootElement(document, SignUpFormSnapShot)
        // Assert
        expect(getRootElement(document)).toEqual(getSignUpFormDom().body.firstChild)
    })

    it("Should get success form successfully", () => {
        // Act
        setRootElement(document, SuccessFormSnapShot)
        // Assert
        expect(getRootElement(document)).toEqual(getSuccessFormDom().body.firstChild)
    })

    it("Should submit form on button click", () => {
        //Arrange
        setRootElement(document, SignUpFormSnapShot)
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
        setRootElement(document, SignUpFormSnapShot)
        const submitForm = getRootElement(document)
        let formSubmitted = false
        // Act
        submitForm.addEventListener("submit", () => { formSubmitted = true })
        submitForm.getElementsByTagName("button")[0].click()
        // Assert
        expect(formSubmitted).toBeFalsy()
    })

    it("Should update to success view on submit", async () => {
        // Arrange
        setRootElement(document, SignUpFormSnapShot)
        const rootElement = getRootElement(document)
        wireUpSignUpFormSubmitEvent(document, rootElement, await getSuccessFormAsync(getSuccessFormFetchMock()))
        // Act
        rootElement.getElementsByTagName("input")[0].value = 'hung@gmail.com'
        rootElement.getElementsByTagName("button")[0].click()
        // Assert
        expect(getRootElement(document)).toEqual(getSuccessFormDom().body.firstChild)
    })

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


