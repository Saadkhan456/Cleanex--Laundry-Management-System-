import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const LandingPage = () => {
  const carouselImages = [
    "https://static.vecteezy.com/system/resources/previews/013/455/121/non_2x/laundry-room-with-washing-machine-clean-clothes-free-vector.jpg",
    "https://wallpaperwaifu.com/wp-content/uploads/2023/02/rainy-night-at-the-laundromat-thumb.jpg",
    "https://static.vecteezy.com/system/resources/thumbnails/024/701/243/original/waiting-laundry-lo-fi-animation-housework-laundromat-woman-in-launderette-with-cat-animated-2d-cartoon-characters-chill-lofi-music-4k-vaporwave-background-alpha-channel-transparency-video.jpg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handlePrev = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen); // Toggle menu open/close

  return (
    <div className="font-serif">
      {/* Navbar */}
      <nav className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="https://c.tenor.com/wqkZirVGGe8AAAAj/laundry-weekend.gif"
                alt="Laundry Logo"
                className="h-12"
              />
              <span className="text-3xl font-bold text-white">Cleanex</span>
            </div>
            <ul className="hidden md:flex space-x-6 text-center">
              <li>
                <a href="#home" className="hover:text-gray-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-gray-300">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gray-300">
                  Services
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-gray-300">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-gray-300">
                  Pricing
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-gray-300">
                  User
                </Link>
              </li>
              <li>
                <Link to="/admin-login">
                  <button>Admin</button>
                </Link>
              </li>
            </ul>
            {/* Hamburger Menu for Mobile */}
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-white">
                {menuOpen ? (
                  <FontAwesomeIcon icon={faTimes} />
                ) : (
                  <FontAwesomeIcon icon={faBars} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black text-white p-6">
          <ul>
            <li>
              <a href="#home" className="block py-2 hover:text-gray-300">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="block py-2 hover:text-gray-300">
                About
              </a>
            </li>
            <li>
              <a href="#services" className="block py-2 hover:text-gray-300">
                Services
              </a>
            </li>
            <li>
              <a href="#gallery" className="block py-2 hover:text-gray-300">
                Gallery
              </a>
            </li>
            <li>
              <a href="#pricing" className="block py-2 hover:text-gray-300">
                Pricing
              </a>
            </li>
            <li>
              <Link to="/login" className="block py-2 hover:text-gray-300">
                User
              </Link>
            </li>
            <li>
              <Link to="/admin-login" className="hover:text-gray-300">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Carousel */}
      <div className="relative bg-black">
        <div className="overflow-hidden h-96">
          <img
            src={carouselImages[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            className="w-full h-96 object-cover transition-all duration-700 ease-in-out"
          />
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 text-white text-center px-4 transition-opacity duration-700`}
          >
            {currentSlide === 0 && (
              <>
                <h2 className="text-4xl font-bold">Fresh & Clean Laundry</h2>
                <p className="mt-2 text-lg">
                  Experience premium laundry care for your everyday needs.
                </p>
              </>
            )}
            {currentSlide === 1 && (
              <>
                <h2 className="text-4xl font-bold">Rainy Day? No Problem!</h2>
                <p className="mt-2 text-lg">
                  Stay dry while we handle your laundry with care.
                </p>
              </>
            )}
            {currentSlide === 2 && (
              <>
                <h2 className="text-4xl font-bold">Relax & Let Us Work</h2>
                <p className="mt-2 text-lg">
                  Enjoy your time while we take care of your clothes.
                </p>
              </>
            )}
          </div>
        </div>
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 px-3 py-1 rounded-lg"
        >
          &#8249;
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 px-3 py-1 rounded-lg"
        >
          &#8250;
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-gray-400 hover:bg-gray-200"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h3 className="text-5xl font-bold text-gray-900">About Us</h3>
              <p className="mt-6 text-gray-600 text-xl">
                At Cleanex, we provide premium laundry and dry cleaning services
                tailored to your needs. With years of experience, we ensure that
                your garments are treated with the utmost care and attention,
                preserving their quality.
              </p>
              <p className="mt-6 text-gray-600 text-xl">
                Whether it's a quick wash or delicate cleaning, Cleanex is your
                trusted partner in laundry care.
              </p>
            </div>
            <div className="lg:w-1/2 mt-6 lg:mt-0 text-center">
              <img
                src="https://cdn.dribbble.com/users/519645/screenshots/10584749/media/979920acba09cfb55d7d98770fce2e93.gif"
                alt="About Us Image"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-10 bg-white text-center">
        <h3 className="text-3xl font-bold">Our Services</h3>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="relative max-w-sm mx-auto">
            <img
              src="https://www.awesomeinventions.com/wp-content/uploads/2015/11/stitch-laundry.gif"
              alt="Laundry Service"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-4 text-lg font-semibold rounded-lg">
              <h4 className="text-xl font-bold">Laundry</h4>
              <p className="mt-2">
                Professional washing, drying, and folding services.
              </p>
            </div>
          </div>
          <div className="relative max-w-sm mx-auto">
            <img
              src="https://media.baamboozle.com/uploads/images/1875014/ad1e0f43-ab03-4e2c-bdb8-eec031b4e74f.gif"
              alt="Ironing Service"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-4 text-lg font-semibold rounded-lg">
              <h4 className="text-xl font-bold">Ironing</h4>
              <p className="mt-2">
                Expert ironing for crisp, wrinkle-free clothes.
              </p>
            </div>
          </div>
          <div className="relative max-w-sm mx-auto">
            <img
              src="https://i.pinimg.com/originals/de/10/b5/de10b5360fc593908212a0fc193addba.gif"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-4 text-lg font-semibold rounded-lg">
              <h4 className="text-xl font-bold">Wash & Iron</h4>
              <p className="mt-2">
                Complete care for your clothes, both washing and ironing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div id="gallery" className="py-16 bg-gray-100 text-center">
        <h3 className="text-3xl font-bold text-gray-800">Gallery</h3>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="relative group">
            <img
              src="https://thearchitecturedesigns.com/wp-content/uploads/2019/11/11-Laundryshop-Inerior.jpg"
              alt="Laundry Room"
              className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
              <p className="text-lg font-semibold">Laundry Room</p>
            </div>
          </div>
          <div className="relative group">
            <img
              src="https://fabricaresystems.com/wp-content/uploads/2021/04/dry-cleaning-machine-nathan-dumlao.jpg"
              alt="Dry Cleaning Service"
              className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
              <p className="text-lg font-semibold">Dry Cleaning Service</p>
            </div>
          </div>
          <div className="relative group">
            <img
              src="https://321zips.com/wp-content/uploads/2023/06/shutterstock_231456493-1024x680.jpg"
              className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
              <p className="text-lg font-semibold">Ironing Clothes</p>
            </div>
          </div>
          <div className="relative group">
            <img
              src="https://tse4.mm.bing.net/th?id=OIP.HL-ezUwkzLW5CcqxsJTOggHaEK&pid=Api&P=0&h=220"
              alt="Laundry Service Staff"
              className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
              <p className="text-lg font-semibold">Laundry Service Staff</p>
            </div>
          </div>
          <div className="relative group">
            <img
              src="https://img.freepik.com/premium-photo/guy-using-phone-listening-music-while-doing-laundry-laundromat_116547-67967.jpg"
              alt="Dry Cleaning Process"
              className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
              <p className="text-lg font-semibold">Free Wifi</p>
            </div>
          </div>
          <div className="relative group">
            <img
              src="https://t3.ftcdn.net/jpg/04/03/21/94/360_F_403219423_xh099IbwZ5NC4ivQCURSDo0c6wAkaMpN.jpg"
              alt="Ironing Clothes"
              className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
              <p className="text-lg font-semibold">24/7 open</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-10 bg-white text-center">
        <h3 className="text-3xl font-bold">Pricing</h3>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          <div className="max-w-sm p-6 bg-gray-100 rounded-lg mx-auto">
            <h4 className="text-xl font-bold">Washing Only</h4>
            <p className="mt-2 text-gray-600">
              1. Basic clothes (T-shirts, shirts, jeans):
              <br /> ₹50 - ₹150 per item
            </p>
            <p className="mt-4 text-gray-600">
              2. Delicate items (silk, wool):
              <br /> ₹200 - ₹300 per item
            </p>
            <p className="mt-4 text-gray-600">
              3. Large items (blankets, comforters):
              <br /> ₹500 - ₹1,000 per item
            </p>
          </div>
          <div className="max-w-sm p-6 bg-gray-100 rounded-lg mx-auto">
            <h4 className="text-xl font-bold">Ironing Only</h4>
            <p className="mt-2 text-gray-600">
              1. Basic clothes (T-shirts, shirts, pants):
              <br /> ₹30 - ₹100 per item
            </p>
            <p className="mt-4 text-gray-600">
              2. Delicate items (silk, wool):
              <br /> ₹150 - ₹200 per item
            </p>
            <p className="mt-4 text-gray-600">
              3. Large items (sheets, pillowcases):
              <br /> ₹150 - ₹250 per item
            </p>
          </div>
          <div className="max-w-sm p-6 bg-gray-100 rounded-lg mx-auto">
            <h4 className="text-xl font-bold">Washing + Ironing:</h4>
            <p className="mt-2 text-gray-600">
              Basic clothes (T-shirts, shirts, pants):
              <br /> ₹100 - ₹250 per item
            </p>
            <p className="mt-4 text-gray-600">
              Delicate items (silk, wool):
              <br /> ₹300 - ₹450 per item
            </p>
            <p className="mt-4 text-gray-600">
              Large items (blankets, comforters):
              <br /> ₹600 - ₹1,500 per item
            </p>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm md:text-base">
              © {new Date().getFullYear()} Cleanex. All Rights Reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="hover:text-gray-400">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-400">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-400">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
