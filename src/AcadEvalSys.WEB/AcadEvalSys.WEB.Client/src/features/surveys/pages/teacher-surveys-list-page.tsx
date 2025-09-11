import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { DataTable } from '@/shared/components/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'wouter';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Eye, CheckCircle } from 'lucide-react';

type Row = {
  id: string;
  title: string;
  status: 'Published' | 'Closed' | 'Draft';
  createdAt: string;
  responded: boolean;
  responseCount?: number;
};

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'title', header: 'Título' },
  { 
    accessorKey: 'status', 
    header: 'Estado', 
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = { Published: 'default', Closed: 'success', Draft: 'secondary' }[status] as any;
      return <Badge variant={variant}>{status}</Badge>;
    }
  },
  { 
    accessorKey: 'responded', 
    header: 'Estado', 
    cell: ({ row }) => {
      const { responded } = row.original;
      return responded ? (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Completada
        </Badge>
      ) : (
        <Badge variant="outline">Pendiente</Badge>
      );
    }
  },
  { 
    accessorKey: 'createdAt', 
    header: 'Creada', 
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString() 
  },
  { 
    id: 'actions', 
    header: 'Acciones', 
    cell: ({ row }) => {
      const { id, status, responded } = row.original;
      
      if (status === 'Published' && !responded) {
        return (
          <Button asChild size="sm">
            <Link href={`/encuestas/docente/responder/${id}`}>
              Responder
            </Link>
          </Button>
        );
      }
      
      if (responded) {
        return (
          <Button variant="outline" size="sm" disabled>
            <Eye className="w-4 h-4 mr-1" />
            Completada
          </Button>
        );
      }
      
      return <span className="text-muted-foreground text-sm">No disponible</span>;
    }
  },
];

export default function TeacherSurveysListPage() {
  // TODO: reemplazar con fetch real para docente
  const data: Row[] = [];

  return (
    <PageLayout>
      <PageHeader 
        title="Mis Encuestas" 
        description="Encuestas asignadas para completar" 
      />
      <PageContent>
        <DataTable columns={columns} data={data} />
      </PageContent>
    </PageLayout>
  );
}


