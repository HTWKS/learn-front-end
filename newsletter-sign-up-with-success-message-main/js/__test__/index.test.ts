import { beforeEach, describe, expect, it } from '@jest/globals';

describe("submit form", () => {
  const HtmlFormId = "sign-up--form"

  beforeEach(() => {
    const htmlForm = `<form class = "sign-up--form" id ="` + HtmlFormId + `">
        <label for="sign-up--form--email-address" class="sign-up--form--label">Email address</label>
        <input id="sign-up--form--email-address" class="sign-up--form--input-field curvy mb-1" type="email"
          placeholder="email@company.com">email@company.com</input>
        <button class="sign-up--form--submit-button curvy">Subscribe to monthly newsletter</button>
      </form>`
    document.body.innerHTML = htmlForm
  });

  it("Should run in jsdom environment", () => {
    expect(document.body.children.length).toBe(1)
  });

  it("Should submit form on button click", async () => {
    const htmlForm = document.getElementById(HtmlFormId)
    expect(htmlForm).toBeInstanceOf(HTMLFormElement)

    const submitButton = htmlForm.getElementsByTagName("button")[0]
    expect(submitButton).toBeTruthy()

    let eventIsActivated: boolean = false
    htmlForm.addEventListener("submit", (event) => {
      eventIsActivated = true
    })
    submitButton.click()
    expect(eventIsActivated).toBeTruthy()
  })
})