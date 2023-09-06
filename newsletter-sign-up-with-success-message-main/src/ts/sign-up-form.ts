import { HttpStatusCode } from "./http-status-code";
let successForm: string;
let signUpForm: string;
export const ROOT_ID = 'root';

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

export function setRootElement(document: Document, html: string) {
    document.body.innerHTML = html;
    const rootElement: HTMLElement = document.body.firstChild as HTMLElement
    rootElement.id = ROOT_ID
}

export function wireUpSignUpFormSubmitEvent(document: Document, rootElement: HTMLElement, newRootHtml: string) {
    const formElement = rootElement.getElementsByTagName("form")[0];
    formElement.addEventListener("submit", () => {
        setRootElement(document, newRootHtml)
    });
}

export function getRootElement(document: Document): HTMLElement {
    return document.getElementById(ROOT_ID);
}

export function initialize() {
    getSignUpFormAsync(fetch)
        .then((signUpForm) => {
            setRootElement(document, signUpForm)
            getSuccessFormAsync(fetch).then((successForm) => {
                wireUpSignUpFormSubmitEvent(document, getRootElement(document), successForm)
            })
        })
}

export function removeCaches() {
    successForm = undefined;
    signUpForm = undefined
}