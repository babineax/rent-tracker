import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logo from "../assets/rentease-logo.jpg";

function Landing() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-400 text-white px-4">
      <Card className="w-full max-w-xl bg-transparent shadow-none border-none text-center">
        <CardContent className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <img src={logo} alt="RentEase Logo" className="h-20 w-20 rounded-full shadow mb-2" />
            <h1 className="text-4xl font-bold tracking-tight">RentEase</h1>
          </div>

          {/* Headline */}
          <h2 className="text-5xl font-extrabold animate-pulse drop-shadow-lg">
            Simplify Renting
          </h2>

          {/* Subtext */}
          <p className="text-base text-white/90 max-w-md">
            A seamless property rental experience for landlords and tenants. Manage, track, and connect — all in one place.
          </p>

          {/* Call to Action */}
          <Link to="/signup">
            <Button size="lg" className="bg-white text-red-500 hover:bg-red-100 font-semibold">
              Get Started
            </Button>
          </Link>

          {/* Footer */}
          <p className="text-sm text-white/80 mt-8">
            © {new Date().getFullYear()} RentEase. All rights reserved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Landing;


