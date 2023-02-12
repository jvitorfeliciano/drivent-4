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
  });
}

async function updateRoomCapacity(id: number) {
  return await prisma.room.update({
    where: {
      id,
    },
    data: {
      capacity: {
        decrement: 1,
      },
    },
  });
}
const bookingRepository = {
  createBooking,
  findRoomById,
  updateRoomCapacity
};

export default bookingRepository;
