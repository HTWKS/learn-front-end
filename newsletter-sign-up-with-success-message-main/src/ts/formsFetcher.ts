import { HttpStatusCode } from "./constants";
export interface IFormsFetcher {
    getSignUpFormAsync: () => Promise<string>
    getSuccessFormAsync: () => Promise<string>
}
export class FormsFetcher implements IFormsFetcher {
    private _fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;
    private _signUpFormHtml: string;
    private _successFormHtml: string;

    constructor(fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
        this._fetch = (...args) => fetch(...args)
    }

    public setFetch = (fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) => this._fetch = fetch

    public getSignUpFormAsync = async () => {
        if (this._signUpFormHtml === undefined) {
            const response = await this._fetch("sign-up-form.html");
            this._signUpFormHtml = await this.processApiResponseAsync(response);
        }
        return this._signUpFormHtml;
    };

    public getSuccessFormAsync = async () => {
        if (this._successFormHtml === undefined) {
            const response = await this._fetch("success-form.html");
            this._successFormHtml = await this.processApiResponseAsync(response);
        }
        return this._successFormHtml;
    };

    private async processApiResponseAsync(response: Response) {
        if (response.status == HttpStatusCode.OK) {
            return await response.text();
        }
        return '';
    }
}
