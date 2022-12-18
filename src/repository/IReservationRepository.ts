export interface IReservationRepository {
  getReservationQuantity: (Date: string) => number;
}
