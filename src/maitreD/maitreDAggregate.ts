import { IMaitreD, IRestaurantContext, IPaymentContext, Reservation } from ".";
import { canAccommodate } from "./canAccommodate";

export class MaitreDAggregate implements IMaitreD {
    constructor(
        private restaurantContext: IRestaurantContext,
        private paymentContext: IPaymentContext
    ) {}

    getTotalCapacity(): number {
        return this.restaurantContext.capacity;
    }

    canReserve(reservation: Reservation): boolean {
        const reserved = this.restaurantContext.reservationRepo
            .getReservationQuantity(reservation.Date);
        if (!canAccommodate(reserved, reservation.Quantity, this.restaurantContext.capacity)) {
            return false;
        }
        return this.paymentContext.paymentProcessor
            .holdDeposit(reservation.id, this.paymentContext.depositAmount);
    }
}
