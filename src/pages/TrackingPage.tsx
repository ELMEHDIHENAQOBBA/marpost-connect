import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Package, Clock, CheckCircle, Truck, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const trackingSchema = z.object({
  trackingCode: z.string().regex(/^PM\d{14}$/, "Format de code invalide (ex: PM20250729123456)"),
});

type TrackingData = z.infer<typeof trackingSchema>;

interface TrackingInfo {
  code: string;
  status: "en_attente" | "collecte" | "en_transit" | "en_livraison" | "livre";
  expediteur: string;
  destinataire: string;
  destination: string;
  dateEnvoi: string;
  dateLivraison?: string;
  poids: string;
  timeline: Array<{
    status: string;
    description: string;
    date: string;
    location?: string;
  }>;
}

const TrackingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const { toast } = useToast();

  const form = useForm<TrackingData>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      trackingCode: "",
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      en_attente: { label: "En attente", variant: "secondary" as const, icon: <Clock className="h-3 w-3" /> },
      collecte: { label: "Collecté", variant: "default" as const, icon: <Package className="h-3 w-3" /> },
      en_transit: { label: "En transit", variant: "default" as const, icon: <Truck className="h-3 w-3" /> },
      en_livraison: { label: "En livraison", variant: "default" as const, icon: <MapPin className="h-3 w-3" /> },
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

  const onSubmit = async (data: TrackingData) => {
    setIsLoading(true);
    
    try {
      // TODO: API GET /api/colis/track/:code
      // const response = await axios.get(`/api/colis/track/${data.trackingCode}`);
      // setTrackingInfo(response.data);

      // Simulation des données de suivi
      setTimeout(() => {
        const mockData: TrackingInfo = {
          code: data.trackingCode,
          status: "en_transit",
          expediteur: "Ahmed Benali",
          destinataire: "Fatima Alaoui",
          destination: "Casablanca, Maarif",
          dateEnvoi: "2024-01-28",
          poids: "2.5 kg",
          timeline: [
            {
              status: "en_attente",
              description: "Colis enregistré et en attente de collecte",
              date: "2024-01-28 09:00",
              location: "Rabat Centre"
            },
            {
              status: "collecte",
              description: "Colis collecté par le facteur",
              date: "2024-01-28 14:30",
              location: "Rabat Centre"
            },
            {
              status: "en_transit",
              description: "Colis en route vers la destination",
              date: "2024-01-29 08:00",
              location: "Centre de tri Casablanca"
            }
          ]
        };
        setTrackingInfo(mockData);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      setIsLoading(false);
      setTrackingInfo(null);
      toast({
        title: "Colis introuvable",
        description: "Aucun colis trouvé avec ce code de suivi",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Suivi de Colis</h1>
              <p className="text-muted-foreground">
                Entrez votre code de suivi pour voir l'état de votre envoi
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rechercher un Colis</CardTitle>
            <CardDescription>
              Le code de suivi format PM suivi de 14 chiffres (ex: PM20250729123456)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
                <FormField
                  control={form.control}
                  name="trackingCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input 
                          placeholder="PM20250729123456" 
                          className="text-lg"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="px-8">
                  {isLoading ? "Recherche..." : "Suivre"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {trackingInfo && (
          <div className="space-y-6">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Colis {trackingInfo.code}</CardTitle>
                  {getStatusBadge(trackingInfo.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">EXPÉDITEUR</h4>
                    <p className="font-medium">{trackingInfo.expediteur}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">DESTINATAIRE</h4>
                    <p className="font-medium">{trackingInfo.destinataire}</p>
                    <p className="text-sm text-muted-foreground">{trackingInfo.destination}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">DÉTAILS</h4>
                    <p className="text-sm">Poids: {trackingInfo.poids}</p>
                    <p className="text-sm">Envoyé le: {new Date(trackingInfo.dateEnvoi).toLocaleDateString('fr-FR')}</p>
                    {trackingInfo.dateLivraison && (
                      <p className="text-sm">Livré le: {new Date(trackingInfo.dateLivraison).toLocaleDateString('fr-FR')}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Historique du Colis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingInfo.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-primary rounded-full mt-2"></div>
                        {index < trackingInfo.timeline.length - 1 && (
                          <div className="w-0.5 h-12 bg-border ml-1 mt-1"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{event.description}</p>
                          <span className="text-sm text-muted-foreground">{event.date}</span>
                        </div>
                        {event.location && (
                          <p className="text-sm text-muted-foreground mt-1">{event.location}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default TrackingPage;