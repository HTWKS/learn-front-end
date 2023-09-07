import { HttpStatusCode } from "./http-status-code";
let successForm: string;
let signUpForm: string;
export const SIGNUP_ID = 'sign-up-form'
export const SUCCESS_ID = 'success-form'

export async function getSignUpFormAsync(fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    if (signUpForm === undefined) {
        const response = await fetch("sign-up-form.html");
        signUpForm = await processApiResponse(response)
    }
    return signUpForm
}

export async function getSuccessFormAsync(fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    if (successForm === undefined) {
        const response = await fetch("success-form.html");
        successForm = await processApiResponse(response)
    }
    return successForm
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

export function wireUpSignUpFormSubmitEvent(document: Document, signUpFormElement: HTMLElement, newRootHtml: string) {
    const formElement = signUpFormElement.getElementsByTagName("form")[0];
    formElement.addEventListener("submit", (event) => {
        signUpFormElementSubmitEventHandler(event)
        setBody(document, newRootHtml, SUCCESS_ID)
        wireUpSuccessClickEvent(document, document.getElementById(SUCCESS_ID), signUpForm)
    });
}

export function signUpFormElementSubmitEventHandler(event: { preventDefault(): void }) {
    event.preventDefault()
}

export function wireUpSuccessClickEvent(document: Document, successFormElement: HTMLElement, newRootHtml: string) {
    const buttonElement = successFormElement.getElementsByTagName("button")[0];
    buttonElement.addEventListener("click", () => {
        setBody(document, newRootHtml, SIGNUP_ID)
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
    successForm = undefined;
    signUpForm = undefined
}