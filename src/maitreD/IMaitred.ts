import { Reservation } from ".";

export interface IMaitreD {
  getTotalCapacity(): number;
  canReserve(reservation: Reservation): boolean;
}
