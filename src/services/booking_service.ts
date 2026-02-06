import { v4 as uuidv4 } from 'uuid';

export interface Booking {
    id: string;
    stationId: string;
    chargerId: string;
    startTime: string; // ISO string
    endTime: string; // ISO string
    userId: string;
    status: 'confirmed' | 'cancelled';
    totalAmount: number;
}

// Mock Data: Some pre-existing bookings
const mockBookings: Booking[] = [
    {
        id: '1',
        stationId: 'station-123', // Example station ID
        chargerId: 'charger-A',   // Example charger ID
        startTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(), // Today 2:00 PM
        endTime: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),   // Today 3:00 PM
        userId: 'user-xyz',
        status: 'confirmed',
        totalAmount: 15.00
    },
    {
        id: '2',
        stationId: 'station-123',
        chargerId: 'charger-A',
        startTime: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(), // Today 4:00 PM
        endTime: new Date(new Date().setHours(17, 30, 0, 0)).toISOString(),  // Today 5:30 PM
        userId: 'other-user',
        status: 'confirmed',
        totalAmount: 22.50
    }
];

export const checkAvailability = async (
    stationId: string,
    chargerId: string,
    startTime: string,
    endTime: string
): Promise<{ available: boolean; message?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newStart = new Date(startTime).getTime();
    const newEnd = new Date(endTime).getTime();

    const conflictingBooking = mockBookings.find(b => {
        if (b.stationId !== stationId || b.chargerId !== chargerId || b.status === 'cancelled') {
            return false;
        }
        const existingStart = new Date(b.startTime).getTime();
        const existingEnd = new Date(b.endTime).getTime();

        // Overlap condition
        return newStart < existingEnd && newEnd > existingStart;
    });

    if (conflictingBooking) {
        const conflictStart = new Date(conflictingBooking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const conflictEnd = new Date(conflictingBooking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
            available: false,
            message: `Slot unavailable. Booked from ${conflictStart} to ${conflictEnd}`
        };
    }

    return { available: true };
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'status'>): Promise<{ success: boolean; bookingId?: string; message?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Double check availability (good practice)
    const availability = await checkAvailability(booking.stationId, booking.chargerId, booking.startTime, booking.endTime);
    if (!availability.available) {
        return { success: false, message: availability.message };
    }

    const newBooking: Booking = {
        ...booking,
        id: uuidv4(),
        status: 'confirmed'
    };

    mockBookings.push(newBooking);
    console.log("Booking created:", newBooking); // For debugging
    return { success: true, bookingId: newBooking.id };
};
