/**
 * @jest-environment jsdom
 */
import { describe, it, expect } from '@jest/globals';
import { SignUpFormSnapShot } from './sign-up-form-snapshot';
import { HttpStatusCode } from '../http-status-code';
import 'isomorphic-fetch'

describe("Sign up form", () => {
    it("Should run in jsdom environment", () => {
        expect(document).toBeTruthy()
    })

    it("Should ammend to jsdom on first page load", async () => {
        // Arrange
        const bodyMock = SignUpFormSnapShot
        const optionsMock = { status: HttpStatusCode.OK };
        const responseMock = new Response(bodyMock, optionsMock)
        const fetchMock = () => Promise.resolve(responseMock)
        const currentDocument = document
        const processDocumentProps = {
            Document: currentDocument,
            fetch: fetchMock,
        }
        // Act
        await processDocumentAsync(processDocumentProps)
        // Assert
        expect(currentDocument.body.innerHTML).toEqual(SignUpFormSnapShot)
    })
})

async function processDocumentAsync(props: { Document: Document, fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response> }) {
    const response = await props.fetch("")
    const responseText = await response.text()
    props.Document.body.innerHTML = responseText
}

