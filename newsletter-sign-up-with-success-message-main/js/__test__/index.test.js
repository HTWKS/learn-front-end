/**
 * @jest-environment jsdom
 */

describe("submit form", () => {
    it("Should run in jsdom environment", () => {
        const documentBody = document.createElement('body')
        documentBody.innerHTML = `<form class = "sign-up--form" id ="sign-up--form">
        <label for="sign-up--form--email-address" class="sign-up--form--label">Email address</label>
        <input id="sign-up--form--email-address" class="sign-up--form--input-field curvy mb-1" type="email"
          placeholder="email@company.com"></input>
        <button class="sign-up--form--submit-button curvy">Subscribe to monthly newsletter</button>
      </form>`
        expect(documentBody.children.length).toBe(1)
    })
    it("S")
})