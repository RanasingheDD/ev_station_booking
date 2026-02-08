import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api_config';

export default function ContactUs(): React.ReactElement {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Send data to the real backend
      await axios.post(`${API_URL}/messages`, formData);
      
      alert('Thank you for contacting us! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' }); // Clear form

    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center px-6 py-25">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
        Contact <span className="text-green-400">Us</span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#1A2236] p-8 rounded-2xl w-full max-w-lg shadow-lg"
      >
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Name</label>
          <input
            type="text"
            name="name"
            title="Please enter your name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#0B0F19] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            name="email"
            title="Please enter a valid email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#0B0F19] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Message</label>
          <textarea
            name="message"
            value={formData.message}
            title="Please enter your message"
            onChange={handleChange}
            rows={5}
            className="w-full p-3 rounded-lg bg-[#0B0F19] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-semibold rounded-lg transition flex justify-center items-center ${
            loading 
              ? "bg-green-400/50 cursor-not-allowed text-black/70" 
              : "bg-green-400 text-black hover:bg-green-500"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>

      <p className="mt-8 text-gray-400 text-sm text-center">
        Or reach us at: <span className="text-green-400">info@nextgentechsolution.com</span>
      </p>
    </div>
  );
}