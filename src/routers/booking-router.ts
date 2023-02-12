import { postBooking } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { bookingSchema } from "@/schemas";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter.all("/*", authenticateToken).post("/", validateBody(bookingSchema), postBooking);

export { bookingRouter };
