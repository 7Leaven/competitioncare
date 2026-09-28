import { Injectable, Logger } from '@nestjs/common';

type ResendClient = {
  emails: {
    send: (options: {
      from: string;
      to: string;
      subject: string;
      html: string;
    }) => Promise<unknown>;
  };
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: ResendClient | null = null;
  private from: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.from = process.env.RESEND_FROM || 'onboarding@resend.dev';
    if (apiKey && apiKey.startsWith('re_')) {
      this.resend = {
        emails: {
          send: async (options) => {
            const response = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(options),
            });

            if (!response.ok) {
              throw new Error(
                `Resend API returned ${response.status}: ${await response.text()}`,
              );
            }

            return response.json();
          },
        },
      };
    } else {
      this.logger.warn('RESEND_API_KEY not set — emails will be skipped');
    }
  }

  private async send(to: string, subject: string, html: string) {
    if (!this.resend) {
      this.logger.warn(`Email skipped (no API key): ${subject} → ${to}`);
      return { skipped: true };
    }

    try {
      const result = await this.resend.emails.send({
        from: this.from,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
      return result;
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err}`);
      return { error: err };
    }
  }

  async sendWelcome(email: string, fullName: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #4F46E5; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">CompetitionCare</h1>
        </div>
        <div style="padding: 32px; background: #f8fafc;">
          <h2>Welcome, ${fullName}! 🎉</h2>
          <p>Thanks for joining CompetitionCare. We're excited to help you ace your competitive exams.</p>
          <p>Here's what you can do right now:</p>
          <ul>
            <li>📚 Explore our structured courses</li>
            <li>📝 Take free practice tests</li>
            <li>📰 Read daily current affairs</li>
          </ul>
          <a href="http://localhost:3000/courses" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">Browse Courses</a>
        </div>
        <div style="padding: 16px; text-align: center; color: #64748b; font-size: 12px;">
          © ${new Date().getFullYear()} CompetitionCare
        </div>
      </div>
    `;
    return this.send(email, 'Welcome to CompetitionCare!', html);
  }

  async sendDoubtAnswered(
    email: string,
    fullName: string,
    subject: string,
    answer: string,
  ) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #4F46E5; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">Doubt Answered</h1>
        </div>
        <div style="padding: 32px; background: #f8fafc;">
          <p>Hi ${fullName},</p>
          <p>Your doubt "<strong>${subject}</strong>" has been answered:</p>
          <div style="background: white; border-left: 4px solid #10B981; padding: 16px; margin: 16px 0;">
            ${answer.replace(/\n/g, '<br>')}
          </div>
          <a href="http://localhost:3000/doubts" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">View on Dashboard</a>
        </div>
      </div>
    `;
    return this.send(email, `Your doubt has been answered: ${subject}`, html);
  }

  async sendEnrollmentConfirmed(
    email: string,
    fullName: string,
    courseTitle: string,
  ) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #4F46E5; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">You're Enrolled! 🎓</h1>
        </div>
        <div style="padding: 32px; background: #f8fafc;">
          <p>Hi ${fullName},</p>
          <p>You've successfully enrolled in <strong>${courseTitle}</strong>.</p>
          <p>Start learning now — every lesson brings you closer to your goal.</p>
          <a href="http://localhost:3000/dashboard" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Go to Dashboard</a>
        </div>
      </div>
    `;
    return this.send(email, `Enrolled in ${courseTitle}`, html);
  }

  async sendTestResult(
    email: string,
    fullName: string,
    testTitle: string,
    score: number,
  ) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #4F46E5; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">Test Result</h1>
        </div>
        <div style="padding: 32px; background: #f8fafc;">
          <p>Hi ${fullName},</p>
          <p>You completed <strong>${testTitle}</strong>.</p>
          <div style="text-align: center; margin: 24px 0;">
            <div style="font-size: 48px; font-weight: bold; color: #4F46E5;">${score}</div>
            <div style="color: #64748b;">Your score</div>
          </div>
          <a href="http://localhost:3000/my-analytics" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">View Analytics</a>
        </div>
      </div>
    `;
    return this.send(email, `Test result: ${testTitle}`, html);
  }

  async sendCustom(email: string, subject: string, message: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #4F46E5; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">CompetitionCare</h1>
        </div>
        <div style="padding: 32px; background: #f8fafc;">
          <h2>${subject}</h2>
          <div>${message.replace(/\n/g, '<br>')}</div>
        </div>
      </div>
    `;
    return this.send(email, subject, html);
  }

  async sendDailyCurrentAffairsDigest(
    email: string,
    name: string,
    articles: { title: string; summary: string; slug: string; category: string }[],
  ) {
    const articlesHtml = articles
      .map(
        (a) => `
      <div style="border-bottom: 1px solid #e2e8f0; padding: 16px 0;">
        <span style="display: inline-block; background: #EEF2FF; color: #4F46E5; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; text-transform: uppercase;">${a.category}</span>
        <h3 style="margin: 8px 0 4px; font-size: 18px;">
          <a href="http://localhost:3000/current-affairs/${a.slug}" style="color: #0F172A; text-decoration: none;">${a.title}</a>
        </h3>
        <p style="color: #64748b; font-size: 14px; margin: 4px 0;">${a.summary || ''}</p>
        <a href="http://localhost:3000/current-affairs/${a.slug}" style="color: #4F46E5; font-size: 13px; font-weight: 500;">Read more →</a>
      </div>
    `,
      )
      .join('');

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #4F46E5; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">Daily Current Affairs</h1>
          <p style="color: #C7D2FE; margin: 4px 0 0;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div style="padding: 24px; background: #f8fafc;">
          <p>Hi ${name || 'there'},</p>
          <p>Here are today's top current affairs for your exam prep:</p>
          ${articlesHtml}
          <div style="text-align: center; margin-top: 24px;">
            <a href="http://localhost:3000/current-affairs" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">View All Current Affairs</a>
          </div>
        </div>
      </div>
    `;
    return this.send(email, 'Daily Current Affairs — CompetitionCare', html);
  }
    async sendTestReminder(
    email: string,
    fullName: string,
    testTitle: string,
    testId: string,
    scheduledAt: Date,
  ) {
    const when = scheduledAt.toLocaleString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #4F46E5; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">Test Reminder</h1>
        </div>
        <div style="padding: 32px; background: #f8fafc;">
          <p>Hi ${fullName},</p>
          <p>Your test <strong>${testTitle}</strong> is scheduled for:</p>
          <div style="background: white; border-left: 4px solid #F59E0B; padding: 16px; margin: 16px 0; font-size: 18px;">
            <strong>${when}</strong>
          </div>
          <p>Make sure you're ready. Good luck! 🎯</p>
          <a href="http://localhost:3000/tests/${testId}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">View Test</a>
        </div>
      </div>
    `;
    return this.send(email, `Reminder: ${testTitle}`, html);
  }

  async sendStreakMilestone(email: string, fullName: string, streak: number) {
    const emoji = streak >= 100 ? '🔥🔥🔥' : streak >= 30 ? '🔥🔥' : '🔥';
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%); padding: 32px; text-align: center;">
          <div style="font-size: 64px;">${emoji}</div>
          <h1 style="color: white; margin: 16px 0 8px;">${streak}-Day Streak!</h1>
          <p style="color: #FEF3C7; margin: 0;">You're unstoppable.</p>
        </div>
        <div style="padding: 32px; background: #f8fafc;">
          <p>Hi ${fullName},</p>
          <p>You've studied on <strong>${streak} consecutive days</strong>. That's serious commitment!</p>
          <p>Keep going — your consistency is what will make you succeed in your exams.</p>
          <a href="http://localhost:3000/progress" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">View Progress</a>
        </div>
      </div>
    `;
    return this.send(email, `${streak}-day streak! Keep going 🔥`, html);
  }
}


