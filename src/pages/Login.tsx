import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, UserCheck, Shield } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email ou identifiant requis"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginData = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"client" | "facteur" | "admin">("client");
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    
    try {
      // TODO: API POST /api/login
      // const response = await axios.post('/api/login', {
      //   ...data,
      //   userType
      // });

      // Simulation de connexion réussie
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Connexion réussie !",
          description: `Bienvenue sur votre espace ${userType}`,
        });
        
        // Redirection selon le type d'utilisateur
        switch (userType) {
          case "client":
            navigate("/client/dashboard");
            break;
          case "facteur":
            navigate("/facteur/dashboard");
            break;
          case "admin":
            navigate("/admin");
            break;
        }
      }, 1500);
      
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Erreur de connexion",
        description: "Identifiants incorrects ou erreur serveur",
        variant: "destructive",
      });
    }
  };

  const getUserTypeInfo = (type: string) => {
    switch (type) {
      case "client":
        return {
          icon: <User className="h-5 w-5" />,
          title: "Espace Client",
          description: "Gérez vos envois et suivez vos colis"
        };
      case "facteur":
        return {
          icon: <UserCheck className="h-5 w-5" />,
          title: "Espace Facteur",
          description: "Accédez à vos tournées et collectes"
        };
      case "admin":
        return {
          icon: <Shield className="h-5 w-5" />,
          title: "Administration",
          description: "Gestion complète du système"
        };
      default:
        return {
          icon: <User className="h-5 w-5" />,
          title: "Connexion",
          description: ""
        };
    }
  };

  const currentUserInfo = getUserTypeInfo(userType);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center space-x-4 mb-4">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {currentUserInfo.icon}
              </div>
              <div>
                <CardTitle className="text-2xl">{currentUserInfo.title}</CardTitle>
                <CardDescription>{currentUserInfo.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} onValueChange={(value) => setUserType(value as typeof userType)} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="client" className="text-xs">Client</TabsTrigger>
                <TabsTrigger value="facteur" className="text-xs">Facteur</TabsTrigger>
                <TabsTrigger value="admin" className="text-xs">Admin</TabsTrigger>
              </TabsList>
            </Tabs>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {userType === "client" ? "Email" : "Identifiant"}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={
                            userType === "client" 
                              ? "votre.email@exemple.ma" 
                              : "Votre identifiant"
                          } 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Votre mot de passe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </form>
            </Form>

            {userType === "client" && (
              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <Link to="#" className="text-sm text-primary hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Pas encore de compte ?{" "}
                    <Link to="/register-client" className="text-primary hover:underline">
                      S'inscrire
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;