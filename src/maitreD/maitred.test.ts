import { test, assert, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import { MaitreD, Reservation } from ".";
import { IReservationRepository } from "../repository";

// Value based testing

test("MaitreD should allow reservation if under capacity", () => {
    //Arrange
    const capacity = 10;
    const bookedSeats = 3;
    const stubRepository = mock<IReservationRepository>();
    stubRepository.getReservationQuantity.mockReturnValue(bookedSeats);
    const reservation: Reservation = {
        id: 1,
        Date: "12/12/2022",
        Quantity: 3
    };
    const sut = new MaitreD(capacity, stubRepository);

    //Act
    const result = sut.canReserve(reservation);

    //Assert
    assert.equal(result, true);
});

test("MaitreD should not allow reservation if over capacity", () => {
    //Arrange
    const capacity = 10;
    const bookedSeats = 10;
    const stubRepository = mock<IReservationRepository>();
    stubRepository.getReservationQuantity.mockReturnValue(bookedSeats);
    const reservation: Reservation = {
        id: 1,
        Date: "12/12/2022",
        Quantity: 3
    };
    const sut = new MaitreD(capacity, stubRepository);

    //Act
    const result = sut.canReserve(reservation);

    //Assert
    assert.equal(result, false);
});

test("MaitreD should return total capacity when asked for", () => {
    //Arrange
    const capacity = 10;
    const stubRepository = mock<IReservationRepository>();
    const maiterd = new MaitreD(capacity, stubRepository);

    //Act
    const sut = maiterd.getTotalCapacity();

    //Assert
    assert.equal(sut, capacity);
});

// 🚨 Test Smell: Interaction test over value test.
// We are asserting HOW canReserve works internally (it calls the repo)
// rather than WHAT it returns. This is "testing structure vs behaviour".
// If the implementation changes (e.g. caches the result), this test breaks
// even though the behaviour is identical. Prefer the value-based tests above.
test("CanReserve when called invokes getReservationQuantity from repository", () => {
    const capacity = 10;
    const mockRepository = mock<IReservationRepository>();
    const sut = new MaitreD(capacity, mockRepository);
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
