import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container text-center py-20">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <div className="text-9xl mb-8">🏖️</div>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          Página no encontrada
        </p>
        <Button asChild size="lg">
          <Link to="/">
            <ArrowLeft className="mr-2" />
            Volver al Inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
