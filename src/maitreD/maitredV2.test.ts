import { test, assert, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import { MaitreDV2, Reservation } from ".";
import { ICache, ILogger } from "../cross-cutting";
import { IReservationRepository } from "../repository";

test("MaitreDV2 should allow reservation if under capacity", () => {
    const capacity = 10;
    const bookedSeats = 3;
    const stubRepository = mock<IReservationRepository>();
    stubRepository.getReservationQuantity.mockReturnValue(bookedSeats);
    const stubLogger = mock<ILogger>();
    const stubCache = mock<ICache>();
    stubCache.get.mockReturnValue(undefined);
    const reservation: Reservation = {
        id: 1,
        Date: "12/12/2022",
        Quantity: 3
    };
    const sut = new MaitreDV2(capacity, stubRepository, stubLogger, stubCache);

    const result = sut.canReserve(reservation);

    assert.equal(result, true);
});

test("MaitreDV2 should not allow reservation if over capacity", () => {
    const capacity = 10;
    const bookedSeats = 10;
    const stubRepository = mock<IReservationRepository>();
    stubRepository.getReservationQuantity.mockReturnValue(bookedSeats);
    const stubLogger = mock<ILogger>();
    const stubCache = mock<ICache>();
    stubCache.get.mockReturnValue(undefined);
    const reservation: Reservation = {
        id: 1,
        Date: "12/12/2022",
        Quantity: 3
    };
    const sut = new MaitreDV2(capacity, stubRepository, stubLogger, stubCache);

    const result = sut.canReserve(reservation);

    assert.equal(result, false);
});

test("MaitreDV2 should return total capacity when asked for", () => {
    const capacity = 10;
    const stubRepository = mock<IReservationRepository>();
    const stubLogger = mock<ILogger>();
    const stubCache = mock<ICache>();
    const sut = new MaitreDV2(capacity, stubRepository, stubLogger, stubCache);

    const result = sut.getTotalCapacity();

    assert.equal(result, capacity);
});

test("MaitreDV2 should return cached value instead of calling repository", () => {
    const capacity = 10;
    const stubRepository = mock<IReservationRepository>();
    const stubLogger = mock<ILogger>();
    const stubCache = mock<ICache>();
    stubCache.get.mockReturnValue(3);
    const reservation: Reservation = {
        id: 1,
        Date: "12/12/2022",
        Quantity: 3
    };
    const sut = new MaitreDV2(capacity, stubRepository, stubLogger, stubCache);

    const result = sut.canReserve(reservation);

    assert.equal(result, true);
    expect(stubRepository.getReservationQuantity).not.toHaveBeenCalled();
});

test("CanReserve when called invokes logger with message", () => {
    const capacity = 10;
    const bookedSeats = 3;
    const stubRepository = mock<IReservationRepository>();
    stubRepository.getReservationQuantity.mockReturnValue(bookedSeats);
    const mockLogger = mock<ILogger>();
    const stubCache = mock<ICache>();
    stubCache.get.mockReturnValue(undefined);
    const sut = new MaitreDV2(capacity, stubRepository, mockLogger, stubCache);
    const reservation: Reservation = {
        id: 1,
        Date: "12/12/2022",
        Quantity: 3
    };

    sut.canReserve(reservation);

    expect(mockLogger.Log).toHaveBeenCalledWith(
        "Checking if the reservation can be made"
    );
});

// 🚨 Test Smell: Mock over-use.
// We already have a value-based test above that verifies canReserve returns
// the correct result. Asserting that getReservationQuantity was called is
// redundant — if it wasn't called, the value test would already fail.
// When you are not asserting on an interaction, use a stub instead.
test("CanReserve when called invokes getReservationQuantity from repository", () => {
    const capacity = 10;
    const mockRepository = mock<IReservationRepository>();
    const stubLogger = mock<ILogger>();
    const stubCache = mock<ICache>();
    stubCache.get.mockReturnValue(undefined);
    const sut = new MaitreDV2(capacity, mockRepository, stubLogger, stubCache);
    const reservation: Reservation = {
        id: 1,
        Date: "12/12/2022",
        Quantity: 3
    };

    sut.canReserve(reservation);

    expect(mockRepository.getReservationQuantity).toHaveBeenCalledWith(
        reservation.Date
    );
});
