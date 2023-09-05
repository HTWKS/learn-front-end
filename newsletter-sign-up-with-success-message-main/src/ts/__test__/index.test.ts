/**
 * @jest-environment jsdom
 */
import { describe, it, expect } from '@jest/globals';
import HttpStatus from 'http-status-codes';
const StaticHostUrl = "http://localhost:8080"
describe("Sign up form", () => {
    it("Should run in jsdom environment", () => {
        expect(document).toBeTruthy()
    })

    it("Should fetch sign-up-form.html", async () => {
        expect(200).toBe(HttpStatus.OK)
    })
})