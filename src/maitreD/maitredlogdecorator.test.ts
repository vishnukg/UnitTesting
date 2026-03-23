import { test, expect, assert } from "vitest";
import { mock } from "vitest-mock-extended";
import { IMaitreD, MaitreD, MaitreDLogDecorator, Reservation } from ".";
import { ILogger } from "../cross-cutting";
import { ReservationRepository } from "../repository";

test("getTotalCapacity returns the capacity from the wrapped IMaitreD", () => {
    // Arrange
    const stubMaitreD = mock<IMaitreD>();
    stubMaitreD.getTotalCapacity.mockReturnValue(10);
    const stubLogger = mock<ILogger>();
    const sut = new MaitreDLogDecorator(stubMaitreD, stubLogger);

    // Act
    const result = sut.getTotalCapacity();

    // Assert — behaviour: does it return the right value?
    expect(result).toBe(10);
});

test("canReserve delegates to the wrapped IMaitreD with the correct reservation", () => {
    const mockMaitreD = mock<IMaitreD>();
    mockMaitreD.canReserve.mockReturnValue(true);
    const stubLogger = mock<ILogger>();
    const reservation: Reservation = {
        id: 1,
        Date: "12/12/2022",
        Quantity: 3
    };
    const sut = new MaitreDLogDecorator(mockMaitreD, stubLogger);

    const result = sut.canReserve(reservation);

    expect(result).toBe(true);
    expect(mockMaitreD.canReserve).toHaveBeenCalledWith(reservation);
});

test("CanReserve when called invokes logger with message", () => {
    //Arrange
    const capacity = 10;
    const reservationRepo = new ReservationRepository();
    const maitreD = new MaitreD(capacity, reservationRepo);
    const mockLogger = mock<ILogger>();
    const reservation: Reservation = {
        id: 1,
        Date: "12/12/2022",
        Quantity: 3
    };
    const sut = new MaitreDLogDecorator(maitreD, mockLogger);

    //Act
    sut.canReserve(reservation);

    //Assert
    expect(mockLogger.Log).toHaveBeenCalledWith(
        "Checking if the reservation can be made"
    );
});
