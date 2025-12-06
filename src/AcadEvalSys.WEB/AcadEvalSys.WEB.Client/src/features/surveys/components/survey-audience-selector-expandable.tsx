import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Badge } from '@/shared/components/ui/badge';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Info, Users, GraduationCap } from 'lucide-react';
import { TechnicalCareer } from '../hooks/use-surveys';
import { CareerYear } from '../models/survey-types';

const CAREER_YEARS = [
  { value: CareerYear.First, label: '1° Año' },
  { value: CareerYear.Second, label: '2° Año' },
  { value: CareerYear.Third, label: '3° Año' }
];

const getCareerYearLabel = (year: CareerYear): string => {
  const careerYear = CAREER_YEARS.find(cy => cy.value === year);
  return careerYear?.label || `${year}° Año`;
};

interface SurveyAudienceSelectorExpandableProps {
  careers: TechnicalCareer[];
  selectedCareerIds: string[];
  selectedYears: CareerYear[];
  onCareerChange: (careerIds: string[]) => void;
  onYearChange: (years: CareerYear[]) => void;
}

export function SurveyAudienceSelectorExpandable({
  careers,
  selectedCareerIds,
  selectedYears,
  onCareerChange,
  onYearChange
}: SurveyAudienceSelectorExpandableProps) {
  // Todas las carreras están incluidas por defecto, selectedCareerIds representa las excluidas
  const excludedCareerIds = useMemo(() => {
    return selectedCareerIds; // selectedCareerIds ahora representa las excluidas
  }, [selectedCareerIds]);

  const handleCareerToggle = (careerId: string, checked: boolean) => {
    if (checked) {
      // Incluir carrera (quitar de excluidas)
      const newExcluded = selectedCareerIds.filter(id => id !== careerId);
      onCareerChange(newExcluded);
    } else {
      // Excluir carrera (agregar a excluidas)
      const newExcluded = [...selectedCareerIds, careerId];
      onCareerChange(newExcluded);
    }
  };

  const handleYearToggle = (year: CareerYear, checked: boolean) => {
    if (checked) {
      onYearChange([...selectedYears, year]);
    } else {
      onYearChange(selectedYears.filter(y => y !== year));
    }
  };

  // Verificar si una cohorte específica está excluida
  const isYearExcluded = (year: CareerYear) => {
    return selectedYears.includes(year);
  };

  const selectedCareersLabels = careers
    .filter(career => !excludedCareerIds.includes(career.id))
    .map(career => career.name);

  const hasValidConfiguration = selectedCareersLabels.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Configuración de Audiencia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información general */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Selecciona las tecnicaturas que participarán en esta encuesta. 
            Por defecto se incluyen todas las cohortes (1°, 2°, 3° año).
          </AlertDescription>
        </Alert>

        {/* Lista simple de tecnicaturas */}
        <div className="space-y-6">
          <Label className="text-base font-medium">Tecnicaturas</Label>
          <div className="space-y-6">
            {careers.map((career) => {
              const isIncluded = !excludedCareerIds.includes(career.id);
              return (
                <div key={career.id} className="border border-border rounded-lg p-4 space-y-3 bg-card">
                  {/* Checkbox de tecnicatura */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`career-${career.id}`}
                      checked={isIncluded}
                      onCheckedChange={(checked) => handleCareerToggle(career.id, checked as boolean)}
                    />
                    <Label htmlFor={`career-${career.id}`} className="cursor-pointer text-base font-medium">
                      {career.name}
                    </Label>
                  </div>

                  {/* Checkboxes de cohortes (solo si la tecnicatura está incluida) */}
                  {isIncluded && (
                    <div className="ml-6 space-y-3 border-l-2 border-primary/20 pl-4">
                      <Label className="text-sm text-muted-foreground">
                        Seleccionar cohortes específicas:
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {CAREER_YEARS.map(year => (
                          <div key={year.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${career.id}-year-${year.value}`}
                              checked={!isYearExcluded(year.value)}
                              onCheckedChange={(checked) => 
                                handleYearToggle(year.value, !checked as boolean)
                              }
                            />
                            <Label htmlFor={`${career.id}-year-${year.value}`} className="cursor-pointer text-sm">
                              {year.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>


        {/* Validación */}
        {!hasValidConfiguration && (
          <Alert variant="destructive">
            <AlertDescription>
              Debes seleccionar al menos una tecnicatura.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}