export interface IReservationService {
    getReservedSeats(date: string): number;
    canAccommodate(date: string, quantity: number): boolean;
}
