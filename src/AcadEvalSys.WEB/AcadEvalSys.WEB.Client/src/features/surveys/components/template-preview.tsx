import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { SurveyTemplate, QuestionType } from '../models/survey-template-types';
import { getSurveyTemplateTypeLabel, getQuestionTypeLabel } from '../utils/survey-template-formatters';

interface TemplatePreviewProps {
  template: SurveyTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatePreview({ template, isOpen, onClose }: TemplatePreviewProps) {
  if (!template) return null;

  const renderQuestionPreview = (question: any, index: number) => {
    return (
      <Card key={index} className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1">
                {index + 1}. {question.text}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </h4>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {getQuestionTypeLabel(question.type)}
                </Badge>
                {question.required && (
                  <Badge variant="secondary" className="text-xs">
                    Obligatoria
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Renderizar opciones según el tipo */}
          {question.type === QuestionType.SingleChoice && (
            <div className="space-y-2">
              {question.options.map((option: any, optionIndex: number) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question_${index}`}
                    disabled
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-muted-foreground">{option.text}</span>
                </div>
              ))}
            </div>
          )}

          {question.type === QuestionType.MultipleChoice && (
            <div className="space-y-2">
              {question.options.map((option: any, optionIndex: number) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-muted-foreground">{option.text}</span>
                </div>
              ))}
            </div>
          )}

          {question.type === QuestionType.OpenText && (
            <div>
              <textarea
                disabled
                placeholder="Respuesta de texto libre..."
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vista Previa de Plantilla</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información de la plantilla */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">
                      {getSurveyTemplateTypeLabel(template.surveyType)}
                    </Badge>
                    <Badge variant={template.isDraft ? 'secondary' : 'default'}>
                      {template.isDraft ? 'Borrador' : 'Publicada'}
                    </Badge>
                    <Badge variant="outline">
                      v{template.version}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <strong>Fecha de creación:</strong><br />
                  {new Date(template.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                {template.updatedAt && (
                  <div>
                    <strong>Última actualización:</strong><br />
                    {new Date(template.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preguntas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Preguntas ({template.questions.length})
            </h3>
            
            {template.questions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <p>Esta plantilla no tiene preguntas</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {template.questions.map((question, index) => 
                  renderQuestionPreview(question, index)
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
