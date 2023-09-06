/**
 * @jest-environment jsdom
 */
import { describe, it, expect } from '@jest/globals';
const StaticHostUrl = "http://localhost:8080"
describe("Sign up form", () => {
    it("Should run in jsdom environment", () => {
        expect(document).toBeTruthy()
    })
})