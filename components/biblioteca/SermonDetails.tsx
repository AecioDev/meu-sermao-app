// components/biblioteca/SermonDetails.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Copy, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Sermon,
  serviceTypeColors,
  serviceTypeLabels,
} from "@/services/sermon/sermon-schema";
import { DialogHeader, DialogTitle } from "../ui/dialog";

interface Props {
  sermon: Sermon;
  onClose: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

export function SermonDetails({ sermon, onClose, onCopy, onDelete }: Props) {
  return (
    <div className="space-y-6">
      <DialogHeader className="border-b pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Badge className={`mb-3 ${serviceTypeColors[sermon.serviceType]}`}>
              {serviceTypeLabels[sermon.serviceType]}
            </Badge>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              {sermon.title}
            </DialogTitle>
            <p className="text-gray-600 text-sm">
              Criado em{" "}
              {format(
                new Date(sermon.createdAt),
                "d 'de' MMMM 'de' yyyy 'às' HH:mm",
                { locale: ptBR }
              )}
            </p>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-6 py-6">
        {/* Key Verse */}
        <Card className="bg-linear-to-r shadow-lg from-blue-50 to-indigo-50 border-none">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-indigo-600 shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Versículo-Chave
                </p>
                <p className="text-gray-900 font-medium">{sermon.keyVerse}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Tema</h3>
          <p className="text-gray-700 leading-relaxed">{sermon.theme}</p>
        </div>

        {/* Introduction */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Introdução</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {sermon.introduction}
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-4">
            Pontos Principais
          </h3>
          <div className="space-y-6">
            {sermon.mainPoints?.map((point, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2">
                        {point.title}
                      </h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">
                        {point.explanation}
                      </p>
                      {point.scriptureReferences?.length > 0 && (
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs font-semibold text-gray-600 mb-2">
                            Referências:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {point.scriptureReferences.map((ref, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs"
                              >
                                {ref}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Conclusion */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">
            Conclusão e Apelo
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {sermon.conclusion}
          </p>
        </div>

        {/* Notes */}
        {sermon.notes && (
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Notas Adicionais
            </h3>
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {sermon.notes}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCopy} className="flex-1">
          <Copy className="h-4 w-4 mr-2" />
          Copiar Conteúdo
        </Button>
        <Button
          variant="outline"
          onClick={onDelete}
          className="flex-1 text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir Sermão
        </Button>
      </div>
    </div>
  );
}
