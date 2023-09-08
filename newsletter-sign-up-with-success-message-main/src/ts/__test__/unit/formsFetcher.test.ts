import { it, expect } from '@jest/globals';
import { SignUpFormSnapShot, SuccessFormSnapShot } from '../snapshots';
import { HttpStatusCode } from '../../constants';
import 'isomorphic-fetch'
import { FormsFetcher } from '../../formsFetcher';

it("Should get sign up form successfully", async () => {
    // Arrange
    const sut = new FormsFetcher(getSignUpFormFetchMock())
    // Act
    const actual = await sut.getSignUpFormAsync()
    // Assert
    expect(actual).toEqual(SignUpFormSnapShot)
})

it("Should cache sign up form", async () => {
    // Arrange
    const sut = new FormsFetcher(getSignUpFormFetchMock())
    // Act
    const actual = await sut.getSignUpFormAsync()
    // Assert
    expect(actual).toEqual(SignUpFormSnapShot)
})

it("Should handle api call fail gracefully", async () => {
    // Arrange
    const sut = new FormsFetcher(getNotFoundFetchMock())
    // Act
    const actual = await sut.getSignUpFormAsync()
    // Assert
    expect(actual).toEqual('')
})

it("Should get success form successfully", async () => {
    // Arrange
    const sut = new FormsFetcher(getSuccessFormFetchMock())
    // Act
    const actual = await sut.getSuccessFormAsync()
    // Assert
    expect(actual).toEqual(SuccessFormSnapShot)
})

it("Should cache success form", async () => {
    // Arrange
    const sut = new FormsFetcher(getSuccessFormFetchMock())
    // Act
    await sut.getSuccessFormAsync()
    sut.setFetch(getNotFoundFetchMock())
    // Act
    const actual = await sut.getSuccessFormAsync()
    // Assert
    expect(actual).toEqual(SuccessFormSnapShot)
})

function getNotFoundFetchMock() {
    return () => {
        const BadResponse = new Response("Not Good", { status: HttpStatusCode.NOT_FOUND });
        return Promise.resolve(BadResponse);
    };
}

function getSuccessFormFetchMock(): (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response> {
    return getFetchMock(SuccessFormSnapShot, 'success-form.html');
}

function getSignUpFormFetchMock(): (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response> {
    return getFetchMock(SignUpFormSnapShot, 'sign-up-form.html');
}

function getFetchMock(snapShot: string, requestInfo: string) {
    return (input: RequestInfo | URL) => {
        if (input == requestInfo) {
            const OkResponse = new Response(snapShot, { status: HttpStatusCode.OK });
            return Promise.resolve(OkResponse);
        }
        const BadResponse = new Response("", { status: HttpStatusCode.NOT_FOUND });
        return Promise.resolve(BadResponse);
    };
}