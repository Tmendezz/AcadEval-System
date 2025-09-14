import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useMemo } from 'react';

export interface TechnicalCareer {
  id: string;
  name: string;
}

export interface AudienceCombination {
  careerId: string;
  careerName: string;
  year: number;
}

export interface SurveyAudienceSelectorProps {
  selectedAudiences: AudienceCombination[];
  onAudiencesChange: (audiences: AudienceCombination[]) => void;
  careers: TechnicalCareer[];
  years: number[];
}

export function SurveyAudienceSelector({ 
  selectedAudiences, 
  onAudiencesChange, 
  careers, 
  years 
}: SurveyAudienceSelectorProps) {
  
  const selectedCombinations = useMemo(() => {
    return selectedAudiences.map(a => `${a.careerId}-${a.year}`);
  }, [selectedAudiences]);

  const handleCombinationChange = (careerId: string, careerName: string, year: number, checked: boolean) => {
    const combination = `${careerId}-${year}`;
    
    if (checked) {
      // Agregar combinación
      const newAudience: AudienceCombination = { careerId, careerName, year };
      onAudiencesChange([...selectedAudiences, newAudience]);
    } else {
      // Remover combinación
      onAudiencesChange(selectedAudiences.filter(a => `${a.careerId}-${a.year}` !== combination));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurar Audiencia</CardTitle>
        <p className="text-sm text-muted-foreground">
          Selecciona las tecnicaturas y años de cursado para esta encuesta
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {careers.map((career) => (
            <div key={career.id} className="space-y-2">
              <Label className="text-sm font-medium">{career.name}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {years.map((year) => {
                  const combination = `${career.id}-${year}`;
                  const isSelected = selectedCombinations.includes(combination);
                  
                  return (
                    <div key={year} className="flex items-center space-x-2">
                      <Checkbox
                        id={combination}
                        checked={isSelected}
                        onCheckedChange={(checked) => 
                          handleCombinationChange(career.id, career.name, year, !!checked)
                        }
                      />
                      <Label 
                        htmlFor={combination} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {year}° Año
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {selectedAudiences.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <Label className="text-sm font-medium text-blue-900">Audiencia seleccionada:</Label>
            <div className="mt-1 text-sm text-blue-800">
              {selectedAudiences.map((audience, index) => (
                <div key={index}>
                  {audience.careerName} - {audience.year}° Año
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}