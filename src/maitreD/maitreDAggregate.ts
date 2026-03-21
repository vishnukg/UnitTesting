import { IMaitreD, IMaitreDContext, Reservation } from ".";
import { canAccommodate } from "./canAccommodate";

export class MaitreDAggregate implements IMaitreD {
    constructor(private context: IMaitreDContext) {}

    getTotalCapacity(): number {
        return this.context.capacity;
    }

    canReserve(reservation: Reservation): boolean {
        const reserved = this.context.reservationRepo
            .getReservationQuantity(reservation.Date);
        return canAccommodate(reserved, reservation.Quantity, this.context.capacity);
    }
}
