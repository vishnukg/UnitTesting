export interface IPaymentService {
    holdDeposit(reservationId: number): boolean;
}
