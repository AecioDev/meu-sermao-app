// components/criar-sermao/SermonEditor.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  GenerateFullSermonResponse,
  MainPoint,
} from "@/services/sermon/sermon-schema";

interface SermonEditorProps {
  sermon: GenerateFullSermonResponse;
  onSave: (editedSermon: GenerateFullSermonResponse) => void;
  isSaving: boolean;
}

export default function SermonEditor({
  sermon,
  onSave,
  isSaving,
}: SermonEditorProps) {
  // O editor mantém seu próprio estado para edição
  const [editedSermon, setEditedSermon] =
    useState<GenerateFullSermonResponse>(sermon);

  const handleMainPointChange = (
    index: number,
    field: keyof MainPoint,
    value: string
  ) => {
    const newPoints = [...editedSermon.mainPoints];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setEditedSermon({ ...editedSermon, mainPoints: newPoints });
  };

  const handleReferenceChange = (
    pointIndex: number,
    refIndex: number,
    value: string
  ) => {
    const newPoints = [...editedSermon.mainPoints];
    const newRefs = [...newPoints[pointIndex].scriptureReferences];
    newRefs[refIndex] = value;
    newPoints[pointIndex] = {
      ...newPoints[pointIndex],
      scriptureReferences: newRefs,
    };
    setEditedSermon({ ...editedSermon, mainPoints: newPoints });
  };

  const addMainPoint = () => {
    setEditedSermon({
      ...editedSermon,
      mainPoints: [
        ...editedSermon.mainPoints,
        { title: "", explanation: "", scriptureReferences: [""] },
      ],
    });
  };

  const removeMainPoint = (index: number) => {
    const newPoints = editedSermon.mainPoints.filter((_, i) => i !== index);
    setEditedSermon({ ...editedSermon, mainPoints: newPoints });
  };

  // --- Handlers para Referências ---
  const addReference = (pointIndex: number) => {
    const newPoints = [...editedSermon.mainPoints];
    newPoints[pointIndex] = {
      ...newPoints[pointIndex],
      scriptureReferences: [...newPoints[pointIndex].scriptureReferences, ""],
    };
    setEditedSermon({ ...editedSermon, mainPoints: newPoints });
  };

  const removeReference = (pointIndex: number, refIndex: number) => {
    const newPoints = [...editedSermon.mainPoints];
    const newRefs = newPoints[pointIndex].scriptureReferences.filter(
      (_, i) => i !== refIndex
    );
    newPoints[pointIndex] = {
      ...newPoints[pointIndex],
      scriptureReferences: newRefs,
    };
    setEditedSermon({ ...editedSermon, mainPoints: newPoints });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Card: Título e Introdução (Nenhuma mudança) */}
      <Card className="py-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Detalhes do Sermão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title" className="font-semibold mb-2">
              Título
            </Label>
            <Input
              id="title"
              value={editedSermon.title}
              onChange={(e) =>
                setEditedSermon({ ...editedSermon, title: e.target.value })
              }
              className="text-lg"
              placeholder="Digite o título do sermão"
            />
          </div>
          <div>
            <Label htmlFor="introduction" className="font-semibold mb-2">
              Introdução
            </Label>
            <Textarea
              id="introduction"
              value={editedSermon.introduction}
              onChange={(e) =>
                setEditedSermon({
                  ...editedSermon,
                  introduction: e.target.value,
                })
              }
              rows={5}
              placeholder="Digite a introdução"
            />
          </div>
        </CardContent>
      </Card>

      {/* Card: Pontos Principais */}
      <Card className="py-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Pontos Principais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {editedSermon.mainPoints.map((point, pointIndex) => (
            <div
              key={pointIndex}
              className="p-4 border rounded-lg shadow-sm bg-secondary"
            >
              <div className="flex justify-between items-center mb-2">
                <Label
                  htmlFor={`point-title-${pointIndex}`}
                  className="text-lg font-semibold"
                >
                  Ponto {pointIndex + 1}
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMainPoint(pointIndex)}
                  className="text-destructive font-light hover:text-destructive/90"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                </Button>
              </div>
              <div className="space-y-3">
                <Input
                  id={`point-title-${pointIndex}`}
                  value={point.title}
                  onChange={(e) =>
                    handleMainPointChange(pointIndex, "title", e.target.value)
                  }
                  placeholder="Título do Ponto Principal"
                  className="border-muted-foreground"
                />
                <Textarea
                  id={`point-explanation-${pointIndex}`}
                  value={point.explanation}
                  onChange={(e) =>
                    handleMainPointChange(
                      pointIndex,
                      "explanation",
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Explicação do ponto"
                  className="border-muted-foreground"
                />
                <div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Referências Bíblicas
                    </Label>
                    {point.scriptureReferences.map((ref, refIndex) => (
                      <div key={refIndex} className="flex items-center gap-2">
                        <Input
                          value={ref}
                          onChange={(e) =>
                            handleReferenceChange(
                              pointIndex,
                              refIndex,
                              e.target.value
                            )
                          }
                          placeholder="Ex: João 3:16"
                          className="flex-1 border-muted-foreground"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeReference(pointIndex, refIndex)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addReference(pointIndex)}
                      className="mt-1"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar Referência
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="default"
            onClick={addMainPoint}
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Ponto Principal
          </Button>
        </CardContent>
      </Card>

      <Card className="py-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Finalização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg shadow-sm bg-secondary">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="conclusion" className="text-lg font-semibold">
                Conclusão
              </Label>
            </div>
            <div className="space-y-3">
              <Textarea
                id="conclusion"
                value={editedSermon.conclusion}
                onChange={(e) =>
                  setEditedSermon({
                    ...editedSermon,
                    conclusion: e.target.value,
                  })
                }
                rows={5}
                placeholder="Digite a conclusão"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4 sticky bottom-4">
        <Button
          onClick={() => onSave(editedSermon)}
          disabled={isSaving}
          size="lg"
          className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-6 text-lg shadow-lg"
        >
          {isSaving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="mr-2"
              >
                <Save className="w-5 h-5" />
              </motion.div>
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Salvar Sermão no Banco
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
