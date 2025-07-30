import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Calculator, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const packageSchema = z.object({
  nomDestinataire: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  telephoneDestinataire: z.string().regex(/^(\+212|0)[5-7][0-9]{8}$/, "Numéro de téléphone marocain invalide"),
  adresseDestinataire: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  villeDestinataire: z.string().min(1, "Veuillez sélectionner une ville"),
  quartierDestinataire: z.string().min(2, "Le quartier doit contenir au moins 2 caractères"),
  poids: z.string().regex(/^\d+(\.\d+)?$/, "Poids invalide (ex: 2.5)"),
  description: z.string().optional(),
});

type PackageData = z.infer<typeof packageSchema>;

const villes = [
  "Casablanca", "Rabat", "Fès", "Marrakech", "Agadir", "Tanger", "Meknès", "Oujda",
  "Kenitra", "Tetouan", "Safi", "Mohammedia", "Khouribga", "El Jadida", "Settat",
  "Berrechid", "Nador", "Khemisset", "Beni Mellal", "Taza"
];

const NewPackage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tarif, setTarif] = useState<number | null>(null);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<PackageData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      nomDestinataire: "",
      telephoneDestinataire: "",
      adresseDestinataire: "",
      villeDestinataire: "",
      quartierDestinataire: "",
      poids: "",
      description: "",
    },
  });

  const calculateTarif = (poids: number, ville: string) => {
    // Tarification simplifiée basée sur le poids et la destination
    let baseTarif = 25; // Tarif de base
    let tarifPoids = poids * 8; // 8 DH par kg
    
    // Supplément selon la ville (simulation)
    const villesLointaines = ["Agadir", "Oujda", "Tanger", "Tetouan"];
    if (villesLointaines.includes(ville)) {
      baseTarif += 15;
    }
    
    return Math.round(baseTarif + tarifPoids);
  };

  const generateTrackingCode = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `PM${year}${month}${day}${random}`;
  };

  // Calcul automatique du tarif quand poids et ville changent
  const watchPoids = form.watch("poids");
  const watchVille = form.watch("villeDestinataire");

  useState(() => {
    if (watchPoids && watchVille) {
      const poidsNum = parseFloat(watchPoids);
      if (!isNaN(poidsNum) && poidsNum > 0) {
        const calculatedTarif = calculateTarif(poidsNum, watchVille);
        setTarif(calculatedTarif);
      } else {
        setTarif(null);
      }
    } else {
      setTarif(null);
    }
  });

  const onSubmit = async (data: PackageData) => {
    setIsLoading(true);
    
    try {
      const code = generateTrackingCode();
      const packageData = {
        ...data,
        trackingCode: code,
        tarif: tarif,
        status: "en_attente",
        dateEnvoi: new Date().toISOString(),
      };

      // TODO: API POST /api/colis/create
      // const response = await axios.post('/api/colis/create', packageData);
      
      // Simulation de l'envoi réussi
      setTimeout(() => {
        setTrackingCode(code);
        setIsLoading(false);
        toast({
          title: "Colis enregistré !",
          description: `Votre colis a été créé avec le code ${code}`,
        });
      }, 1500);
      
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Erreur d'envoi",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    }
  };

  if (trackingCode) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Colis Enregistré !</CardTitle>
              <CardDescription>
                Votre colis a été créé avec succès
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Code de suivi</p>
                <code className="text-lg font-mono font-bold">{trackingCode}</code>
              </div>
              {tarif && (
                <div className="text-center">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Tarif: {tarif} DH
                  </Badge>
                </div>
              )}
              <div className="text-sm text-muted-foreground space-y-2">
                <p>✅ Votre colis sera collecté dans les 24h</p>
                <p>📱 Vous pouvez suivre votre envoi avec ce code</p>
              </div>
              <div className="flex space-x-2">
                <Link to={`/suivi-colis?code=${trackingCode}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Suivre le Colis
                  </Button>
                </Link>
                <Link to="/client/dashboard" className="flex-1">
                  <Button className="w-full">
                    Mes Colis
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/client/dashboard">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Nouveau Colis</h1>
              <p className="text-muted-foreground">
                Remplissez les informations pour envoyer votre colis
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du Destinataire</CardTitle>
            <CardDescription>
              Assurez-vous que toutes les informations sont correctes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nomDestinataire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du Destinataire</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom complet du destinataire" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telephoneDestinataire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone du Destinataire</FormLabel>
                      <FormControl>
                        <Input placeholder="+212612345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adresseDestinataire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse du Destinataire</FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse complète" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="villeDestinataire"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville de Destination</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une ville" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {villes.map((ville) => (
                              <SelectItem key={ville} value={ville}>
                                {ville}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quartierDestinataire"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quartier</FormLabel>
                        <FormControl>
                          <Input placeholder="Quartier du destinataire" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="poids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poids (kg)</FormLabel>
                      <FormControl>
                        <Input placeholder="2.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Contenu du colis..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {tarif && (
                  <div className="p-4 bg-accent rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calculator className="h-5 w-5 text-primary" />
                      <span className="font-medium">Tarif estimé:</span>
                      <Badge variant="secondary" className="text-lg">
                        {tarif} DH
                      </Badge>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !tarif}
                >
                  {isLoading ? "Enregistrement..." : "Envoyer le Colis"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default NewPackage;