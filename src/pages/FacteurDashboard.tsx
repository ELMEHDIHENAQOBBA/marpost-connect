import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Truck, Package, CheckCircle, Clock, MapPin, User, Phone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface ColisAColleter {
  id: string;
  code: string;
  expediteur: string;
  telephoneExpediteur: string;
  adresseRamassage: string;
  quartier: string;
  poids: string;
  dateEnvoi: string;
  destinataire: string;
  destination: string;
  status: "en_attente" | "collecte";
}

const FacteurDashboard = () => {
  const [colisAColleter, setColisAColleter] = useState<ColisAColleter[]>([]);
  const [colisCollectes, setColisCollectes] = useState<ColisAColleter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ramassage");
  const { toast } = useToast();

  useEffect(() => {
    loadColis();
  }, []);

  const loadColis = async () => {
    try {
      // TODO: API GET /api/colis/to-pickup
      // const response = await axios.get('/api/colis/to-pickup');
      // setColisAColleter(response.data.filter(c => c.status === 'en_attente'));
      // setColisCollectes(response.data.filter(c => c.status === 'collecte'));

      // Données simulées
      setTimeout(() => {
        const mockColis: ColisAColleter[] = [
          {
            id: "1",
            code: "PM20250129001234",
            expediteur: "Ahmed Benali",
            telephoneExpediteur: "+212612345678",
            adresseRamassage: "123 Rue Mohammed V, Agdal",
            quartier: "Agdal",
            poids: "2.5 kg",
            dateEnvoi: "2024-01-29",
            destinataire: "Fatima Alaoui",
            destination: "Casablanca",
            status: "en_attente"
          },
          {
            id: "2",
            code: "PM20250129002345",
            expediteur: "Omar Nejjar",
            telephoneExpediteur: "+212656789012",
            adresseRamassage: "45 Avenue Hassan II, Agdal",
            quartier: "Agdal",
            poids: "1.8 kg",
            dateEnvoi: "2024-01-29",
            destinataire: "Youssef Mansouri",
            destination: "Fès",
            status: "en_attente"
          },
          {
            id: "3",
            code: "PM20250128005678",
            expediteur: "Aicha Benali",
            telephoneExpediteur: "+212667890123",
            adresseRamassage: "78 Rue Al Barid, Agdal",
            quartier: "Agdal",
            poids: "3.2 kg",
            dateEnvoi: "2024-01-28",
            destinataire: "Mohammed Alami",
            destination: "Marrakech",
            status: "collecte"
          }
        ];
        
        setColisAColleter(mockColis.filter(c => c.status === "en_attente"));
        setColisCollectes(mockColis.filter(c => c.status === "collecte"));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les colis",
        variant: "destructive",
      });
    }
  };

  const marquerCommeCollecte = async (colisId: string) => {
    try {
      // TODO: API PATCH /api/colis/:id/status
      // await axios.patch(`/api/colis/${colisId}/status`, { status: 'collecte' });

      // Simulation de mise à jour
      const colis = colisAColleter.find(c => c.id === colisId);
      if (colis) {
        colis.status = "collecte";
        setColisAColleter(prev => prev.filter(c => c.id !== colisId));
        setColisCollectes(prev => [...prev, colis]);
        
        toast({
          title: "Colis collecté !",
          description: `Le colis ${colis.code} a été marqué comme collecté`,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const getStatsCards = () => {
    const totalAColleter = colisAColleter.length;
    const totalCollectes = colisCollectes.length;
    const poidsTotal = [...colisAColleter, ...colisCollectes]
      .reduce((sum, c) => sum + parseFloat(c.poids.replace(' kg', '')), 0);

    return [
      { 
        title: "À Collecter Aujourd'hui", 
        value: totalAColleter, 
        icon: <Package className="h-5 w-5 text-orange-500" />,
        color: "text-orange-500"
      },
      { 
        title: "Collectés", 
        value: totalCollectes, 
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        color: "text-green-500"
      },
      { 
        title: "Poids Total", 
        value: `${poidsTotal.toFixed(1)} kg`, 
        icon: <Truck className="h-5 w-5 text-blue-500" />,
        color: "text-blue-500"
      },
      { 
        title: "Quartier", 
        value: "Agdal", 
        icon: <MapPin className="h-5 w-5 text-purple-500" />,
        color: "text-purple-500"
      },
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
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Espace Facteur</h1>
              <p className="text-muted-foreground">Gérez vos collectes et tournées</p>
            </div>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Zone: Agdal, Rabat
          </Badge>
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
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
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
            <TabsTrigger value="ramassage">
              Ramassage du Jour
              {colisAColleter.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {colisAColleter.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="collectes">
              Collectés
              {colisCollectes.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {colisCollectes.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ramassage" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Colis à Collecter - Triés par Ordre FIFO</span>
                </CardTitle>
                <CardDescription>
                  Liste des colis en attente de collecte dans votre secteur
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Chargement de vos collectes...</p>
                  </div>
                ) : colisAColleter.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Toutes les collectes du jour sont terminées !
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {colisAColleter.map((colis, index) => (
                      <div key={colis.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <Badge variant="outline" className="font-mono">
                                #{index + 1}
                              </Badge>
                              <h4 className="font-semibold">{colis.code}</h4>
                              <Badge variant="secondary">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(colis.dateEnvoi).toLocaleDateString('fr-FR')}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span><strong>Expéditeur:</strong> {colis.expediteur}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{colis.telephoneExpediteur}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{colis.adresseRamassage}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p><strong>Destinataire:</strong> {colis.destinataire}</p>
                                <p><strong>Destination:</strong> {colis.destination}</p>
                                <p><strong>Poids:</strong> {colis.poids}</p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Button 
                              onClick={() => marquerCommeCollecte(colis.id)}
                              className="flex items-center space-x-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Marquer Collecté</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collectes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Colis Collectés</span>
                </CardTitle>
                <CardDescription>
                  Historique des colis que vous avez collectés
                </CardDescription>
              </CardHeader>
              <CardContent>
                {colisCollectes.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun colis collecté pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {colisCollectes.map((colis) => (
                      <div key={colis.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold">{colis.code}</h4>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Collecté
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Expéditeur:</span>
                                <p className="font-medium">{colis.expediteur}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Destination:</span>
                                <p className="font-medium">{colis.destination}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Poids:</span>
                                <p className="font-medium">{colis.poids}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default FacteurDashboard;