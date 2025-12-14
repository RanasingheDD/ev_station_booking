import React, { useState } from 'react';

export default function ContactUs(): React.ReactElement {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center px-6 py-12">
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
            onChange={handleChange}
            rows={5}
            className="w-full p-3 rounded-lg bg-[#0B0F19] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-400 text-black font-semibold rounded-lg hover:bg-green-500 transition"
        >
          Send Message
        </button>
      </form>

      <p className="mt-8 text-gray-400 text-sm text-center">
        Or reach us at: <span className="text-green-400">info@nextgentechsolution.com</span>
      </p>
    </div>
  );
}