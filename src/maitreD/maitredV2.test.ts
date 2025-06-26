import { test, assert, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import { MaitreDV2, Reservation } from ".";
import { ILogger } from "../cross-cutting";
import { IReservationRepository } from "../repository";

test("MaitreDV2 should allow reservation if under capacity", () => {
    const capacity = 10;
    const bookedSeats = 3;
    const stubRepository = mock<IReservationRepository>();
    stubRepository.getReservationQuantity.mockReturnValue(bookedSeats);
    const stubLogger = mock<ILogger>();
    const reservation: Reservation = {
        id: 1,
        Date: "12/12/2022",
        Quantity: 3
    };
    const sut = new MaitreDV2(capacity, stubRepository, stubLogger);

    const result = sut.canReserve(reservation);

    assert.equal(result, true);
});

test("MaitreDV2 should not allow reservation if over capacity", () => {
    const capacity = 10;
    const bookedSeats = 10;
    const stubRepository = mock<IReservationRepository>();
    stubRepository.getReservationQuantity.mockReturnValue(bookedSeats);
    const stubLogger = mock<ILogger>();
    const reservation: Reservation = {
        id: 1,
        Date: "12/12/2022",
        Quantity: 3
    };
    const sut = new MaitreDV2(capacity, stubRepository, stubLogger);

    const result = sut.canReserve(reservation);

    assert.equal(result, false);
});

test("MaitreDV2 should return total capacity when asked for", () => {
    const capacity = 10;
    const stubRepository = mock<IReservationRepository>();
    const stubLogger = mock<ILogger>();
    const sut = new MaitreDV2(capacity, stubRepository, stubLogger);

    const result = sut.getTotalCapacity();

    assert.equal(result, capacity);
});

test("CanReserve when called invokes logger with message", () => {
    const capacity = 10;
    const bookedSeats = 3;
    const stubRepository = mock<IReservationRepository>();
    stubRepository.getReservationQuantity.mockReturnValue(bookedSeats);
    const mockLogger = mock<ILogger>();
    const sut = new MaitreDV2(capacity, stubRepository, mockLogger);
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

test("CanReserve when called invokes getReservationQuantity from repository", () => {
    const capacity = 10;
    const mockRepository = mock<IReservationRepository>();
    const stubLogger = mock<ILogger>();
    const sut = new MaitreDV2(capacity, mockRepository, stubLogger);
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
