import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md mx-4 shadow-lg border-border/50">
        <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-2">404</h1>
          <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
          
          <p className="text-muted-foreground mb-8 max-w-[280px]">
            The page you are looking for doesn't exist or has been moved.
          </p>

          <Button asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
