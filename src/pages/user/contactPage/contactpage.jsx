import { useState } from 'react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10 digits required)';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      toast.success('Message sent successfully!');
      console.log(formData);

      // Clear form after successful submission
      setFormData({ name: '', email: '', phone: '', message: '' });
      setErrors({});
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-center my-8">Contact Us</h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <p className="text-sm mb-6">
            IF YOU GOT ANY QUESTIONS <br />
            PLEASE DO NOT HESITATE TO SEND US A MESSAGE
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500"
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

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
              <p className="text-sm">Call</p>
              <p className="text-xs text-gray-400">+919921445614</p>
            </div>

            {/* Location */}
            <div className="text-center">
              <p className="text-sm">Find</p>
              <p className="text-xs text-gray-400">Vyttila, Ernakulam, Kerala</p>
            </div>

            {/* Email */}
            <div className="text-center">
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
        <p className="text-gray-400">PedalQuest - Where Your Riding Adventure Begins</p>
      </div>
    </div>
  );
}
