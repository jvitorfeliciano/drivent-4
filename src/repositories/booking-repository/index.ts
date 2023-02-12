import { prisma } from "@/config";

async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    select: {
      id: true,
    },
  });
}

async function findRoomById(id: number) {
  return await prisma.room.findUnique({
    where: {
      id,
    },
    include: {
      Booking: true,
    },
  });
}

async function findBooking(userId: number, bookingId: number) {
  return await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },
  });
}

async function findBookingByUserId(userId: number) {
  return await prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function updateBooking(bookingId: number, roomId: number) {
  return await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    },
    select: {
      id: true,
    },
  });
}

const bookingRepository = {
  createBooking,
  findRoomById,
  findBooking,
  updateBooking,
  findBookingByUserId,
};

export default bookingRepository;
