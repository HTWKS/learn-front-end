import { HttpStatusCode } from "./http-status-code";

export async function getSignUpFormAsync(fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    const response = await fetch("sign-up-form.html");
    if (response.status == HttpStatusCode.OK) {
        return await response.text();
    }
    return ''
}

export function setToBody(document: Document, Html: string) {
    document.body.innerHTML = Html;
    (document.body.firstChild as HTMLElement).id = 'sign-up-form'
}