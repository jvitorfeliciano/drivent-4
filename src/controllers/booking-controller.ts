import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Booking } from "@prisma/client";
import { Response } from "express";
import httpStatus from "http-status";

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const roomData = req.body as Pick<Booking, "roomId">;

  try {
    const { id: bookingId } = await bookingService.postBooking(userId, roomData.roomId);

    res.status(httpStatus.OK).send({ bookingId });
  } catch (err) {
    if (err.name === "notFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
