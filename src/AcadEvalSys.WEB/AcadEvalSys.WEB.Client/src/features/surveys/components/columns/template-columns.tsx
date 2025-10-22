import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Copy, Trash2, Eye } from 'lucide-react';
import { SurveyTemplateListItem } from '../../models/survey-template-types';
import { getSurveyTemplateStatusLabel, getSurveyTemplateTypeLabel } from '../../utils/survey-template-formatters';

export interface TemplateColumnsDeps {
  onPreview: (template: SurveyTemplateListItem) => void;
  onEdit: (template: SurveyTemplateListItem) => void;
  onDuplicate: (template: SurveyTemplateListItem) => void;
  onDelete: (template: SurveyTemplateListItem) => void;
}

export function getTemplateColumns({
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
}: TemplateColumnsDeps): ColumnDef<SurveyTemplateListItem>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Título',
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      accessorKey: 'surveyType',
      header: 'Tipo',
      cell: ({ row }) => (
        <Badge variant="outline">{getSurveyTemplateTypeLabel(row.original.surveyType)}</Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={row.original.isDraft ? 'secondary' : 'default'}>
          {getSurveyTemplateStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: 'questionCount',
      header: 'Preguntas',
    },
    {
      accessorKey: 'version',
      header: 'Versión',
      cell: ({ row }) => <span>v{row.original.version}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de creación',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('es-ES'),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onPreview(row.original)}>
              <Eye className="h-4 w-4 mr-2" />
              Ver
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(row.original)}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(row.original)} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}


