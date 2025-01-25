import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">

      {/* Main Content */}
      <h1 className="text-4xl font-bold text-center my-8">Contact Us</h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <p className="text-sm mb-6">
            IF YOU GOT ANY QUESTIONS
            <br />
            PLEASE DO NOT HESITATE TO SEND US A MESSAGE
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500"
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500"
            />
            
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500"
            />
            
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500"
            />
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 rounded transition duration-200"
            >
              Send
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <h2 className="text-xl text-green-500">Get in touch with us</h2>
          <p className="text-gray-400">via phone, email, or connect with us on social media.</p>

          <div className="grid grid-cols-3 gap-8">
            {/* Phone */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full border border-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="text-sm">Call</p>
              <p className="text-xs text-gray-400">+919921445614</p>
            </div>

            {/* Location */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full border border-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-sm">Find</p>
              <p className="text-xs text-gray-400">vyttila, Ernakulam, kerala</p>
            </div>

            {/* Email */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full border border-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm">Mail</p>
              <p className="text-xs text-gray-400">pedalquest@gmail.com</p>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-green-500">Follow Our Ride</h3>
            <div className="flex gap-4 justify-center">
              {['facebook', 'twitter', 'instagram'].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition duration-200"
                >
                  <span className="sr-only">{social}</span>
                  <i className={`fab fa-${social}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="h-64 bg-zinc-800 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.443013738726!2d76.31896731479055!3d9.97645729288385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d514abec6bf%3A0xbd582caa5844192!2sVyttila%2C%20Ernakulam%2C%20Kerala!5e0!3m2!1sen!2sin!4v1628151062095!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Footer Logo */}
      <div className="mt-16 text-center">
        <p className="text-gray-400">PedalQuest Where Your Riding Adventure Begins</p>
      </div>
    </div>
  );
}