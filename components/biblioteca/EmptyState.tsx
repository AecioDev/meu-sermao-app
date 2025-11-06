// components/biblioteca/EmptyState.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-md w-full text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Biblioteca Vazia</h3>
        <p className="text-muted-foreground mb-6">
          Você ainda não criou nenhum sermão. Comece agora com a ajuda da IA!
        </p>
        <Link href="/criar-sermao">
          <Button className="bg-primary text-white">
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Sermão
          </Button>
        </Link>
      </Card>
    </div>
  );
}
