export type MessageSender = 'user' | 'assistant';
export type MessageContentType = 'text' | 'jobs' | 'application_status' | 'interview' | 'process' | 'error';

export interface JobVacancyCard {
  id: string;
  title: string;
  employer: string;
  location: string;
  type: string; // e.g., 'Full-time', 'Hybrid', 'Remote'
  experience: string;
  skills: string[];
  status: string; // e.g., 'Accepting applications'
  refNo: string;
}

export interface ApplicationTimelineStage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
  note?: string;
}

export interface ApplicationProgress {
  id: string;
  position: string;
  refNo: string;
  company: string;
  appliedDate: string;
  currentStage: string;
  stages: ApplicationTimelineStage[];
}

export interface InterviewDetails {
  id: string;
  title: string;
  date: string;
  time: string;
  interviewType: string; // e.g., 'Online (Microsoft Teams / Zoom)'
  stage: string;
  status: 'Upcoming' | 'Completed' | 'Pending Scheduling';
  interviewer?: string;
  locationOrLink?: string;
  prepTips: string[];
}

export interface RecruitmentProcessInfo {
  title: string;
  stages: { name: string; description: string; expectedDuration: string }[];
  totalExpectedDuration: string;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  timestamp: Date;
  text: string;
  type: MessageContentType;
  jobsData?: JobVacancyCard[];
  applicationData?: ApplicationProgress;
  interviewData?: InterviewDetails;
  processData?: RecruitmentProcessInfo;
  suggestedQuestions?: string[];
}

export interface QuickQuestion {
  id: string;
  label: string;
  icon: string;
  query: string;
  category: 'jobs' | 'application' | 'interview' | 'process' | 'general';
}
