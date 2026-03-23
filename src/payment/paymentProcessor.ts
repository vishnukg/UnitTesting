import { IPaymentProcessor } from "./IPaymentProcessor";

export class PaymentProcessor implements IPaymentProcessor {
    holdDeposit(reservationId: number, amount: number): boolean {
        console.log(`Holding deposit of $${amount} for reservation ${reservationId}`);
        return true;
    }
}
