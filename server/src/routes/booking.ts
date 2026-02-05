import { Router, Request, Response } from 'express';
import { HotelModel } from '../database/models/Hotel';
import { RoomTypeModel } from '../database/models/RoomType';
import { BookingModel } from '../database/models/Booking';
import { TicketModel } from '../database/models/Ticket';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/hotels', async (_req: Request, res: Response) => {
  try {
    const hotels = await HotelModel.getAllWithRoomTypes();
    res.json({ hotels });
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({ error: 'Failed to get hotels' });
  }
});

router.get('/hotels/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid hotel ID' });
      return;
    }

    const hotel = await HotelModel.getByIdWithRoomTypes(id);
    if (!hotel) {
      res.status(404).json({ error: 'Hotel not found' });
      return;
    }

    res.json({ hotel });
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({ error: 'Failed to get hotel' });
  }
});

router.get('/hotels/:id/rooms', async (req: Request, res: Response) => {
  try {
    const hotelId = parseInt(req.params.id);
    if (isNaN(hotelId)) {
      res.status(400).json({ error: 'Invalid hotel ID' });
      return;
    }

    const rooms = await RoomTypeModel.getByHotel(hotelId);
    res.json({ room_types: rooms });
  } catch (error) {
    console.error('Get hotel rooms error:', error);
    res.status(500).json({ error: 'Failed to get room types' });
  }
});

router.get('/hotels/:id/rooms/:roomTypeId/availability', async (req: Request, res: Response) => {
  try {
    const hotelId = parseInt(req.params.id);
    const roomTypeId = parseInt(req.params.roomTypeId);
    const { checkIn, checkOut } = req.query;

    if (isNaN(hotelId) || isNaN(roomTypeId)) {
      res.status(400).json({ error: 'Invalid hotel or room type ID' });
      return;
    }

    if (!checkIn || !checkOut) {
      res.status(400).json({ error: 'Check-in and check-out dates are required' });
      return;
    }

    const roomType = await RoomTypeModel.getById(roomTypeId);
    if (!roomType || roomType.hotel_id !== hotelId) {
      res.status(404).json({ error: 'Room type not found for this hotel' });
      return;
    }

    const availableRooms = await RoomTypeModel.checkAvailability(
      roomTypeId,
      checkIn as string,
      checkOut as string
    );

    res.json({
      room_type: roomType,
      available_rooms: availableRooms,
      check_in: checkIn,
      check_out: checkOut
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

router.post('/bookings', requireAuth, async (req: Request, res: Response) => {
  try {
    const { booking_type, check_in, check_out, room_type_id, ticket_id, quantity } = req.body;

    if (!booking_type || (booking_type !== 'ticket' && booking_type !== 'hotel')) {
      res.status(400).json({ error: 'Invalid booking type' });
      return;
    }

    let total_price = 0;
    const parsedQuantity = Number(quantity);
    const requestedQuantity =
      Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1;

    if (quantity !== undefined && (!Number.isFinite(parsedQuantity) || parsedQuantity < 1)) {
      res.status(400).json({ error: 'Quantity must be at least 1' });
      return;
    }

    if (booking_type === 'ticket') {
      if (!ticket_id || !quantity) {
        res.status(400).json({ error: 'Ticket ID and quantity are required for ticket bookings' });
        return;
      }

      const ticket = await TicketModel.getById(ticket_id);
      if (!ticket) {
        res.status(404).json({ error: 'Ticket not found' });
        return;
      }

      total_price = ticket.price * requestedQuantity;
    } else {
      if (!room_type_id || !check_in || !check_out) {
        res.status(400).json({ error: 'Room type ID, check-in, and check-out dates are required for hotel bookings' });
        return;
      }

      const roomType = await RoomTypeModel.getById(room_type_id);
      if (!roomType) {
        res.status(404).json({ error: 'Room type not found' });
        return;
      }

      const availableRooms = await RoomTypeModel.checkAvailability(room_type_id, check_in, check_out);
      if (availableRooms < requestedQuantity) {
        res.status(400).json({ error: 'No rooms available for the selected dates' });
        return;
      }

      const checkInDate = new Date(check_in);
      const checkOutDate = new Date(check_out);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

      if (nights < 1) {
        res.status(400).json({ error: 'Check-out date must be after check-in date' });
        return;
      }

      total_price = roomType.price_per_night * nights * requestedQuantity;
    }

    const bookingId = await BookingModel.create({
      user_id: req.user!.id,
      booking_type,
      check_in,
      check_out,
      room_type_id,
      ticket_id,
      quantity: requestedQuantity,
      total_price
    });

    const booking = await BookingModel.getById(bookingId);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.get('/bookings', requireAuth, async (req: Request, res: Response) => {
  try {
    const bookings = await BookingModel.getByUser(req.user!.id);
    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

router.get('/bookings/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid booking ID' });
      return;
    }

    const booking = await BookingModel.getById(id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (booking.user_id !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to get booking' });
  }
});

router.put('/bookings/:id/cancel', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid booking ID' });
      return;
    }

    const booking = await BookingModel.getById(id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (booking.user_id !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    if (booking.status === 'cancelled') {
      res.status(400).json({ error: 'Booking already cancelled' });
      return;
    }

    await BookingModel.updateStatus(id, 'cancelled');
    const updatedBooking = await BookingModel.getById(id);

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;
