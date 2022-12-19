import { Reservation } from ".";
import { ILogger } from "../cross-cutting";
import { IReservationRepository } from "../repository";

export class MaitreDLogDecorator {
  private capacity: number;
  private reservationRepo: IReservationRepository;
  private logger: ILogger;

  constructor(
    capacity: number,
    reservationRepo: IReservationRepository,
    logger: ILogger
  ) {
    this.capacity = capacity;
    this.reservationRepo = reservationRepo;
    this.logger = logger;
  }

  getTotalCapacity(): number {
    return this.capacity;
  }

  CanReserve(reservation: Reservation): boolean {
    const reservedSeats = this.reservationRepo.getReservationQuantity(
      reservation.Date
    );

    this.logger.Log("Checking if the reservation can be made");

    if (reservedSeats + reservation.Quantity <= this.capacity) {
      return true;
    }
    return false;
  }
}
