import { test, assert } from "vitest";
import { mock } from "vitest-mock-extended";
import { MaitreDAggregate, IRestaurantContext, IPaymentContext, Reservation } from ".";
import { IReservationRepository } from "../repository";
import { IPaymentProcessor } from "../payment";

test("MaitreDAggregate should allow reservation if under capacity and deposit held", () => {
    const stubRepository = mock<IReservationRepository>();
    stubRepository.getReservationQuantity.mockReturnValue(3);
    const restaurantContext: IRestaurantContext = { capacity: 10, reservationRepo: stubRepository };
    const stubPayment = mock<IPaymentProcessor>();
    stubPayment.holdDeposit.mockReturnValue(true);
    const paymentContext: IPaymentContext = { depositAmount: 50, paymentProcessor: stubPayment };
    const sut = new MaitreDAggregate(restaurantContext, paymentContext);

    const reservation: Reservation = { id: 1, Date: "12/12/2022", Quantity: 3 };
    const result = sut.canReserve(reservation);

    assert.equal(result, true);
});

test("MaitreDAggregate should not allow reservation if over capacity", () => {
    const stubRepository = mock<IReservationRepository>();
    stubRepository.getReservationQuantity.mockReturnValue(10);
    const restaurantContext: IRestaurantContext = { capacity: 10, reservationRepo: stubRepository };
    const stubPayment = mock<IPaymentProcessor>();
    const paymentContext: IPaymentContext = { depositAmount: 50, paymentProcessor: stubPayment };
    const sut = new MaitreDAggregate(restaurantContext, paymentContext);

    const reservation: Reservation = { id: 1, Date: "12/12/2022", Quantity: 3 };
    const result = sut.canReserve(reservation);

    assert.equal(result, false);
});

test("MaitreDAggregate should not allow reservation if deposit fails", () => {
    const stubRepository = mock<IReservationRepository>();
    stubRepository.getReservationQuantity.mockReturnValue(3);
    const restaurantContext: IRestaurantContext = { capacity: 10, reservationRepo: stubRepository };
    const stubPayment = mock<IPaymentProcessor>();
    stubPayment.holdDeposit.mockReturnValue(false);
    const paymentContext: IPaymentContext = { depositAmount: 50, paymentProcessor: stubPayment };
    const sut = new MaitreDAggregate(restaurantContext, paymentContext);

    const reservation: Reservation = { id: 1, Date: "12/12/2022", Quantity: 3 };
    const result = sut.canReserve(reservation);

    assert.equal(result, false);
});

test("MaitreDAggregate should return total capacity", () => {
    const stubRepository = mock<IReservationRepository>();
    const restaurantContext: IRestaurantContext = { capacity: 15, reservationRepo: stubRepository };
    const stubPayment = mock<IPaymentProcessor>();
    const paymentContext: IPaymentContext = { depositAmount: 50, paymentProcessor: stubPayment };
    const sut = new MaitreDAggregate(restaurantContext, paymentContext);

    const result = sut.getTotalCapacity();

    assert.equal(result, 15);
});
