import { Link } from 'react-router-dom';
import logo from '../assets/rentease-logo.jpg'; // Make sure path is correct

function Landing() {
  return (
    <div className="h-screen w-full bg-gradient-to-r from-red-500 to-orange-400 flex items-center justify-center text-white">
      
      <div className="flex flex-col items-center text-center px-6">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="RentEase Logo"
            className="h-20 w-20 rounded-full shadow-lg mb-3"
          />
          <h1 className="text-4xl font-bold">RentEase</h1>
        </div>

        {/* Tagline */}
        <h2 className="text-5xl font-extrabold mb-4 drop-shadow-lg animate-pulse">
          Simplify Renting
        </h2>
        <p className="text-lg mb-8 max-w-md text-white/90">
          A seamless property rental experience for landlords and tenants.
          Manage, track, and connect — all in one place.
        </p>

        {/* Call to Action */}
        <Link to="/signup">
          <button className="bg-white text-red-500 font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-red-100 hover:scale-105 transition duration-300 ease-in-out">
            Get Started
          </button>
        </Link>

        {/* Footer */}
        <p className="mt-10 text-sm text-white/80">
          © {new Date().getFullYear()} RentEase. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Landing;

