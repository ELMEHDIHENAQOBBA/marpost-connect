import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, Shield, MapPin, Truck, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Home = () => {
  const features = [
    {
      icon: <Package className="h-8 w-8 text-primary" />,
      title: "Envoi Simple",
      description: "Envoyez vos colis en quelques clics avec notre interface intuitive"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Suivi en Temps Réel",
      description: "Suivez votre colis à chaque étape de son voyage"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Sécurisé",
      description: "Vos données et vos colis sont protégés avec nos protocoles de sécurité"
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Couverture Nationale",
      description: "Livraison dans toutes les villes et quartiers du Maroc"
    },
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Livraison Rapide",
      description: "Service de livraison express pour vos envois urgents"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Garantie Qualité",
      description: "Service client dédié et garantie de satisfaction"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-primary-dark py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Votre Service Postal
            <span className="block text-white/90">Nouvelle Génération</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Envoyez, suivez et recevez vos colis partout au Maroc avec MyPoste Maroc. 
            Simple, rapide et sécurisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/colis/nouveau">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4">
                <Package className="mr-2 h-5 w-5" />
                Envoyer un Colis
              </Button>
            </Link>
            <Link to="/suivi-colis">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4"
              >
                Suivre mon Colis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-accent/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pourquoi Choisir MyPoste Maroc ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez les avantages de notre service postal moderne et digital
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-border/50">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-accent rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à Commencer ?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Rejoignez des milliers de clients qui font confiance à MyPoste Maroc
          </p>
          <Link to="/register-client">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4">
              Créer mon Compte
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;