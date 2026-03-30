import { Eye } from 'lucide-react';
import { useState } from 'react';

import type { HolisticReport, SchoolLevel } from '~/apps/pg/types/report';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/shared/components/ui/tabs';

import { AcademicTab } from './academic-tab';
import { CCASection } from './cca-section';
import { CoreValuesSection } from './core-values-section';
import { PhysicalFitnessSection } from './physical-fitness-section';
import { ReportOverviewTab } from './report-overview-tab';
import { VIASection } from './via-section';

function getFirstName(name: string): string {
  return name.split(' ').filter((part) => part.length > 0)[0] ?? name;
}

interface HdpPreviewStepProps {
  report: HolisticReport;
  selectedSections: Record<string, boolean>;
  schoolLevel: SchoolLevel;
}

export function HdpPreviewStep({ report, selectedSections, schoolLevel }: HdpPreviewStepProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const hasHolistic =
    selectedSections.coreValues ||
    selectedSections.physicalFitness ||
    selectedSections.via ||
    selectedSections.cca;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <Eye className="size-4 shrink-0" />
        <span>
          This is how the report card will appear when downloaded or sent to parents. Review before
          saving.
        </span>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as string)}>
        <TabsList variant="line">
          <TabsTrigger
            value="overview"
            className="data-active:text-[#f26c47] data-active:after:bg-[#f26c47]"
          >
            Overview
          </TabsTrigger>
          {selectedSections.academic && (
            <TabsTrigger
              value="academic"
              className="data-active:text-[#f26c47] data-active:after:bg-[#f26c47]"
            >
              Academic
            </TabsTrigger>
          )}
          {hasHolistic && (
            <TabsTrigger
              value="holistic"
              className="data-active:text-[#f26c47] data-active:after:bg-[#f26c47]"
            >
              Holistic
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview">
          <ReportOverviewTab
            report={report}
            onViewHolistic={hasHolistic ? () => setActiveTab('holistic') : undefined}
          />
        </TabsContent>

        {selectedSections.academic && (
          <TabsContent value="academic">
            <AcademicTab
              data={report.academic}
              secondaryData={report.secondaryAcademic}
              schoolLevel={schoolLevel}
            />
          </TabsContent>
        )}

        {hasHolistic && (
          <TabsContent value="holistic">
            <div className="flex flex-col gap-6 pt-4">
              {selectedSections.coreValues && (
                <CoreValuesSection
                  coreValues={report.holistic.coreValues}
                  studentFirstName={getFirstName(report.studentName)}
                />
              )}
              {selectedSections.physicalFitness && (
                <PhysicalFitnessSection fitness={report.holistic.physicalFitness} />
              )}
              {selectedSections.via && <VIASection activities={report.holistic.via} />}
              {selectedSections.cca && <CCASection ccaList={report.holistic.cca} />}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
