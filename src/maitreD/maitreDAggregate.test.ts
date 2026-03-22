import { test, assert } from "vitest";
import { mock } from "vitest-mock-extended";
import { MaitreDAggregate, IMaitreDContext, Reservation } from ".";
import { IReservationRepository } from "../repository";

test("MaitreDAggregate should allow reservation if under capacity", () => {
    const stubRepository = mock<IReservationRepository>();
    stubRepository.getReservationQuantity.mockReturnValue(3);
    const context: IMaitreDContext = { capacity: 10, reservationRepo: stubRepository };
    const sut = new MaitreDAggregate(context);

    const reservation: Reservation = { id: 1, Date: "12/12/2022", Quantity: 3 };
    const result = sut.canReserve(reservation);

    assert.equal(result, true);
});

test("MaitreDAggregate should not allow reservation if over capacity", () => {
    const stubRepository = mock<IReservationRepository>();
    stubRepository.getReservationQuantity.mockReturnValue(10);
    const context: IMaitreDContext = { capacity: 10, reservationRepo: stubRepository };
    const sut = new MaitreDAggregate(context);

    const reservation: Reservation = { id: 1, Date: "12/12/2022", Quantity: 3 };
    const result = sut.canReserve(reservation);

    assert.equal(result, false);
});

test("MaitreDAggregate should return total capacity", () => {
    const stubRepository = mock<IReservationRepository>();
    const context: IMaitreDContext = { capacity: 15, reservationRepo: stubRepository };
    const sut = new MaitreDAggregate(context);

    const result = sut.getTotalCapacity();

    assert.equal(result, 15);
});
