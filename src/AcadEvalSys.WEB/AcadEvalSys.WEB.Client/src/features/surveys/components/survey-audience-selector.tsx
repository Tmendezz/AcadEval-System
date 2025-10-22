import { useState, useEffect } from 'react';
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

interface SurveyAudienceSelectorProps {
  careers: TechnicalCareer[];
  selectedCareerIds: string[];
  selectedYears: CareerYear[];
  onCareerChange: (careerIds: string[]) => void;
  onYearChange: (years: CareerYear[]) => void;
}

export function SurveyAudienceSelector({
  careers,
  selectedCareerIds,
  selectedYears,
  onCareerChange,
  onYearChange
}: SurveyAudienceSelectorProps) {
  const handleCareerToggle = (careerId: string, checked: boolean) => {
    if (checked) {
      onCareerChange([...selectedCareerIds, careerId]);
    } else {
      onCareerChange(selectedCareerIds.filter(id => id !== careerId));
    }
  };

  const handleYearToggle = (year: CareerYear, checked: boolean) => {
    if (checked) {
      onYearChange([...selectedYears, year]);
    } else {
      onYearChange(selectedYears.filter(y => y !== year));
    }
  };

  const selectedCareersLabels = careers
    .filter(career => selectedCareerIds.includes(career.id))
    .map(career => career.name);

  const selectedYearsLabels = selectedYears.map(year => getCareerYearLabel(year));

  const hasValidConfiguration = selectedCareerIds.length > 0 && selectedYears.length > 0;

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
            Selecciona las tecnicaturas y cohortes que participarán en esta encuesta.
            Se incluirán automáticamente todas las asignaturas de las combinaciones seleccionadas.
          </AlertDescription>
        </Alert>

        {/* Selección de tecnicaturas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <Label className="text-base font-medium">Tecnicaturas</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border rounded-md p-3">
            {careers.map(career => (
              <div key={career.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`career-${career.id}`}
                  checked={selectedCareerIds.includes(career.id)}
                  onCheckedChange={(checked) => 
                    handleCareerToggle(career.id, checked as boolean)
                  }
                />
                <Label htmlFor={`career-${career.id}`} className="cursor-pointer text-sm">
                  {career.name}
                </Label>
              </div>
            ))}
          </div>

          {selectedCareersLabels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Tecnicaturas seleccionadas:</Badge>
              {selectedCareersLabels.map(careerName => (
                <Badge key={careerName} variant="outline">{careerName}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Selección de cohortes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <Label className="text-base font-medium">Cohortes (Años de Cursado)</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CAREER_YEARS.map(year => (
              <div key={year.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`year-${year.value}`}
                  checked={selectedYears.includes(year.value)}
                  onCheckedChange={(checked) => 
                    handleYearToggle(year.value, checked as boolean)
                  }
                />
                <Label htmlFor={`year-${year.value}`} className="cursor-pointer">
                  {year.label}
                </Label>
              </div>
            ))}
          </div>

          {selectedYearsLabels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Cohortes seleccionadas:</Badge>
              {selectedYearsLabels.map(yearLabel => (
                <Badge key={yearLabel} variant="outline">{yearLabel}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Resumen de configuración */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Resumen de Audiencia</Label>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Tecnicaturas:</strong> {selectedCareersLabels.length > 0 ? selectedCareersLabels.join(', ') : 'Ninguna seleccionada'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Cohortes:</strong> {selectedYearsLabels.length > 0 ? selectedYearsLabels.join(', ') : 'Ninguna seleccionada'}
              </span>
            </div>
          </div>
        </div>

        {/* Validación */}
        {!hasValidConfiguration && (
          <Alert variant="destructive">
            <AlertDescription>
              Debes seleccionar al menos una tecnicatura y una cohorte.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}