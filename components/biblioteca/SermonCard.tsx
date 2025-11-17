// components/biblioteca/SermonCard.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, Copy, Trash2, Star, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sermon, serviceTypeColors } from "@/services/sermon/sermon-schema";

interface Props {
  sermon: Sermon;
  onView: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export function SermonCard({
  sermon,
  onView,
  onCopy,
  onDelete,
  onToggleFavorite,
}: Props) {
  return (
    <div className="bg-card rounded-xl shadow-sm border hover:shadow-md transition-shadow p-5 space-y-4">
      <div className="flex items-start justify-between">
        <Badge className={serviceTypeColors[sermon.serviceType]}>
          {serviceTypeColors[sermon.serviceType] ? (
            <span>{sermon.serviceType.replace(/_/g, " ")}</span>
          ) : (
            <span>{sermon.serviceType.replace(/_/g, " ")}</span>
          )}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onToggleFavorite}>
              <Star
                className={`h-4 w-4 mr-2 ${
                  sermon.isFavorite ? "fill-amber-500 text-amber-500" : ""
                }`}
              />
              {sermon.isFavorite ? "Remover favorito" : "Marcar favorito"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCopy}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar conteúdo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="font-bold text-lg text-foreground line-clamp-2">
        {sermon.title}
      </h3>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {sermon.theme}
      </p>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <BookOpen className="h-3 w-3" />
        <span className="truncate">{sermon.keyVerse}</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-xs text-muted-foreground">
          {format(new Date(sermon.createdAt), "d 'de' MMM", { locale: ptBR })}
        </span>
        <Button
          size="sm"
          onClick={onView}
          className="bg-primary text-white hover:bg-primary/90"
        >
          Ver detalhes
        </Button>
      </div>
    </div>
  );
}
