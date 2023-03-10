import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Booking } from "@prisma/client";
import { Response } from "express";
import httpStatus from "http-status";

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const roomData = req.body as Pick<Booking, "roomId">;

  try {
    const { id } = await bookingService.postBooking(userId, roomData.roomId);

    res.status(httpStatus.OK).send({ bookingId: id });
  } catch (err) {
    if (err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (err.name === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const roomData = req.body as Pick<Booking, "roomId">;
  const bookingIdParams = Number(req.params.bookingId);

  try {
    const { id } = await bookingService.updateBooking(userId, roomData.roomId, bookingIdParams);

    res.status(httpStatus.OK).send({ bookingId: id });
  } catch (err) {
    if (err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (err.name === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}

export async function getUserBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  try {
    const booking = await bookingService.getUserBooking(userId);

    res.status(httpStatus.OK).send(booking);
  } catch (err) {
    if (err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } 
  }
}
