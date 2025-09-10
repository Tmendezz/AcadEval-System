import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
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
import { SurveyTemplateQuestion, QuestionType } from '../models/survey-template-types';
import { getQuestionTypeLabel } from '../models/survey-template-types';
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
}: SortableQuestionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: questionIndex });

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
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
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
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Texto de la pregunta</Label>
            <Textarea
              value={question.text}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                onUpdate(questionIndex, { text: e.target.value })
              }
              placeholder="¿Cuál es tu pregunta?"
              className={errors[`question_${questionIndex}_text`] ? 'border-red-500' : ''}
            />
            {errors[`question_${questionIndex}_text`] && (
              <p className="text-sm text-red-500 mt-1">
                {errors[`question_${questionIndex}_text`]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de pregunta</Label>
              <Select
                value={question.type.toString()}
                onValueChange={(value: string) => onUpdate(questionIndex, { 
                  type: Number(value) as QuestionType 
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={QuestionType.SingleChoice.toString()}>
                    {getQuestionTypeLabel(QuestionType.SingleChoice)}
                  </SelectItem>
                  <SelectItem value={QuestionType.MultipleChoice.toString()}>
                    {getQuestionTypeLabel(QuestionType.MultipleChoice)}
                  </SelectItem>
                  <SelectItem value={QuestionType.OpenText.toString()}>
                    {getQuestionTypeLabel(QuestionType.OpenText)}
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
              />
              <Label htmlFor={`required_${questionIndex}`}>Pregunta obligatoria</Label>
            </div>
          </div>

          {/* Opciones para preguntas de opción múltiple */}
          {(question.type === QuestionType.SingleChoice || question.type === QuestionType.MultipleChoice) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Opciones de respuesta</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onAddOption(questionIndex)}
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
                    <div key={optionIndex} className="flex items-center gap-2">
                      <Input
                        value={option.text}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          onUpdateOption(questionIndex, optionIndex, e.target.value)
                        }
                        placeholder={`Opción ${optionIndex + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveOption(questionIndex, optionIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
}: SurveyQuestionsEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addQuestion = () => {
    const newQuestion: SurveyTemplateQuestion = {
      text: '',
      type: QuestionType.SingleChoice,
      order: questions.length,
      required: true,
      options: [],
    };

    onChange([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<SurveyTemplateQuestion>) => {
    const updatedQuestions = questions.map((q, i) => 
      i === index ? { ...q, ...updates } : q
    );
    onChange(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions
      .filter((_, i) => i !== index)
      .map((q, i) => ({ ...q, order: i }));
    onChange(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const question = questions[questionIndex];
    const newOption = {
      text: '',
      order: question.options.length,
    };

    updateQuestion(questionIndex, {
      options: [...question.options, newOption],
    });
  };

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    const question = questions[questionIndex];
    const updatedOptions = question.options.map((opt, i) => 
      i === optionIndex ? { ...opt, text } : opt
    );

    updateQuestion(questionIndex, { options: updatedOptions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    const updatedOptions = question.options
      .filter((_, i) => i !== optionIndex)
      .map((opt, i) => ({ ...opt, order: i }));

    updateQuestion(questionIndex, { options: updatedOptions });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = questions.findIndex((_, index) => index === active.id);
      const newIndex = questions.findIndex((_, index) => index === over?.id);

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
            <Button type="button" onClick={addQuestion} variant="outline" size="sm">
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
            {showAddButton && (
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
              items={questions.map((_, index) => index)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {questions.map((question, questionIndex) => (
                  <SortableQuestionItem
                    key={questionIndex}
                    question={question}
                    questionIndex={questionIndex}
                    onUpdate={updateQuestion}
                    onRemove={removeQuestion}
                    onAddOption={addOption}
                    onUpdateOption={updateOption}
                    onRemoveOption={removeOption}
                    errors={errors}
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
