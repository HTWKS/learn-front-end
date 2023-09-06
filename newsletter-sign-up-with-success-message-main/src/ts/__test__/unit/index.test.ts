/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach } from '@jest/globals';
import { SignUpFormSnapShot } from '../sign-up-form-snapshot';
import { HttpStatusCode } from '../../http-status-code';
import 'isomorphic-fetch'
import { getSignUpFormAsync, setToBody } from '../../get-sign-up-form';

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
        setToBody(document, SignUpFormSnapShot)
        const parser = new DOMParser()
        const signUpFormDom = parser.parseFromString(SignUpFormSnapShot, 'text/html');
        (signUpFormDom.body.firstChild as HTMLElement).id = 'sign-up-form'
        expect(document.body).toEqual(signUpFormDom.body);
        expect('sign-up-form').toEqual((document.body.firstChild as HTMLDivElement).id);
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
})

