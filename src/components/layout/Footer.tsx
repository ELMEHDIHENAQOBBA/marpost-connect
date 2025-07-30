import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import logo from "@/assets/myposte-logo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary-dark to-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="MyPoste Maroc" className="h-12 w-12" />
              <div>
                <span className="text-2xl font-bold">MyPoste</span>
                <span className="text-xl font-medium ml-1">Maroc</span>
              </div>
            </div>
            <p className="text-white/90 mb-6 max-w-md">
              Service postal moderne et digital du Maroc. Envoyez, suivez et recevez vos colis 
              en toute sécurité avec la rapidité et la fiabilité de MyPoste Maroc.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/colis/nouveau" className="text-white/80 hover:text-white transition-colors">
                  Envoi de colis
                </Link>
              </li>
              <li>
                <Link to="/suivi-colis" className="text-white/80 hover:text-white transition-colors">
                  Suivi de colis
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Points de retrait
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-white/80">+212 5 37 71 81 82</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-white/80">contact@myposte.ma</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span className="text-white/80">
                  Avenue Mohammed V<br />
                  Rabat, Maroc
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/80 text-sm">
              © 2024 MyPoste Maroc. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Mentions légales
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                CGV
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;