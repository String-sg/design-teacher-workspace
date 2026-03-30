export interface OffenceDetail {
  type: string;
  count: number;
  latestDate: string;
}

export interface CounsellingSubcase {
  name: string;
  count: number;
  latestDate: string;
}

export interface CounsellingCase {
  category: string;
  subcases?: CounsellingSubcase[];
  count?: number;
  latestDate?: string;
}

export interface RiskIndicatorRecord {
  year: number;
  term: string;
  indicators: string[];
}

export interface SocialLinkPerson {
  name: string;
  class: string;
  closenessRating: number | null;
}

export interface SubjectScore {
  subject: string;
  percentage: number;
}

export interface Student {
  id: string;
  name: string;
  class: string;
  cca: string;
  attentionTags: AttentionTag[];
  // Academic Performance
  overallPercentage: number;
  subjectScores?: SubjectScore[];
  conduct: ConductGrade;
  approvedMtl: string | null;
  learningSupport: string | null;
  postSecEligibility: string;
  // Behaviour & Discipline
  offences: number;
  offenceDetails?: OffenceDetail[];
  absences: number;
  lateComing: number;
  ccaMissed: number;
  // Wellbeing
  riskIndicators: number;
  riskIndicatorHistory?: RiskIndicatorRecord[];
  lowMoodFlagged: string | null;
  lowMoodTerms?: string[];
  socialLinks: number;
  selectedBy?: SocialLinkPerson[];
  selectedFriends?: SocialLinkPerson[];
  counsellingSessions: number;
  counsellingCases?: CounsellingCase[];
  sen: string | null;
  fas: string | null;
  // Family, Housing, Finance
  housing: string | null;
  housingType: 'Owned' | 'Rented' | null;
  custody: string | null;
  custodyDetails: string | null;
  commuterStatus: string | null;
  afterSchoolArrangement: string | null;
  siblings: number;
  siblingDetails?: { name: string; class: string }[];
  externalAgencies: string | null;
  // Personal
  birthday?: string;
  citizenship?: 'Singapore citizen' | 'Permanent resident' | 'Foreigner';
  languagesSpoken?: string;
  // School
  schoolName?: string;
  // Student Identity
  nric: string;
  indexNumber: number;
  formTeacher: string;
  coFormTeacher: string | null;
  promotionStatus: string | null;
  daysPresent: number;
  totalSchoolDays: number;
  // Teacher & Action
  teacherObservations: string | null;
  nextSteps: string | null;
}

export type AttentionTag = 'FAS' | 'GEP' | 'LSM' | 'LSP' | 'SEN' | 'LTA' | 'SwAN';

export type ConductGrade = 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';

export interface ClassOption {
  value: string;
  label: string;
}

export type FilterField =
  // General
  | 'class'
  | 'cca'
  // Academic Performance
  | 'overallPercentage'
  | 'conduct'
  | 'approvedMtl'
  | 'learningSupport'
  | 'postSecEligibility'
  // Behaviour and Discipline
  | 'offences'
  | 'absences'
  | 'lateComing'
  | 'ccaMissed'
  // Wellbeing
  | 'riskIndicators'
  | 'lowMoodFlagged'
  | 'socialLinks'
  | 'counsellingSessions'
  | 'sen'
  | 'fas'
  // Family, Housing, Finance
  | 'housing'
  | 'housingType'
  | 'custody'
  | 'commuterStatus'
  | 'afterSchoolArrangement'
  | 'siblings'
  | 'externalAgencies';

export type FilterOperator =
  // Numeric operators
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'eq'
  | 'neq'
  | 'between'
  | 'not_between'
  // Text operators
  | 'contains'
  | 'not_contains'
  | 'is'
  | 'is_not'
  | 'is_empty'
  | 'is_not_empty';

export interface FilterRangeValue {
  min: number;
  max: number;
}

export interface FilterCriterion {
  id: string;
  field: FilterField;
  operator: FilterOperator;
  value: string | number | FilterRangeValue | string[];
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}
