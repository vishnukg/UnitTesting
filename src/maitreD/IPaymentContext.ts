import { IPaymentProcessor } from "../payment";

export interface IPaymentContext {
    depositAmount: number;
    paymentProcessor: IPaymentProcessor;
}
