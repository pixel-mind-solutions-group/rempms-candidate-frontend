import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import {
  ChatMessage,
  JobVacancyCard,
  ApplicationProgress,
  InterviewDetails,
  RecruitmentProcessInfo,
  QuickQuestion,
} from '../models/ai-assistant.model';

@Injectable({
  providedIn: 'root',
})
export class CandidateAiAssistantService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$: Observable<ChatMessage[]> = this.messagesSubject.asObservable();

  private isTypingSubject = new BehaviorSubject<boolean>(false);
  public isTyping$: Observable<boolean> = this.isTypingSubject.asObservable();

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  public isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(1);
  public unreadCount$: Observable<number> = this.unreadCountSubject.asObservable();

  // Mock domain datasets matching PixelMind Candidate Portal
  private mockJobs: JobVacancyCard[] = [
    {
      id: 'job-101',
      refNo: 'REF-2026-SE01',
      title: 'Senior Software Engineer – Full Stack',
      employer: 'PixelMind IT Solutions',
      location: 'Colombo / Hybrid',
      type: 'Full-time',
      experience: '3+ years',
      skills: ['Java', 'Spring Boot', 'Angular', 'PostgreSQL'],
      status: 'Accepting applications',
    },
    {
      id: 'job-102',
      refNo: 'REF-2026-CA02',
      title: 'Cloud DevOps Architect',
      employer: 'Global Tech Cloud Services',
      location: 'Remote',
      type: 'Full-time',
      experience: '4+ years',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
      status: 'Accepting applications',
    },
    {
      id: 'job-103',
      refNo: 'REF-2026-UI03',
      title: 'Lead UI/UX Product Designer',
      employer: 'PixelMind Design Labs',
      location: 'Colombo / On-site',
      type: 'Full-time',
      experience: '2+ years',
      skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
      status: 'Actively Hiring',
    },
  ];

  private mockApplication: ApplicationProgress = {
    id: 'app-9021',
    refNo: 'APP-2026-8842',
    position: 'Senior Software Engineer – Full Stack',
    company: 'PixelMind IT Solutions',
    appliedDate: 'August 28, 2026',
    currentStage: 'Technical Interview',
    stages: [
      {
        id: 'stg-1',
        name: 'Application Submitted',
        status: 'completed',
        date: 'Aug 28, 2026',
        note: 'Application verified and received by HR',
      },
      {
        id: 'stg-2',
        name: 'CV Screening',
        status: 'completed',
        date: 'Sep 02, 2026',
        note: 'Profile matched core tech requirements (96%)',
      },
      {
        id: 'stg-3',
        name: 'Initial HR Screening',
        status: 'completed',
        date: 'Sep 08, 2026',
        note: 'Culture fit & compensation alignment passed',
      },
      {
        id: 'stg-4',
        name: 'Technical Interview',
        status: 'current',
        date: 'Sep 18, 2026 • 10:00 AM',
        note: 'System Architecture & Live Problem Solving',
      },
      {
        id: 'stg-5',
        name: 'Hiring Manager Review',
        status: 'upcoming',
        note: 'Executive leadership evaluation',
      },
      {
        id: 'stg-6',
        name: 'Final Decision & Offer',
        status: 'upcoming',
        note: 'Official appointment letter issuance',
      },
    ],
  };

  private mockInterview: InterviewDetails = {
    id: 'int-4431',
    title: 'Technical Interview – Architecture & Coding',
    date: 'Wednesday, 18 September 2026',
    time: '10:00 AM – 11:00 AM (IST)',
    interviewType: 'Online (Microsoft Teams Video Call)',
    stage: 'Technical Round (Stage 4 of 6)',
    status: 'Upcoming',
    interviewer: 'Lead Technical Architect & Engineering Panel',
    locationOrLink: 'https://teams.microsoft.com/l/meetup-join/pixelmind-tech-interview',
    prepTips: [
      'Review Java 17+, Spring Boot microservices design patterns, and REST best practices.',
      'Be prepared to discuss real-world database optimization in PostgreSQL.',
      'Have your preferred IDE ready for a 20-minute live code pairing session.',
      'Ensure a quiet environment and test your webcam and microphone 10 minutes prior.',
    ],
  };

  private mockProcessInfo: RecruitmentProcessInfo = {
    title: 'PixelMind Candidate Recruitment Journey',
    totalExpectedDuration: '2 to 3 weeks on average',
    stages: [
      {
        name: '1. Online Application',
        description: 'Candidate submits profile with resume and key technical credentials.',
        expectedDuration: '1 - 2 business days',
      },
      {
        name: '2. Talent Screening',
        description: 'Recruitment team reviews skill matches and profile portfolio.',
        expectedDuration: '2 - 3 business days',
      },
      {
        name: '3. Initial Conversation',
        description: '30-minute introductory call to align on role expectations and culture fit.',
        expectedDuration: '1 business day',
      },
      {
        name: '4. Technical Deep Dive',
        description: 'In-depth architectural review and practical problem solving session.',
        expectedDuration: 'Scheduled at candidate convenience',
      },
      {
        name: '5. Executive Discussion & Offer',
        description: 'Final conversation with department head and tailored offer presentation.',
        expectedDuration: '2 - 3 business days following interview',
      },
    ],
  };

  public predefinedQuestions: QuickQuestion[] = [
    {
      id: 'q-jobs-avail',
      label: '🔎 Available Jobs',
      icon: 'fa-briefcase',
      query: 'Show me available jobs',
      category: 'jobs',
    },
    {
      id: 'q-jobs-match',
      label: '💼 Matching My Profile',
      icon: 'fa-wand-magic-sparkles',
      query: 'Find jobs matching my profile',
      category: 'jobs',
    },
    {
      id: 'q-app-status',
      label: '📋 Application Status',
      icon: 'fa-list-check',
      query: "What's my application status?",
      category: 'application',
    },
    {
      id: 'q-int-stage',
      label: '🎯 Interview Stage',
      icon: 'fa-bullseye',
      query: 'What stage is my interview at?',
      category: 'interview',
    },
    {
      id: 'q-int-upcoming',
      label: '📅 Upcoming Interview',
      icon: 'fa-calendar-days',
      query: 'Do I have an upcoming interview?',
      category: 'interview',
    },
    {
      id: 'q-int-prep',
      label: '📝 How to Prepare',
      icon: 'fa-clipboard-question',
      query: 'What should I prepare for my interview?',
      category: 'interview',
    },
    {
      id: 'q-proc-after',
      label: '🔄 Post-Interview Steps',
      icon: 'fa-arrow-progress',
      query: 'What happens after my interview?',
      category: 'process',
    },
    {
      id: 'q-help-general',
      label: '❓ What can you do?',
      icon: 'fa-circle-question',
      query: 'What can you help me with?',
      category: 'general',
    },
  ];

  constructor(private router: Router) {
    this.initGreeting();
  }

  private initGreeting() {
    const candidateName = this.getAuthenticatedCandidateName();
    const currentRoute = this.router.url;
    let contextualHint = '';

    if (currentRoute.includes('job-vacancies')) {
      contextualHint = ' I noticed you are exploring active vacancies today.';
    } else if (currentRoute.includes('my-jobs')) {
      contextualHint = ' I can provide real-time updates on your tracked applications.';
    }

    const greetingMessage: ChatMessage = {
      id: 'msg-init-1',
      sender: 'assistant',
      timestamp: new Date(),
      text: `Hi ${candidateName}! 👋 I'm your Candidate Assistant. I can help you with active job vacancies, tracking your application status, interview schedules, and recruitment guidance.${contextualHint}\n\nWhat would you like to know?`,
      type: 'text',
      suggestedQuestions: [
        '🔎 Show me available jobs',
        "📋 What's my application status?",
        '📅 Do I have an upcoming interview?',
      ],
    };

    this.messagesSubject.next([greetingMessage]);
  }

  public getAuthenticatedCandidateName(): string {
    try {
      const stored = sessionStorage.getItem('userDetails');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.candidate?.firstName) {
          return parsed.candidate.firstName;
        }
        if (parsed?.userName) {
          return parsed.userName;
        }
      }
    } catch {
      // ignore
    }
    return 'there';
  }

  public toggleChatWindow(): void {
    const nextState = !this.isOpenSubject.value;
    this.isOpenSubject.next(nextState);
    if (nextState) {
      this.unreadCountSubject.next(0);
    }
  }

  public openChatWindow(): void {
    this.isOpenSubject.next(true);
    this.unreadCountSubject.next(0);
  }

  public closeChatWindow(): void {
    this.isOpenSubject.next(false);
  }

  public sendMessage(userText: string): void {
    const trimmed = userText.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date(),
      text: trimmed,
      type: 'text',
    };

    const currentMsgs = this.messagesSubject.value;
    this.messagesSubject.next([...currentMsgs, userMsg]);
    this.isTypingSubject.next(true);

    // Simulate AI response delay
    this.generateAiResponse(trimmed).pipe(
      delay(750),
      tap((responseMsg) => {
        this.isTypingSubject.next(false);
        this.messagesSubject.next([...this.messagesSubject.value, responseMsg]);
      })
    ).subscribe();
  }

  private generateAiResponse(query: string): Observable<ChatMessage> {
    const q = query.toLowerCase();

    // 1. Available Vacancies / Job Matching
    if (q.includes('available job') || q.includes('vacanc') || q.includes('show jobs') || q.includes('find job') || q.includes('matching my profile') || q.includes('roles')) {
      const response: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date(),
        text: 'Here are active opportunities currently accepting applications tailored to technical candidates:',
        type: 'jobs',
        jobsData: this.mockJobs,
        suggestedQuestions: [
          'What are the requirements for Full Stack Engineer?',
          "What's my application status?",
          'How do I apply for a role?',
        ],
      };
      return of(response);
    }

    // 2. Application Status / Timeline
    if (q.includes('application status') || q.includes('my application') || q.includes('submitted application') || q.includes('track application') || q.includes('progress')) {
      const response: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date(),
        text: `Here is the current real-time progress for your application for **${this.mockApplication.position}**:`,
        type: 'application_status',
        applicationData: this.mockApplication,
        suggestedQuestions: [
          'When is my technical interview?',
          'What should I prepare for my interview?',
          'What happens after this stage?',
        ],
      };
      return of(response);
    }

    // 3. Interview Schedule / Upcoming Interview
    if (q.includes('upcoming interview') || q.includes('scheduled interview') || q.includes('date') || q.includes('when is my interview') || q.includes('time')) {
      const response: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date(),
        text: 'You have an upcoming interview scheduled! Here are your verified session coordinates:',
        type: 'interview',
        interviewData: this.mockInterview,
        suggestedQuestions: [
          'What should I prepare for my interview?',
          'What happens after my interview?',
          'Can I reschedule if needed?',
        ],
      };
      return of(response);
    }

    // 4. Interview Stage / Current Step
    if (q.includes('stage') || q.includes('which round') || q.includes('current step')) {
      const response: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date(),
        text: `Your application for **${this.mockApplication.position}** is currently at the **Technical Interview stage** (Stage 4 of 6).\n\nYour session is confirmed for **September 18 at 10:00 AM**.\n\nNext progression: **Technical Interview → Hiring Manager Review → Final Decision**.\n\nWould you like review tips or interview details?`,
        type: 'text',
        suggestedQuestions: [
          'Show interview details',
          'What should I prepare for my interview?',
          "What's my application status?",
        ],
      };
      return of(response);
    }

    // 5. Interview Preparation
    if (q.includes('prepare') || q.includes('tips') || q.includes('how to prepare') || q.includes('study')) {
      const tipsList = this.mockInterview.prepTips.map((tip, idx) => `${idx + 1}. ${tip}`).join('\n');
      const response: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date(),
        text: `Here are recommended preparation guidelines for your upcoming **${this.mockInterview.title}**:\n\n${tipsList}\n\nOur interviewers prioritize clear communication, clean code structure, and architectural reasoning over memorized syntax.`,
        type: 'text',
        suggestedQuestions: [
          'Show my interview schedule',
          'What happens after my interview?',
          'Contact recruitment team',
        ],
      };
      return of(response);
    }

    // 6. Recruitment Process Timeline & Steps
    if (q.includes('recruitment process') || q.includes('how long') || q.includes('after my interview') || q.includes('hiring process') || q.includes('steps')) {
      const response: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date(),
        text: `The standard hiring cycle at PixelMind takes approximately **${this.mockProcessInfo.totalExpectedDuration}**. Following your technical session, the panel submits their scorecards within 48 hours for Hiring Manager Review:`,
        type: 'process',
        processData: this.mockProcessInfo,
        suggestedQuestions: [
          "What's my application status?",
          'Do I have an upcoming interview?',
          'Show available jobs',
        ],
      };
      return of(response);
    }

    // 7. General Capabilities / Help
    if (q.includes('help') || q.includes('what can you do') || q.includes('who are you') || q.includes('features')) {
      const response: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date(),
        text: 'I am your dedicated **Candidate Assistant** for the PixelMind Candidate Portal.\n\nHere is how I can assist you:\n• **Explore Roles**: Browse live openings and matching recommendations.\n• **Application Tracking**: Check your submitted applications and real-time stage progress.\n• **Interview Coordinator**: View upcoming dates, meeting links, and preparation guides.\n• **Recruitment FAQ**: Learn about hiring timelines, next steps, and company culture.',
        type: 'text',
        suggestedQuestions: [
          '🔎 Show me available jobs',
          "📋 What's my application status?",
          '📅 Do I have an upcoming interview?',
        ],
      };
      return of(response);
    }

    // 8. Default fallback
    const fallback: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date(),
      text: `I understand you are asking about "${query}". While I am continuously expanding my capabilities, you can ask me directly about active vacancies, your application progress, or upcoming interview schedules.\n\nHow would you like to proceed?`,
      type: 'text',
      suggestedQuestions: [
        '🔎 Show me available jobs',
        "📋 What's my application status?",
        '📅 Do I have an upcoming interview?',
        'Contact Recruitment Team',
      ],
    };
    return of(fallback);
  }
}
