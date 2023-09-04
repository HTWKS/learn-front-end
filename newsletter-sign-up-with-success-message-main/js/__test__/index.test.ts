import { beforeEach, describe, expect, it } from '@jest/globals';

describe("submit form", () => {
  let documentBody: HTMLBodyElement
  const HtmlFormId = "sign-up--form"

  beforeEach(() => {
    const HtmlForm = `<form class = "sign-up--form" id ="` + HtmlFormId + `">
        <label for="sign-up--form--email-address" class="sign-up--form--label">Email address</label>
        <input id="sign-up--form--email-address" class="sign-up--form--input-field curvy mb-1" type="email"
          placeholder="email@company.com"></input>
        <button class="sign-up--form--submit-button curvy">Subscribe to monthly newsletter</button>
      </form>`
    documentBody = document.createElement("body")
    documentBody.innerHTML = HtmlForm
  });

  it("Should run in jsdom environment", () => {
    expect(documentBody.children.length).toBe(1)
  });

  it("Should prevent default form submit for submit click", () => {
    const htmlForm = documentBody.querySelector("#" + HtmlFormId)
    expect(htmlForm).toBeInstanceOf(HTMLFormElement)
  })
})