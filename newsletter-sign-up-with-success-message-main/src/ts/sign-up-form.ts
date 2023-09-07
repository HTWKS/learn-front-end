import { HttpStatusCode } from "./http-status-code";
let successFormHtml: string;
let signUpFormHtml: string;
export const SIGNUP_ID = 'sign-up-form'
export const SUCCESS_ID = 'success-form'

export async function getSignUpFormAsync(fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    if (signUpFormHtml === undefined) {
        const response = await fetch("sign-up-form.html");
        signUpFormHtml = await processApiResponse(response)
    }
    return signUpFormHtml
}

export async function getSuccessFormAsync(fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    if (successFormHtml === undefined) {
        const response = await fetch("success-form.html");
        successFormHtml = await processApiResponse(response)
    }
    return successFormHtml
}

async function processApiResponse(response: Response) {
    if (response.status == HttpStatusCode.OK) {
        return await response.text();
    }
    return ''
}

export function setBody(document: Document, html: string, id: string) {
    document.body.innerHTML = html;
    const rootElement: HTMLElement = document.body.firstChild as HTMLElement
    rootElement.id = id
}

export function wireUpSignUpFormSubmitEvent(document: Document, signUpFormElement: HTMLElement, successFormHtml: string) {
    const formElement = signUpFormElement.getElementsByTagName("form")[0];
    formElement.addEventListener("submit", (event) => {
        preventDefault(event)
        setBody(document, successFormHtml, SUCCESS_ID)
        const successElement = document.getElementById(SUCCESS_ID)
        setSuccessElementEmailText(successElement, event);
        wireUpSuccessClickEvent(document, successElement, signUpFormHtml)
    });
}

function setSuccessElementEmailText(successElement: HTMLElement, event: SubmitEvent) {
    const successFormEmail = successElement.querySelector('span[name="sign-up-form--email"]') as HTMLSpanElement;
    const formElements = (event.target as HTMLFormElement).elements;
    const submittedEmailAddress = formElements.namedItem('email-address') as HTMLInputElement;
    successFormEmail.textContent = submittedEmailAddress.value;
}

export function preventDefault(event: { preventDefault(): void }) {
    event.preventDefault()
}

export function wireUpSuccessClickEvent(document: Document, successFormElement: HTMLElement, signUpFormHtml: string) {
    const buttonElement = successFormElement.getElementsByTagName("button")[0];
    buttonElement.addEventListener("click", () => {
        setBody(document, signUpFormHtml, SIGNUP_ID)
        wireUpSignUpFormSubmitEvent(document, document.getElementById(SIGNUP_ID), successFormHtml)
    });
}

export function initialize(fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    getSignUpFormAsync(fetch)
        .then((signUpForm) => {
            setBody(document, signUpForm, SIGNUP_ID)
            getSuccessFormAsync(fetch).then((successForm) => {
                wireUpSignUpFormSubmitEvent(document, document.getElementById(SIGNUP_ID), successForm)
            })
        })
}

export function removeCaches() {
    successFormHtml = undefined;
    signUpFormHtml = undefined
}