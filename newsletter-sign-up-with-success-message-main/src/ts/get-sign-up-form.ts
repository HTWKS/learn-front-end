import { HttpStatusCode } from "./http-status-code";

export async function getSignUpFormAsync(fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    const response = await fetch("sign-up-form.html");
    if (response.status == HttpStatusCode.OK) {
        return await response.text();
    }
    return ''
}

export const ROOT_ID = 'root';

export function setToBody(document: Document, Html: string) {
    document.body.innerHTML = Html;
    const rootElement: HTMLElement = document.body.firstChild as HTMLElement
    (document.body.firstChild as HTMLElement).id = ROOT_ID
}

export function getRootElement(document: Document): HTMLElement {
    return document.getElementById(ROOT_ID);
}