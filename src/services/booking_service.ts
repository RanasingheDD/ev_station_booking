import axios from 'axios';
import { API_URL } from '../config/api_config';
import { v4 as uuidv4 } from 'uuid';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export interface Booking {
    id: string;
    stationId: string;
    stationName?: string;
    chargerId: string;
    startTime: string; // ISO string
    endTime: string; // ISO string
    userId?: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    pointsPaid?: number;
    priceLKR?: number;
}

// Mock Data (fallback)
const mockBookings: Booking[] = [
    {
        id: '1',
        stationId: 'station-123',
        stationName: 'Demo Station',
        chargerId: 'charger-A',
        startTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
        endTime: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
        status: 'CONFIRMED',
        pointsPaid: 150,
        priceLKR: 150
    }
];

// If API is available, call server endpoints. Otherwise fallback to mock.
export const fetchUserBookings = async (): Promise<Booking[]> => {
    try {
        const res = await axios.get(`${API_URL}/bookings/me`, { headers: authHeader() });
        return res.data;
    } catch (err) {
        console.warn('fetchUserBookings: API unavailable, returning mock data', err);
        return mockBookings;
    }
};

export const fetchBookingById = async (id: string): Promise<Booking | null> => {
    try {
        const res = await axios.get(`${API_URL}/bookings/${id}`, { headers: authHeader() });
        return res.data;
    } catch (err) {
        console.warn('fetchBookingById: API unavailable, searching mock', err);
        return mockBookings.find((b) => b.id === id) || null;
    }
};

export const cancelBooking = async (id: string) => {
    try {
        const res = await axios.post(`${API_URL}/bookings/${id}/cancel`, {}, { headers: authHeader() });
        return res.data;
    } catch (err) {
        console.warn('cancelBooking: API unavailable, updating mock', err);
        const b = mockBookings.find((m) => m.id === id);
        if (b) {
            b.status = 'CANCELLED';
            return { success: true };
        }
        return { success: false, message: 'Booking not found' };
    }
};

export const checkAvailability = async (
    stationId: string,
    chargerId: string,
    startTime: string,
    endTime: string
): Promise<{ available: boolean; message?: string }> => {
    try {
        const res = await axios.get(`${API_URL}/bookings/check`, {
            params: { stationId, chargerId, startTime, endTime },
            headers: authHeader(),
        });
        return res.data;
    } catch (err) {
        // Fallback to basic mock overlap check
        const newStart = new Date(startTime).getTime();
        const newEnd = new Date(endTime).getTime();
        const conflicting = mockBookings.find((b) => b.stationId === stationId && b.chargerId === chargerId && b.status !== 'CANCELLED' && newStart < new Date(b.endTime).getTime() && newEnd > new Date(b.startTime).getTime());
        if (conflicting) {
            return { available: false, message: 'Slot unavailable (mock fallback)' };
        }
        return { available: true };
    }
};

export const createBooking = async (payload: any) => {
    try {
        const res = await axios.post(`${API_URL}/bookings`, payload, { headers: { 'Content-Type': 'application/json', ...authHeader() } });
        return res.data;
    } catch (err) {
        console.warn('createBooking: API unavailable, creating mock booking', err);
        const newBooking: Booking = {
            id: uuidv4(),
            stationId: payload.stationId,
            stationName: payload.stationName || 'Mock Station',
            chargerId: payload.chargerId,
            startTime: payload.startTime,
            endTime: payload.endTime,
            status: 'CONFIRMED',
            pointsPaid: payload.pointsPaid,
            priceLKR: payload.priceLKR,
        };
        mockBookings.push(newBooking);
        return { success: true, bookingId: newBooking.id };
    }
};
