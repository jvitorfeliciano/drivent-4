import { forbiddenError, notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function validateEnrollment(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  return enrollment;
}

async function validateTicket(enrollmentId: number) {
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollmentId);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function validateRoom(roomId: number) {
  const room = await bookingRepository.findRoomById(roomId);

  if (!room) {
    throw notFoundError();
  }

  if (room.capacity === 0) {
    throw forbiddenError();
  }
}

async function postBooking(userId: number, roomId: number) {
  const enrollment = await validateEnrollment(userId);
  await validateTicket(enrollment.id);
  await validateRoom(roomId);

  const booking = await bookingRepository.createBooking(userId, roomId);

  await bookingRepository.updateRoomCapacity(roomId);

  return booking;
}

const bookingService = {
  postBooking,
};

export default bookingService;