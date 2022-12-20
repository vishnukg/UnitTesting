import { test, expect } from "vitest";
import { mock } from "vitest-mock-extended";
import { IMaitreD, MaitreD, MaitreDLogDecorator, Reservation } from ".";
import { ILogger } from "../cross-cutting";
import { ReservationRepository } from "../repository";

test("getTotalCapacity invokes getTotalCapacity from the actual MaitreD object", () => {
  //Arrange
  const mockMaitreD = mock<IMaitreD>();
  const stubLogger = mock<ILogger>();
  const sut = new MaitreDLogDecorator(mockMaitreD, stubLogger);

  //Act
  sut.getTotalCapacity();

  //Assert
  expect(mockMaitreD.getTotalCapacity).toHaveBeenCalled();
});

test("CanReserve when called invokes logger with message", () => {
  //Arrange
  const capacity = 10;
  const reservationRepo = new ReservationRepository();
  const maitreD = new MaitreD(capacity, reservationRepo);
  const mockLogger = mock<ILogger>();
  const reservation: Reservation = {
    id: 1,
    Date: "12/12/2022",
    Quantity: 3,
  };
  const sut = new MaitreDLogDecorator(maitreD, mockLogger);

  //Act
  sut.canReserve(reservation);

  //Assert
  expect(mockLogger.Log).toHaveBeenCalledWith(
    "Checking if the reservation can be made"
  );
});
