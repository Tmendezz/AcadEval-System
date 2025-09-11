import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Plus, X } from 'lucide-react';

interface CareerYearOption {
  careerId: string;
  careerName: string;
  year: number;
  yearLabel: string;
}

interface SurveyAudienceSelectorProps {
  selectedAudiences: CareerYearOption[];
  onAudiencesChange: (audiences: CareerYearOption[]) => void;
  availableCareers: Array<{ id: string; name: string }>;
  availableYears: Array<{ value: number; label: string }>;
}

export function SurveyAudienceSelector({ 
  selectedAudiences, 
  onAudiencesChange, 
  availableCareers, 
  availableYears 
}: SurveyAudienceSelectorProps) {
  // Usar useMemo para evitar re-renders innecesarios
  const selectedCombinations = useMemo(() => {
    return new Set(selectedAudiences.map(a => `${a.careerId}-${a.year}`));
  }, [selectedAudiences]);

  const handleCareerYearToggle = (careerId: string, year: number) => {
    const key = `${careerId}-${year}`;
    const newCombinations = new Set(selectedCombinations);
    
    if (newCombinations.has(key)) {
      newCombinations.delete(key);
    } else {
      newCombinations.add(key);
    }
    
    // Actualizar audiences directamente
    const newAudiences: CareerYearOption[] = [];
    newCombinations.forEach(combination => {
      const [careerId, yearStr] = combination.split('-');
      const year = parseInt(yearStr);
      const career = availableCareers.find(c => c.id === careerId);
      const yearInfo = availableYears.find(y => y.value === year);
      
      if (career && yearInfo) {
        newAudiences.push({
          careerId: careerId,
          careerName: career.name,
          year: year,
          yearLabel: yearInfo.label
        });
      }
    });
    
    onAudiencesChange(newAudiences);
  };

  const selectAll = () => {
    const allAudiences: CareerYearOption[] = [];
    availableCareers.forEach(career => {
      availableYears.forEach(year => {
        allAudiences.push({
          careerId: career.id,
          careerName: career.name,
          year: year.value,
          yearLabel: year.label
        });
      });
    });
    
    onAudiencesChange(allAudiences);
  };

  const clearAll = () => {
    onAudiencesChange([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Configuración de Audiencia</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>
              <Plus className="w-4 h-4 mr-1" />
              Seleccionar Todo
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll}>
              <X className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground">
          Selecciona las carreras y años a los que se enviará la encuesta:
        </div>
        
        <div className="space-y-4">
          {availableCareers.map(career => (
            <div key={career.id} className="space-y-2">
              <Label className="text-base font-medium">{career.name}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableYears.map(year => {
                  const key = `${career.id}-${year.value}`;
                  const isSelected = selectedCombinations.has(key);
                  
                  return (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={isSelected}
                        onCheckedChange={() => handleCareerYearToggle(career.id, year.value)}
                      />
                      <Label 
                        htmlFor={key} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {year.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {selectedAudiences.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Audiencia seleccionada:</Label>
            <div className="flex flex-wrap gap-2">
              {selectedAudiences.map((audience, index) => (
                <Badge key={index} variant="secondary">
                  {audience.careerName} - {audience.yearLabel}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
