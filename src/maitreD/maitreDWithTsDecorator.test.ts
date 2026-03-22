import { test, assert } from "vitest";
import { mock } from "vitest-mock-extended";
import { MaitreDWithTsDecorator, Reservation } from ".";
import { IReservationRepository } from "../repository";

// With TS decorators, the logger is not a constructor dep — testing core
// behaviour needs no logger stub at all.
test("MaitreDWithTsDecorator should allow reservation if under capacity", () => {
    const stubRepository = mock<IReservationRepository>();
    stubRepository.getReservationQuantity.mockReturnValue(3);
    const sut = new MaitreDWithTsDecorator(10, stubRepository);

    const reservation: Reservation = { id: 1, Date: "12/12/2022", Quantity: 3 };
    const result = sut.canReserve(reservation);

    assert.equal(result, true);
});

test("MaitreDWithTsDecorator should not allow reservation if over capacity", () => {
    const stubRepository = mock<IReservationRepository>();
    stubRepository.getReservationQuantity.mockReturnValue(10);
    const sut = new MaitreDWithTsDecorator(10, stubRepository);

    const reservation: Reservation = { id: 1, Date: "12/12/2022", Quantity: 3 };
    const result = sut.canReserve(reservation);

    assert.equal(result, false);
});

test("MaitreDWithTsDecorator should return total capacity", () => {
    const stubRepository = mock<IReservationRepository>();
    const sut = new MaitreDWithTsDecorator(20, stubRepository);

    const result = sut.getTotalCapacity();

    assert.equal(result, 20);
});
