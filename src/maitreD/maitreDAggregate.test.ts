import { test, assert, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import { MaitreDAggregate, Reservation } from ".";
import { IReservationService } from "./IReservationService";
import { IPaymentService } from "./IPaymentService";

test("MaitreDAggregate should allow reservation if under capacity and deposit held", () => {
    const stubReservationService = mock<IReservationService>();
    stubReservationService.canAccommodate.mockReturnValue(true);
    const stubPaymentService = mock<IPaymentService>();
    stubPaymentService.holdDeposit.mockReturnValue(true);
    const sut = new MaitreDAggregate(stubReservationService, stubPaymentService);

    const reservation: Reservation = { id: 1, Date: "12/12/2022", Quantity: 3 };
    const result = sut.canReserve(reservation);

    assert.equal(result, true);
});

test("MaitreDAggregate should not allow reservation if over capacity", () => {
    const stubReservationService = mock<IReservationService>();
    stubReservationService.canAccommodate.mockReturnValue(false);
    const stubPaymentService = mock<IPaymentService>();
    const sut = new MaitreDAggregate(stubReservationService, stubPaymentService);

    const reservation: Reservation = { id: 1, Date: "12/12/2022", Quantity: 3 };
    const result = sut.canReserve(reservation);

    assert.equal(result, false);
});

test("MaitreDAggregate should not allow reservation if deposit fails", () => {
    const stubReservationService = mock<IReservationService>();
    stubReservationService.canAccommodate.mockReturnValue(true);
    const stubPaymentService = mock<IPaymentService>();
    stubPaymentService.holdDeposit.mockReturnValue(false);
    const sut = new MaitreDAggregate(stubReservationService, stubPaymentService);

    const reservation: Reservation = { id: 1, Date: "12/12/2022", Quantity: 3 };
    const result = sut.canReserve(reservation);

    assert.equal(result, false);
});

test("canReserve forwards the correct arguments to reservationService", () => {
    const mockReservationService = mock<IReservationService>();
    mockReservationService.canAccommodate.mockReturnValue(true);
    const stubPaymentService = mock<IPaymentService>();
    stubPaymentService.holdDeposit.mockReturnValue(true);
    const sut = new MaitreDAggregate(mockReservationService, stubPaymentService);

    const reservation: Reservation = { id: 1, Date: "12/12/2022", Quantity: 3 };
    sut.canReserve(reservation);

    expect(mockReservationService.canAccommodate).toHaveBeenCalledWith("12/12/2022", 3);
});

test("canReserve forwards the correct reservation id to paymentService", () => {
    const stubReservationService = mock<IReservationService>();
    stubReservationService.canAccommodate.mockReturnValue(true);
    const mockPaymentService = mock<IPaymentService>();
    mockPaymentService.holdDeposit.mockReturnValue(true);
    const sut = new MaitreDAggregate(stubReservationService, mockPaymentService);

    const reservation: Reservation = { id: 42, Date: "12/12/2022", Quantity: 3 };
    sut.canReserve(reservation);

    expect(mockPaymentService.holdDeposit).toHaveBeenCalledWith(42);
});

test("canReserve does not call paymentService when capacity check fails", () => {
    const stubReservationService = mock<IReservationService>();
    stubReservationService.canAccommodate.mockReturnValue(false);
    const mockPaymentService = mock<IPaymentService>();
    const sut = new MaitreDAggregate(stubReservationService, mockPaymentService);

    const reservation: Reservation = { id: 1, Date: "12/12/2022", Quantity: 3 };
    sut.canReserve(reservation);

    expect(mockPaymentService.holdDeposit).not.toHaveBeenCalled();
});
