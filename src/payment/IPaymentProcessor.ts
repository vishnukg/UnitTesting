export interface IPaymentProcessor {
    holdDeposit(reservationId: number, amount: number): boolean;
}
