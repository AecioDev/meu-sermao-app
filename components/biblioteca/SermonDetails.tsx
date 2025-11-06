// components/biblioteca/SermonDetails.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Copy, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sermon, serviceTypeColors } from "@/services/sermon/sermon-schema";

interface Props {
  sermon: Sermon;
  onClose: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

export function SermonDetails({ sermon, onClose, onCopy, onDelete }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Badge className={serviceTypeColors[sermon.serviceType]}>
            {sermon.serviceType.replace(/_/g, " ")}
          </Badge>
          <h2 className="text-2xl font-bold mt-2">{sermon.title}</h2>
          <p className="text-sm text-muted-foreground">
            Criado em{" "}
            {format(
              new Date(sermon.createdAt),
              "d 'de' MMMM 'de' yyyy 'às' HH:mm",
              { locale: ptBR }
            )}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 bg-muted/50">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Versículo-Chave
                </p>
                <p className="font-medium">{sermon.keyVerse}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h3 className="font-bold mb-2">Tema</h3>
          <p className="text-muted-foreground">{sermon.theme}</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Introdução</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {sermon.introduction}
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-4">Pontos Principais</h3>
          <div className="space-y-4">
            {sermon.mainPoints?.map((point, i) => (
              <Card
                key={i}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-2">{point.title}</h4>
                      <p className="text-muted-foreground mb-3 whitespace-pre-wrap">
                        {point.explanation}
                      </p>
                      {point.scriptureReferences.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {point.scriptureReferences.map((ref, j) => (
                            <Badge
                              key={j}
                              variant="outline"
                              className="text-xs"
                            >
                              {ref}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">Conclusão</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {sermon.conclusion}
          </p>
        </div>

        {sermon.notes && (
          <div>
            <h3 className="font-bold mb-2">Notas</h3>
            <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {sermon.notes}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCopy} className="flex-1">
          <Copy className="h-4 w-4 mr-2" />
          Copiar Conteúdo
        </Button>
        <Button
          variant="outline"
          onClick={onDelete}
          className="flex-1 text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </Button>
      </div>
    </div>
  );
}
