import { getSignUpFormAsync, setToBody } from "./get-sign-up-form"
getSignUpFormAsync(fetch).then((response) => {
    setToBody(document, response)
})