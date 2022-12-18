import { IReservationRepository } from "../repository/IReservationRepository";
import { Reservation } from "../reservation";

export class MaitreDV2 {
  private capacity: number;
  private reservationRepo: IReservationRepository;
  constructor(capacity: number, reservationRepo: IReservationRepository) {
    this.capacity = capacity;
    this.reservationRepo = reservationRepo;
  }

  getTotalCapacity(): number {
    return this.capacity;
  }

  CanReserve(reservation: Reservation): boolean {
    const reservedSeats = this.reservationRepo.getReservationQuantity(
      reservation.Date
    );

    if (reservedSeats + reservation.Quantity <= this.capacity) {
      return true;
    }
    return false;
  }
}
