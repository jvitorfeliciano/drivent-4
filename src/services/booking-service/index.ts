import { forbiddenError, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function validateEnrollment(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }
  return enrollment;
}

async function validateTicket(enrollmentId: number) {
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollmentId);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }
}

async function validateRoom(roomId: number) {
  const room = await bookingRepository.findRoomById(roomId);

  if (!room) {
    throw notFoundError();
  }

  if (room.Booking.length === room.capacity) {
    throw forbiddenError();
  }
}

async function validateUserBooking(userId: number, bookingId: number) {
  const booking = await bookingRepository.findBooking(userId, bookingId);

  if (!booking) {
    throw forbiddenError();
  }
}

async function postBooking(userId: number, roomId: number) {
  const enrollment = await validateEnrollment(userId);
  await validateTicket(enrollment.id);
  await validateRoom(roomId);

  const booking = await bookingRepository.createBooking(userId, roomId);

  return booking;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  await validateUserBooking(userId, bookingId);
  await validateRoom(roomId);

  const booking = await bookingRepository.updateBooking(bookingId, roomId);

  return booking;
}

async function getUserBooking(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

const bookingService = {
  postBooking,
  updateBooking,
  getUserBooking,
};

export default bookingService;
