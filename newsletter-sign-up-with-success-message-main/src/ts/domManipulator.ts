import { SIGNUP_ID, SUCCESS_ID } from "./constants";
import { FormsFetcher } from "./formsFetcher";
interface IFormsHtml {
    signUp: string
    success: string
}
export class DomManipulator {
    private _formsHtml: IFormsHtml
    private _document: Document

    constructor(formsHtml: IFormsHtml, document: Document) {
        this._formsHtml = formsHtml
        this._document = document
    }

    initialize() {
        this.setSignUpForm()
        this.wireUpSignUpFormSubmitEvent(this.getSignUpFormHtmlElement())
    }

    setSignUpForm() {
        this._document.body.innerHTML = this._formsHtml.signUp
        const rootElement: HTMLElement = this._document.body.firstChild as HTMLElement
        rootElement.id = SIGNUP_ID
    }

    setSuccessForm() {
        this._document.body.innerHTML = this._formsHtml.success
        const rootElement: HTMLElement = this._document.body.firstChild as HTMLElement
        rootElement.id = SUCCESS_ID
    }

    wireUpSignUpFormSubmitEvent(formElement: HTMLFormElement) {
        formElement.addEventListener("submit", (event) => {
            preventDefault(event)
            this.setSuccessForm()
            this.setSuccessElementEmailText(this.getSuccessElement(), event);
            this.wireUpSuccessClickEvent(this.getSuccessButtonHtmlElement())
        });
    }

    wireUpSuccessClickEvent(buttonElement: HTMLButtonElement) {
        buttonElement.addEventListener("click", () => {
            this.setSignUpForm()
            this.wireUpSignUpFormSubmitEvent(this.getSignUpFormHtmlElement())
        });
    }

    private getSuccessElement() {
        return this._document.getElementById(SUCCESS_ID)
    }

    private getSignUpElement() {
        return this._document.getElementById(SIGNUP_ID)
    }

    private getSignUpFormHtmlElement() {
        return this.getSignUpElement().getElementsByTagName("form")[0]
    }

    private getSuccessButtonHtmlElement() {
        return this.getSuccessElement().getElementsByTagName("button")[0]
    }

    private setSuccessElementEmailText(successElement: HTMLElement, event: SubmitEvent) {
        const successFormEmail = successElement.querySelector('span[name="sign-up-form--email"]') as HTMLSpanElement;
        const formElements = (event.target as HTMLFormElement).elements;
        const submittedEmailAddress = formElements.namedItem('email-address') as HTMLInputElement;
        successFormEmail.textContent = submittedEmailAddress.value;
    }
}

export function preventDefault(event: { preventDefault(): void }) {
    event.preventDefault()
}

export function initialize(fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>, document: Document) {
    const fetchForm = new FormsFetcher(fetch)
    const signUpFormPromise = fetchForm.getSignUpFormAsync()
    const successFormPromise = fetchForm.getSuccessFormAsync()
    signUpFormPromise.then((signUpForm) => {
        successFormPromise.then((successForm) => {
            const formsHtml: IFormsHtml = {
                signUp: signUpForm,
                success: successForm
            }
            const domManipulator = new DomManipulator(formsHtml, document)
            domManipulator.initialize()
        })
    })
}