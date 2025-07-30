import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Package, Plus, Eye, Clock, CheckCircle, Truck, User, Settings } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Colis {
  id: string;
  code: string;
  destinataire: string;
  destination: string;
  status: "en_attente" | "collecte" | "en_transit" | "en_livraison" | "livre";
  dateEnvoi: string;
  poids: string;
  tarif: number;
}

const ClientDashboard = () => {
  const [colis, setColis] = useState<Colis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("colis");
  const { toast } = useToast();

  useEffect(() => {
    loadColis();
  }, []);

  const loadColis = async () => {
    try {
      // TODO: API GET /api/colis/by-client/:id
      // const response = await axios.get('/api/colis/by-client/' + clientId);
      // setColis(response.data);

      // Données simulées
      setTimeout(() => {
        const mockColis: Colis[] = [
          {
            id: "1",
            code: "PM20250129001234",
            destinataire: "Fatima Alaoui",
            destination: "Casablanca, Maarif",
            status: "en_transit",
            dateEnvoi: "2024-01-29",
            poids: "2.5 kg",
            tarif: 45
          },
          {
            id: "2",
            code: "PM20250128005678",
            destinataire: "Omar Benali",
            destination: "Marrakech, Gueliz",
            status: "livre",
            dateEnvoi: "2024-01-28",
            poids: "1.2 kg",
            tarif: 35
          },
          {
            id: "3",
            code: "PM20250127009012",
            destinataire: "Aicha Nejjar",
            destination: "Fès, Centre",
            status: "en_attente",
            dateEnvoi: "2024-01-27",
            poids: "3.1 kg",
            tarif: 55
          }
        ];
        setColis(mockColis);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger vos colis",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      en_attente: { label: "En attente", variant: "secondary" as const, icon: <Clock className="h-3 w-3" /> },
      collecte: { label: "Collecté", variant: "default" as const, icon: <Package className="h-3 w-3" /> },
      en_transit: { label: "En transit", variant: "default" as const, icon: <Truck className="h-3 w-3" /> },
      en_livraison: { label: "En livraison", variant: "default" as const, icon: <Truck className="h-3 w-3" /> },
      livre: { label: "Livré", variant: "secondary" as const, icon: <CheckCircle className="h-3 w-3" /> },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.en_attente;
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        {config.icon}
        <span>{config.label}</span>
      </Badge>
    );
  };

  const getStatsCards = () => {
    const total = colis.length;
    const enCours = colis.filter(c => !["livre"].includes(c.status)).length;
    const livres = colis.filter(c => c.status === "livre").length;
    const montantTotal = colis.reduce((sum, c) => sum + c.tarif, 0);

    return [
      { title: "Total des Envois", value: total, icon: <Package className="h-5 w-5 text-primary" /> },
      { title: "En Cours", value: enCours, icon: <Truck className="h-5 w-5 text-orange-500" /> },
      { title: "Livrés", value: livres, icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
      { title: "Montant Total", value: `${montantTotal} DH`, icon: <Eye className="h-5 w-5 text-blue-500" /> },
    ];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Tableau de Bord</h1>
              <p className="text-muted-foreground">Gérez vos envois et suivez vos colis</p>
            </div>
          </div>
          <Link to="/colis/nouveau">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nouveau Colis</span>
            </Button>
          </Link>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getStatsCards().map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent rounded-lg">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contenu principal */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="colis">Mes Colis</TabsTrigger>
            <TabsTrigger value="profil">Mon Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="colis" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mes Envois</CardTitle>
                    <CardDescription>
                      Liste de tous vos colis envoyés
                    </CardDescription>
                  </div>
                  <Link to="/colis/nouveau">
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvel Envoi
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Chargement de vos colis...</p>
                  </div>
                ) : colis.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Aucun colis envoyé pour le moment</p>
                    <Link to="/colis/nouveau">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Envoyer votre premier colis
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {colis.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold">{item.code}</h4>
                              {getStatusBadge(item.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Destinataire:</span>
                                <p className="font-medium">{item.destinataire}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Destination:</span>
                                <p className="font-medium">{item.destination}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Poids / Tarif:</span>
                                <p className="font-medium">{item.poids} - {item.tarif} DH</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Link to={`/suivi-colis?code=${item.code}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Suivre
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profil" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mon Profil</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                      <p className="mt-1 font-medium">Ahmed Benali</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="mt-1 font-medium">ahmed.benali@email.ma</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                      <p className="mt-1 font-medium">+212 6 12 34 56 78</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">CIN</label>
                      <p className="mt-1 font-medium">A123456</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                      <p className="mt-1 font-medium">123 Rue Mohammed V, Rabat, Agdal</p>
                    </div>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Modifier le Profil
                    </Button>
                    <Button variant="outline">
                      Changer le Mot de Passe
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default ClientDashboard;