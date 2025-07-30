import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, Users, Package, Settings, TrendingUp, 
  UserPlus, Edit, Trash2, Eye, DollarSign 
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface User {
  id: string;
  nom: string;
  email: string;
  type: "client" | "facteur";
  status: "actif" | "inactif";
  dateInscription: string;
  ville?: string;
  quartier?: string;
}

interface Tarif {
  id: string;
  ville: string;
  poidsMin: number;
  poidsMax: number;
  prix: number;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalFacteurs: 0,
    totalColis: 0,
    revenuMensuel: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // TODO: APIs diverses CRUD
      // const [usersResponse, tarifsResponse, statsResponse] = await Promise.all([
      //   axios.get('/api/admin/users'),
      //   axios.get('/api/admin/tarifs'),
      //   axios.get('/api/admin/stats')
      // ]);

      // Données simulées
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: "1",
            nom: "Ahmed Benali",
            email: "ahmed.benali@email.ma",
            type: "client",
            status: "actif",
            dateInscription: "2024-01-15",
            ville: "Rabat",
            quartier: "Agdal"
          },
          {
            id: "2",
            nom: "Fatima Alaoui",
            email: "fatima.alaoui@email.ma",
            type: "facteur",
            status: "actif",
            dateInscription: "2024-01-10",
            ville: "Rabat",
            quartier: "Agdal"
          },
          {
            id: "3",
            nom: "Omar Nejjar",
            email: "omar.nejjar@email.ma",
            type: "client",
            status: "inactif",
            dateInscription: "2024-01-20",
            ville: "Casablanca",
            quartier: "Maarif"
          }
        ];

        const mockTarifs: Tarif[] = [
          { id: "1", ville: "Rabat", poidsMin: 0, poidsMax: 1, prix: 25 },
          { id: "2", ville: "Rabat", poidsMin: 1, poidsMax: 5, prix: 35 },
          { id: "3", ville: "Casablanca", poidsMin: 0, poidsMax: 1, prix: 30 },
          { id: "4", ville: "Casablanca", poidsMin: 1, poidsMax: 5, prix: 40 },
        ];

        setUsers(mockUsers);
        setTarifs(mockTarifs);
        setStats({
          totalClients: mockUsers.filter(u => u.type === "client").length,
          totalFacteurs: mockUsers.filter(u => u.type === "facteur").length,
          totalColis: 156,
          revenuMensuel: 12450
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    }
  };

  const getStatsCards = () => [
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      color: "text-blue-500"
    },
    {
      title: "Total Facteurs",
      value: stats.totalFacteurs,
      icon: <Users className="h-5 w-5 text-green-500" />,
      color: "text-green-500"
    },
    {
      title: "Total Colis",
      value: stats.totalColis,
      icon: <Package className="h-5 w-5 text-orange-500" />,
      color: "text-orange-500"
    },
    {
      title: "Revenus Mensuel",
      value: `${stats.revenuMensuel} DH`,
      icon: <DollarSign className="h-5 w-5 text-purple-500" />,
      color: "text-purple-500"
    }
  ];

  const getUserStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "actif" ? "secondary" : "destructive"}>
        {status}
      </Badge>
    );
  };

  const getUserTypeBadge = (type: string) => {
    return (
      <Badge variant={type === "client" ? "default" : "outline"}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Administration</h1>
              <p className="text-muted-foreground">Gestion complète du système MyPoste Maroc</p>
            </div>
          </div>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="tarifs">Tarifs</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Activité Récente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <UserPlus className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="font-medium">Nouvel utilisateur inscrit</p>
                        <p className="text-sm text-muted-foreground">ahmed.benali@email.ma</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Package className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium">Nouveau colis créé</p>
                        <p className="text-sm text-muted-foreground">PM20250129001234</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      <div>
                        <p className="font-medium">Revenus en hausse</p>
                        <p className="text-sm text-muted-foreground">+15% ce mois</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Ville</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Rabat", "Casablanca", "Fès", "Marrakech"].map((ville, index) => (
                      <div key={ville} className="flex items-center justify-between">
                        <span>{ville}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${(4 - index) * 25}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {(4 - index) * 25}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestion des Utilisateurs</CardTitle>
                    <CardDescription>
                      Gérez les comptes clients et facteurs
                    </CardDescription>
                  </div>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter Utilisateur
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input placeholder="Rechercher un utilisateur..." className="max-w-sm" />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Ville</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.nom}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getUserTypeBadge(user.type)}</TableCell>
                        <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                        <TableCell>{user.ville}</TableCell>
                        <TableCell>
                          {new Date(user.dateInscription).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tarifs" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestion des Tarifs</CardTitle>
                    <CardDescription>
                      Configurez les tarifs par ville et tranche de poids
                    </CardDescription>
                  </div>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter Tarif
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ville</TableHead>
                      <TableHead>Poids Min (kg)</TableHead>
                      <TableHead>Poids Max (kg)</TableHead>
                      <TableHead>Prix (DH)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tarifs.map((tarif) => (
                      <TableRow key={tarif.id}>
                        <TableCell className="font-medium">{tarif.ville}</TableCell>
                        <TableCell>{tarif.poidsMin}</TableCell>
                        <TableCell>{tarif.poidsMax}</TableCell>
                        <TableCell>{tarif.prix} DH</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Paramètres Système</span>
                </CardTitle>
                <CardDescription>
                  Configuration générale du système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Paramètres Généraux</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Notifications Email</p>
                          <p className="text-sm text-muted-foreground">
                            Envoyer des notifications par email aux clients
                          </p>
                        </div>
                        <Button variant="outline">Configurer</Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Sauvegarde Automatique</p>
                          <p className="text-sm text-muted-foreground">
                            Sauvegarde quotidienne des données
                          </p>
                        </div>
                        <Button variant="outline">Configurer</Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Maintenance Système</p>
                          <p className="text-sm text-muted-foreground">
                            Planifier la maintenance du système
                          </p>
                        </div>
                        <Button variant="outline">Planifier</Button>
                      </div>
                    </div>
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

export default AdminDashboard;