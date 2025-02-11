import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import aboutUsBanner from "../../../assets/images/img9.jpg";
import sideImg1 from "../../../assets/images/image cycle cover.jpg";
import sideImg2 from "../../../assets/images/img10.jpg";
import sideImg3 from "../../../assets/images/img8.jpg";
import sideImg4 from "../../../assets/images/image3.jpg";
import sideImg5 from "../../../assets/images/homeimg.jpg";

const AboutUs = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-black bg-opacity-90 text-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold">
                PEDALQUEST
              </Link>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-gray-300"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link to="/user/store" className="hover:text-gray-300">
                Home
              </Link>
              <Link to="/user/store" className="hover:text-gray-300">
                Shop
              </Link>
              {/* <Link to="/user/about" className="hover:text-gray-300">
                About
              </Link> */}
              <Link to="/user/contactpage" className="hover:text-gray-300">
                Contact
              </Link>
              {/* <Link to="/login" className="hover:text-gray-300">
                Login
              </Link> */}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black">
              <Link to="/user/store" className="block px-3 py-2 hover:text-gray-300">
                Home
              </Link>
              <Link to="/user/store" className="block px-3 py-2 hover:text-gray-300">
                Shop
              </Link>
              <Link to="/user/about" className="block px-3 py-2 hover:text-gray-300">
                About
              </Link>
              <Link
                to="/user/contact"
                className="block px-3 py-2 hover:text-gray-300"
              >
                Contact
              </Link>
              {/* <Link to="/login" className="block px-3 py-2 hover:text-gray-300">
                Login
              </Link> */}
            </div>
          </div>
        )}
      </nav>

      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={aboutUsBanner}
            alt="Mountain biker jumping"
            className="w-full h-full object-cover filter grayscale"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative flex items-center justify-center h-full text-white">
          <h1 className="text-5xl md:text-7xl font-bold text-center">
            WELCOME TO PEDALQUEST
          </h1>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src={sideImg1}
                alt="Mountain biker"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-[200px] font-bold text-gray-200 leading-none">
                2019
              </h2>
              <h3 className="text-5xl font-bold mb-6">ABOUT US</h3>
              <p className="text-gray-600 text-lg">
                PedalQuest was established with a vision to create a unique
                cycling community. We began as a small store with big dreams,
                and our passion for cycling has driven us forward. Today, we're
                proud to serve cycling enthusiasts with top-quality bikes and
                gear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-100 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-4xl font-bold mb-6">
                Our Mission and Vision
              </h3>
              <p className="text-gray-600 text-lg">
                To promote clean and safe cycling gear for both basic and
                professional riders, making sure that every cyclist has access
                to quality equipment and a supportive community. We strive to
                make cycling accessible and enjoyable for everyone.
              </p>
            </div>
            <div>
              <img
                src={sideImg2}
                alt="Cyclist on trail"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold mb-12">
            Community and Social Responsibility
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[sideImg3, sideImg4, sideImg5].map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`Image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg shadow-xl mb-4"
                />
              </div>
            ))}
            <div className="md:col-span-3">
              <p className="text-gray-600 text-lg">
                At PedalQuest, we're committed to giving back to the community.
                We organize regular cycling events, support local cycling
                initiatives, and promote environmental sustainability through
                cycling. Our community programs help make cycling accessible to
                everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="hover:text-gray-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gray-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-gray-300">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">About Us</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-gray-300">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-gray-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-gray-300">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/facebook" className="hover:text-gray-300">
                  Facebook
                </Link>
              </li>
              <li>
                <Link to="/instagram" className="hover:text-gray-300">
                  Instagram
                </Link>
              </li>
              <li>
                <Link to="/twitter" className="hover:text-gray-300">
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Newsletter</h4>
            <p className="mb-4">
              Subscribe to get updates on new products and special offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 text-black rounded-l"
              />
              <button className="px-4 py-2 bg-white text-black rounded-r hover:bg-gray-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            © 2024 PedalQuest. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
