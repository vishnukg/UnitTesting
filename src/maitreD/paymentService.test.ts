import { test, assert, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import { PaymentService } from "./paymentService";
import { IPaymentProcessor } from "../payment";

test("holdDeposit returns true when payment processor succeeds", () => {
    const stubProcessor = mock<IPaymentProcessor>();
    stubProcessor.holdDeposit.mockReturnValue(true);
    const sut = new PaymentService(50, stubProcessor);

    const result = sut.holdDeposit(1);

    assert.equal(result, true);
});

test("holdDeposit returns false when payment processor fails", () => {
    const stubProcessor = mock<IPaymentProcessor>();
    stubProcessor.holdDeposit.mockReturnValue(false);
    const sut = new PaymentService(50, stubProcessor);

    const result = sut.holdDeposit(1);

    assert.equal(result, false);
});

test("holdDeposit passes the configured deposit amount to the processor", () => {
    const mockProcessor = mock<IPaymentProcessor>();
    mockProcessor.holdDeposit.mockReturnValue(true);
    const sut = new PaymentService(75, mockProcessor);

    sut.holdDeposit(42);

    expect(mockProcessor.holdDeposit).toHaveBeenCalledWith(42, 75);
});
