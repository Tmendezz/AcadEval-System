import { Plus, GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { SurveyTemplateQuestion } from '../models/survey-template-types';

// Definir QuestionType localmente para evitar problemas de import
type QuestionType = 'SingleChoice' | 'MultipleChoice' | 'OpenText';
import { QuestionOptionRow } from './questions/QuestionOptionRow';
import { getQuestionTypeLabel } from '../utils/survey-template-formatters';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SurveyQuestionsEditorProps {
  questions: SurveyTemplateQuestion[];
  onChange: (questions: SurveyTemplateQuestion[]) => void;
  errors?: Record<string, string>;
  title?: string;
  showAddButton?: boolean;
  isReadOnly?: boolean;
}

interface SortableQuestionItemProps {
  question: SurveyTemplateQuestion;
  questionIndex: number;
  onUpdate: (index: number, updates: Partial<SurveyTemplateQuestion>) => void;
  onRemove: (index: number) => void;
  onAddOption: (questionIndex: number) => void;
  onUpdateOption: (questionIndex: number, optionIndex: number, text: string) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  errors: Record<string, string>;
  isReadOnly?: boolean;
}

function SortableQuestionItem({
  question,
  questionIndex,
  onUpdate,
  onRemove,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  errors,
  isReadOnly = false,
}: SortableQuestionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id || questionIndex, disabled: isReadOnly });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`border-l-4 border-l-blue-500 ${isDragging ? 'shadow-lg' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              {...attributes}
              {...listeners}
              className={`p-1 hover:bg-gray-100 rounded ${isReadOnly ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}`}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium">Pregunta {questionIndex + 1}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(questionIndex)}
            className="text-red-600 hover:text-red-700"
            disabled={isReadOnly}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-1 block">Texto de la pregunta</Label>
            <Textarea
              value={question.text}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onUpdate(questionIndex, { text: e.target.value })
              }
              placeholder="¿Cuál es tu pregunta?"
              className={`${errors[`question_${questionIndex}_text`] ? 'border-red-500' : ''}`}
              disabled={isReadOnly}
            />
            {errors[`question_${questionIndex}_text`] && (
              <p className="text-sm text-red-500 mt-1">
                {errors[`question_${questionIndex}_text`]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">Tipo de pregunta</Label>
              <Select
                value={question.type}
                onValueChange={(value: string) => onUpdate(questionIndex, {
                  type: value as QuestionType
                })}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SingleChoice">
                    {getQuestionTypeLabel('SingleChoice')}
                  </SelectItem>
                  <SelectItem value="MultipleChoice">
                    {getQuestionTypeLabel('MultipleChoice')}
                  </SelectItem>
                  <SelectItem value="OpenText">
                    {getQuestionTypeLabel('OpenText')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id={`required_${questionIndex}`}
                checked={question.required}
                onCheckedChange={(checked: boolean) =>
                  onUpdate(questionIndex, { required: checked })
                }
                disabled={isReadOnly}
              />
              <Label htmlFor={`required_${questionIndex}`} className={isReadOnly ? 'cursor-not-allowed' : ''}>Pregunta obligatoria</Label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id={`allow_comment_${questionIndex}`}
              checked={!!question.allowComment}
              onCheckedChange={(checked: boolean) => onUpdate(questionIndex, { allowComment: checked })}
              disabled={isReadOnly}
            />
            <Label htmlFor={`allow_comment_${questionIndex}`} className={isReadOnly ? 'cursor-not-allowed' : ''}>Permitir comentario/justificación</Label>
          </div>

          {/* Opciones para preguntas de opción múltiple */}
          {(question.type === 'SingleChoice' || question.type === 'MultipleChoice') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="mb-1 block">Opciones de respuesta</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onAddOption(questionIndex)}
                  disabled={isReadOnly}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Opción
                </Button>
              </div>

              {question.options.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay opciones agregadas
                </p>
              ) : (
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <QuestionOptionRow
                      key={option.id || optionIndex}
                      value={option.text}
                      onChange={(v) => onUpdateOption(questionIndex, optionIndex, v)}
                      onRemove={() => onRemoveOption(questionIndex, optionIndex)}
                      placeholder={`Opción ${optionIndex + 1}`}
                      isReadOnly={isReadOnly}
                    />
                  ))}
                </div>
              )}

              {errors[`question_${questionIndex}_options`] && (
                <p className="text-sm text-red-500 mt-1">
                  {errors[`question_${questionIndex}_options`]}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function SurveyQuestionsEditor({
  questions,
  onChange,
  errors = {},
  title = "Preguntas",
  showAddButton = true,
  isReadOnly = false,
}: SurveyQuestionsEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addQuestion = () => {
    if (isReadOnly) return;
    const newQuestion: SurveyTemplateQuestion = {
      id: `new_${Date.now()}`,
      text: '',
      type: 'SingleChoice',
      order: questions.length + 1,
      required: true,
      allowComment: false,
      options: [],
    };

    onChange([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<SurveyTemplateQuestion>) => {
    if (isReadOnly) return;
    const updatedQuestions = questions.map((q, i) => {
      if (i === index) {
        const updatedQuestion = { ...q, ...updates };
        
        // Si se cambia a texto abierto, limpiar las opciones
        if (updates.type === 'OpenText') {
          updatedQuestion.options = [];
        }
        
        return updatedQuestion;
      }
      return q;
    });
    onChange(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    if (isReadOnly) return;
    const updatedQuestions = questions
      .filter((_, i) => i !== index)
      .map((q, i) => ({ ...q, order: i + 1 }));
    onChange(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    if (isReadOnly) return;
    const question = questions[questionIndex];
    const newOrder = question.options.length + 1;
    const newOption = {
      id: `new_opt_${Date.now()}`,
      text: '',
      value: newOrder.toString(),
      order: newOrder,
      allowOpenText: false,
    };

    updateQuestion(questionIndex, {
      options: [...question.options, newOption],
    });
  };

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    if (isReadOnly) return;
    const question = questions[questionIndex];
    const updatedOptions = question.options.map((opt, i) =>
      i === optionIndex ? { ...opt, text, value: opt.order.toString() } : opt
    );

    updateQuestion(questionIndex, { options: updatedOptions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    if (isReadOnly) return;
    const question = questions[questionIndex];
    const updatedOptions = question.options
      .filter((_, i) => i !== optionIndex)
      .map((opt, i) => {
        const newOrder = i + 1;
        return { ...opt, order: newOrder, value: newOrder.toString() };
      });

    updateQuestion(questionIndex, { options: updatedOptions });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (isReadOnly) return;
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over?.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedQuestions = arrayMove(questions, oldIndex, newIndex);
      const updatedQuestions = reorderedQuestions.map((q, i) => ({ ...q, order: i }));
      onChange(updatedQuestions);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {showAddButton && (
            <Button type="button" onClick={addQuestion} variant="outline" size="sm" disabled={isReadOnly}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Pregunta
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay preguntas agregadas</p>
            {showAddButton && !isReadOnly && (
              <p className="text-sm">Haz clic en "Agregar Pregunta" para comenzar</p>
            )}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={questions.map(q => q.id || q.order)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {questions.map((question, questionIndex) => (
                  <SortableQuestionItem
                    key={question.id || questionIndex}
                    question={question}
                    questionIndex={questionIndex}
                    onUpdate={updateQuestion}
                    onRemove={removeQuestion}
                    onAddOption={addOption}
                    onUpdateOption={updateOption}
                    onRemoveOption={removeOption}
                    errors={errors}
                    isReadOnly={isReadOnly}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {errors.questions && (
          <p className="text-sm text-red-500 mt-2">{errors.questions}</p>
        )}
      </CardContent>
    </Card>
  );
}
