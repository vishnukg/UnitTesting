import { IReservationService } from "./IReservationService";
import { IReservationRepository } from "../repository";
import { canAccommodate } from "./canAccommodate";

export class ReservationService implements IReservationService {
    constructor(
        private capacity: number,
        private reservationRepo: IReservationRepository
    ) {}

    getReservedSeats(date: string): number {
        return this.reservationRepo.getReservationQuantity(date);
    }

    canAccommodate(date: string, quantity: number): boolean {
        const reserved = this.getReservedSeats(date);
        return canAccommodate(reserved, quantity, this.capacity);
    }
}
