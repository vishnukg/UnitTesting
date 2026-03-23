import { IMaitreD, Reservation } from ".";
import { IReservationService } from "./IReservationService";
import { IPaymentService } from "./IPaymentService";

export class MaitreDAggregate implements IMaitreD {
    constructor(
        private reservationService: IReservationService,
        private paymentService: IPaymentService
    ) {}

    getTotalCapacity(): number {
        return this.reservationService.getReservedSeats("total");
    }

    canReserve(reservation: Reservation): boolean {
        if (!this.reservationService.canAccommodate(reservation.Date, reservation.Quantity)) {
            return false;
        }
        return this.paymentService.holdDeposit(reservation.id);
    }
}
