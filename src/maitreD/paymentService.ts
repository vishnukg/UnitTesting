import { IPaymentService } from "./IPaymentService";
import { IPaymentProcessor } from "../payment";

export class PaymentService implements IPaymentService {
    constructor(
        private depositAmount: number,
        private paymentProcessor: IPaymentProcessor
    ) {}

    holdDeposit(reservationId: number): boolean {
        return this.paymentProcessor.holdDeposit(reservationId, this.depositAmount);
    }
}
