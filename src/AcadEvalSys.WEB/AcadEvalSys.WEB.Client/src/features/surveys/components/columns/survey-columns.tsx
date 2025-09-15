import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Badge } from '@/shared/components/ui/badge';
import { MoreHorizontal, Edit, Copy, Eye, Archive, Trash2 } from 'lucide-react';
import { SurveyListItem } from '../../models/survey-types';
import { getSurveyStatusLabel } from '../../utils/survey-formatters';

function getStatusVariant(status: number) {
  switch (status) {
    case 0:
      return 'secondary'; // Draft
    case 1:
      return 'outline'; // Scheduled
    case 2:
      return 'default'; // Published
    case 3:
      return 'destructive'; // Closed
    case 4:
      return 'outline'; // Archived
    default:
      return 'secondary';
  }
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export interface SurveyColumnsDeps {
  onView?: (survey: SurveyListItem) => void;
  onEdit?: (survey: SurveyListItem) => void;
  onDuplicate?: (survey: SurveyListItem) => void;
  onArchive?: (survey: SurveyListItem) => void;
  onDelete?: (survey: SurveyListItem) => void;
}

export function createSurveyColumns({
  onView,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
}: SurveyColumnsDeps): ColumnDef<SurveyListItem>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Título',
      cell: ({ row }) => <span className="font-medium line-clamp-2">{row.original.title}</span>,
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => (
        <span className="text-muted-foreground line-clamp-2">{row.original.description}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {getSurveyStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: 'questionsCount',
      header: 'Preguntas',
    },
    {
      accessorKey: 'createdBy',
      header: 'Autor',
    },
    {
      accessorKey: 'createdAt',
      header: 'Creada',
      cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
    },
    {
      accessorKey: 'publishedAt',
      header: 'Publicada',
      cell: ({ row }) => (row.original.publishedAt ? formatDate(row.original.publishedAt) : '—'),
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
            {onView && (
              <DropdownMenuItem onClick={() => onView(row.original)}>
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
            )}
            {onDuplicate && (
              <DropdownMenuItem onClick={() => onDuplicate(row.original)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </DropdownMenuItem>
            )}
            {(onArchive || onDelete) && <DropdownMenuSeparator />}
            {onArchive && (
              <DropdownMenuItem onClick={() => onArchive(row.original)}>
                <Archive className="h-4 w-4 mr-2" />
                Archivar
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(row.original)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}


