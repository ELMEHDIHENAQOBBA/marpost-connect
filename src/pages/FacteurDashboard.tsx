import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Truck, Package, CheckCircle, Clock, MapPin, User, Phone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface ColisAColleter {
  id: number;
  code_suivi: string;
  client_nom: string;
  client_prenom: string;
  tel_destinataire: string;
  adresse_destinataire: string;
  quartier_nom: string;
  poids: number;
  date_depot: string;
  nom_destinataire: string;
  destination: string;
  statut: string;
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
      setIsLoading(true);
      
      // Récupérer tous les colis avec les informations des clients et quartiers
      const { data: colisData, error } = await (supabase as any)
        .from('colis')
        .select(`
          id,
          code_suivi,
          poids,
          date_depot,
          nom_destinataire,
          tel_destinataire,
          adresse_destinataire,
          statut,
          client:client_id (
            nom,
            prenom
          ),
          quartier:quartier_id (
            nom,
            ville:ville_id (
              nom
            )
          )
        `)
        .order('date_depot', { ascending: true });

      if (error) {
        throw error;
      }

      // Transformer les données pour l'interface
      const transformedColis: ColisAColleter[] = (colisData || []).map(colis => ({
        id: colis.id,
        code_suivi: colis.code_suivi,
        client_nom: colis.client?.nom || '',
        client_prenom: colis.client?.prenom || '',
        tel_destinataire: colis.tel_destinataire || '',
        adresse_destinataire: colis.adresse_destinataire || '',
        quartier_nom: colis.quartier?.nom || '',
        poids: colis.poids,
        date_depot: colis.date_depot,
        nom_destinataire: colis.nom_destinataire || '',
        destination: colis.quartier?.ville?.nom || '',
        statut: colis.statut || 'En attente'
      }));

      // Filtrer par statut
      setColisAColleter(transformedColis.filter(c => c.statut === 'En attente'));
      setColisCollectes(transformedColis.filter(c => c.statut === 'Collecté'));
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les colis",
        variant: "destructive",
      });
    }
  };

  const marquerCommeCollecte = async (colisId: number) => {
    try {
      // Mettre à jour le statut dans la base de données
      const { error } = await (supabase as any)
        .from('colis')
        .update({ statut: 'Collecté' })
        .eq('id', colisId);

      if (error) {
        throw error;
      }

      // Mettre à jour l'état local
      const colis = colisAColleter.find(c => c.id === colisId);
      if (colis) {
        colis.statut = "Collecté";
        setColisAColleter(prev => prev.filter(c => c.id !== colisId));
        setColisCollectes(prev => [...prev, colis]);
        
        toast({
          title: "Colis collecté !",
          description: `Le colis ${colis.code_suivi} a été marqué comme collecté`,
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
      .reduce((sum, c) => sum + c.poids, 0);

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
        value: colisAColleter[0]?.quartier_nom || "Tous secteurs", 
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
            Zone: {colisAColleter[0]?.quartier_nom || "Tous secteurs"}
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
                              <h4 className="font-semibold">{colis.code_suivi}</h4>
                                <Badge variant="secondary">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {new Date(colis.date_depot).toLocaleDateString('fr-FR')}
                                </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span><strong>Expéditeur:</strong> {colis.client_prenom} {colis.client_nom}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{colis.tel_destinataire}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{colis.adresse_destinataire}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p><strong>Destinataire:</strong> {colis.nom_destinataire}</p>
                                <p><strong>Destination:</strong> {colis.destination}</p>
                                <p><strong>Poids:</strong> {colis.poids} kg</p>
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
                              <h4 className="font-semibold">{colis.code_suivi}</h4>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Collecté
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Expéditeur:</span>
                                <p className="font-medium">{colis.client_prenom} {colis.client_nom}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Destination:</span>
                                <p className="font-medium">{colis.destination}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Poids:</span>
                                <p className="font-medium">{colis.poids} kg</p>
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