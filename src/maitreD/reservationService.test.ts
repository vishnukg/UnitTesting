import { test, assert, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import { ReservationService } from "./reservationService";
import { IReservationRepository } from "../repository";

test("getReservedSeats returns the quantity from the repository", () => {
    const stubRepo = mock<IReservationRepository>();
    stubRepo.getReservationQuantity.mockReturnValue(5);
    const sut = new ReservationService(10, stubRepo);

    const result = sut.getReservedSeats("12/12/2022");

    assert.equal(result, 5);
});

test("getReservedSeats queries the repository with the correct date", () => {
    const mockRepo = mock<IReservationRepository>();
    mockRepo.getReservationQuantity.mockReturnValue(0);
    const sut = new ReservationService(10, mockRepo);

    sut.getReservedSeats("25/12/2022");

    expect(mockRepo.getReservationQuantity).toHaveBeenCalledWith("25/12/2022");
});

test("canAccommodate returns true when reserved + quantity is under capacity", () => {
    const stubRepo = mock<IReservationRepository>();
    stubRepo.getReservationQuantity.mockReturnValue(3);
    const sut = new ReservationService(10, stubRepo);

    const result = sut.canAccommodate("12/12/2022", 3);

    assert.equal(result, true);
});

test("canAccommodate returns false when reserved + quantity exceeds capacity", () => {
    const stubRepo = mock<IReservationRepository>();
    stubRepo.getReservationQuantity.mockReturnValue(8);
    const sut = new ReservationService(10, stubRepo);

    const result = sut.canAccommodate("12/12/2022", 5);

    assert.equal(result, false);
});

test("canAccommodate returns true when reservation fills exactly to capacity", () => {
    const stubRepo = mock<IReservationRepository>();
    stubRepo.getReservationQuantity.mockReturnValue(7);
    const sut = new ReservationService(10, stubRepo);

    const result = sut.canAccommodate("12/12/2022", 3);

    assert.equal(result, true);
});
