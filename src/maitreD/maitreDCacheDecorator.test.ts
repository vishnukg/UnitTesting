import { test, expect, assert } from "vitest";
import { mock } from "vitest-mock-extended";
import { IMaitreD, MaitreDCacheDecorator, Reservation } from ".";
import { ICache } from "../cross-cutting";

test("getTotalCapacity returns the capacity from the wrapped IMaitreD", () => {
    const stubMaitreD = mock<IMaitreD>();
    stubMaitreD.getTotalCapacity.mockReturnValue(10);
    const stubCache = mock<ICache>();
    const sut = new MaitreDCacheDecorator(stubMaitreD, stubCache);

    const result = sut.getTotalCapacity();

    expect(result).toBe(10);
});

test("canReserve returns cached result without calling inner MaitreD", () => {
    const stubMaitreD = mock<IMaitreD>();
    const stubCache = mock<ICache>();
    stubCache.get.mockReturnValue(true);
    const reservation: Reservation = {
        id: 1,
        Date: "12/12/2022",
        Quantity: 3
    };
    const sut = new MaitreDCacheDecorator(stubMaitreD, stubCache);

    const result = sut.canReserve(reservation);

    assert.equal(result, true);
    expect(stubMaitreD.canReserve).not.toHaveBeenCalled();
});

test("canReserve delegates to inner MaitreD on cache miss and stores result", () => {
    const stubMaitreD = mock<IMaitreD>();
    stubMaitreD.canReserve.mockReturnValue(false);
    const stubCache = mock<ICache>();
    stubCache.get.mockReturnValue(undefined);
    const reservation: Reservation = {
        id: 1,
        Date: "12/12/2022",
        Quantity: 3
    };
    const sut = new MaitreDCacheDecorator(stubMaitreD, stubCache);

    const result = sut.canReserve(reservation);

    assert.equal(result, false);
    expect(stubMaitreD.canReserve).toHaveBeenCalledWith(reservation);
    expect(stubCache.set).toHaveBeenCalledWith("reserved:12/12/2022", false);
});
