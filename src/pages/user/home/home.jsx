import React from 'react';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import product1 from '../../../assets/images/img1.png';
import product2 from '../../../assets/images/img2.png';
import product3 from '../../../assets/images/img3.png';
import product4 from '../../../assets/images/1.boot.png';
import product5 from '../../../assets/images/1.jacket.png';
import product6 from '../../../assets/images/1.glove.png';
import product7 from '../../../assets/images/1.bag.png';
import logo1 from '../../../assets/images/INOXTO.png';
import logo2 from '../../../assets/images/CAIRBULL.png';
import logo3 from '../../../assets/images/ROCKBROS.png';
import logo4 from '../../../assets/images/WINDBREAKER.jpg';
import helmet from '../../../assets/images/Helmets.jpg'
import jackets from '../../../assets/images/jackets.jpg'
import gloves from '../../../assets/images/Gloves.jpg'
import boots from '../../../assets/images/boots.jpg'
import accessories from '../../../assets/images/accessories.jpg'
import bags from '../../../assets/images/bags.jpg'



const HomePage = () => {
  const products = [
    { id: 1, name: "LZS SMART Fast Flex Pro Helmet", price: "₹1299.00", image: product1 },
    { id: 2, name: "Aero Master Safety Helmet", price: "₹999.00", image: product2 },
    { id: 3, name: "Scale Racer Motorcycle Jacket", price: "₹2799.00", image: product3 },
    { id: 4, name: "Scale Racer motorcycle Jacket", price: "₹2799.00", image: product4 },
    { id: 5, name: "Xtreme Rider's High Boots", price: "₹1599.00", image: product5 },
    { id: 6, name: "Scale Racer motorcycle Jacket", price: "₹2799.00", image: product6 },
    { id: 7, name: "Scale Racer motorcycle Jacket", price: "₹2799.00", image: product7 }
  ];

  const categories = [
    { name: "Helmets", image: helmet },
    { name: "Jackets", image: jackets },
    { name: "Gloves", image: gloves },
    { name: "Boots", image: boots },
    { name: "Accessories", image: accessories },
    { name: "Bags", image: bags },
  ];

  return (
    <div className="font-sans text-gray-800 leading-relaxed bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">   
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 animate-fade-in-down">FEATURED PRODUCTS</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in-up">
            Explore our wide range of cycling gear categories to find exactly what you need!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py- bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-16">
          <div className="flex justify-around items-center flex-wrap">
            {[logo1, logo2, logo3, logo4].map((logo, index) => (
              <img 
                key={index} 
                src={logo} 
                alt={`Brand logo ${index + 1}`} 
                className="max-w-[110px] h-auto m-4 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110" 
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;