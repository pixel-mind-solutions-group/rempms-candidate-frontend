import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CandidateAiAssistantService } from './services/candidate-ai-assistant.service';
import {
  ChatMessage,
  JobVacancyCard,
  InterviewDetails,
  QuickQuestion,
} from './models/ai-assistant.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-candidate-ai-assistant',
  templateUrl: './candidate-ai-assistant.component.html',
  styleUrls: ['./candidate-ai-assistant.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class CandidateAiAssistantComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;

  public inputText = '';
  public isMinimized = false;
  public messages: ChatMessage[] = [];
  public isTyping = false;
  public isOpen = false;
  public unreadCount = 0;
  public quickQuestions: QuickQuestion[] = [];

  private subscriptions: Subscription[] = [];
  private shouldScroll = false;

  constructor(
    public aiService: CandidateAiAssistantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quickQuestions = this.aiService.predefinedQuestions;

    this.subscriptions.push(
      this.aiService.messages$.subscribe((msgs) => {
        this.messages = msgs;
        this.shouldScroll = true;
      })
    );

    this.subscriptions.push(
      this.aiService.isTyping$.subscribe((typing) => {
        this.isTyping = typing;
        this.shouldScroll = true;
      })
    );

    this.subscriptions.push(
      this.aiService.isOpen$.subscribe((open) => {
        this.isOpen = open;
        if (open) {
          this.isMinimized = false;
          this.shouldScroll = true;
        }
      })
    );

    this.subscriptions.push(
      this.aiService.unreadCount$.subscribe((count) => {
        this.unreadCount = count;
      })
    );
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  public toggleChat(): void {
    if (this.isMinimized && this.isOpen) {
      this.isMinimized = false;
      this.shouldScroll = true;
    } else {
      this.aiService.toggleChatWindow();
    }
  }

  public toggleMinimize(): void {
    this.isMinimized = !this.isMinimized;
    if (!this.isMinimized) {
      this.shouldScroll = true;
    }
  }

  public closeChat(): void {
    this.aiService.closeChatWindow();
    this.isMinimized = false;
  }

  public onInputKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submitMessage();
    }
  }

  public submitMessage(): void {
    const text = this.inputText.trim();
    if (!text || this.isTyping) return;

    this.aiService.sendMessage(text);
    this.inputText = '';
    this.shouldScroll = true;
  }

  public selectQuestion(query: string): void {
    if (this.isTyping) return;
    this.aiService.sendMessage(query);
    this.shouldScroll = true;
  }

  public viewJobDetails(job: JobVacancyCard): void {
    this.router.navigate(['/job-vacancies']);
    Swal.fire({
      title: job.title,
      html: `
        <div style="text-align: left; font-size: 14px; line-height: 1.6;">
          <p><strong>Employer:</strong> ${job.employer}</p>
          <p><strong>Reference:</strong> ${job.refNo}</p>
          <p><strong>Location:</strong> ${job.location} (${job.type})</p>
          <p><strong>Experience:</strong> ${job.experience}</p>
          <p><strong>Required Skills:</strong> ${job.skills.join(', ')}</p>
          <p><strong>Status:</strong> <span style="color: #10b981; font-weight: 600;">${job.status}</span></p>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'View in Vacancy Portal',
    });
  }

  public applyJob(job: JobVacancyCard): void {
    Swal.fire({
      title: 'Apply for Position',
      text: `Do you want to submit your candidate profile for "${job.title}" at ${job.employer}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Submit Application',
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          title: 'Application Received!',
          text: `Your profile has been forwarded to the hiring team for ${job.refNo}.`,
          icon: 'success',
          confirmButtonColor: '#2563eb',
        });
      }
    });
  }

  public joinInterview(interview: InterviewDetails): void {
    if (interview.locationOrLink) {
      window.open(interview.locationOrLink, '_blank');
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop =
          this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch {
      // ignore
    }
  }
}
