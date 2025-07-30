import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Search, User, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/myposte-logo.png";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gradient-to-r from-primary to-primary-dark shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <img src={logo} alt="MyPoste Maroc" className="h-10 w-10" />
            <div className="text-white">
              <span className="text-xl font-bold">MyPoste</span>
              <span className="text-lg font-medium ml-1">Maroc</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "bg-white/20 text-white"
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/suivi-colis"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActive("/suivi-colis")
                  ? "bg-white/20 text-white"
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Suivi de colis</span>
            </Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <User className="h-4 w-4 mr-2" />
                Connexion
              </Button>
            </Link>
            <Link to="/register-client">
              <Button className="bg-white text-primary hover:bg-white/90">
                Inscription
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-white hover:bg-white/10"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/")
                    ? "bg-white/20 text-white"
                    : "text-white/90 hover:bg-white/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/suivi-colis"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
                  isActive("/suivi-colis")
                    ? "bg-white/20 text-white"
                    : "text-white/90 hover:bg-white/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="h-4 w-4" />
                <span>Suivi de colis</span>
              </Link>
              <div className="pt-4 border-t border-white/20 space-y-3">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                    <User className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
                <Link to="/register-client" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-white text-primary hover:bg-white/90">
                    Inscription
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;