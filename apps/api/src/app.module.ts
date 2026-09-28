import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ModulesModule } from './modules/modules/modules.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { TestsModule } from './modules/tests/tests.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { AttemptsModule } from './modules/attempts/attempts.module';
import { AdminModule } from './modules/admin/admin.module';
import { CurrentAffairsModule } from './modules/current-affairs/current-affairs.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SearchModule } from './modules/search/search.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { ProgressDashboardModule } from './modules/progress-dashboard/progress-dashboard.module';
import { DoubtsModule } from './modules/doubts/doubts.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CoursesModule,
    ModulesModule,
    LessonsModule,
    EnrollmentsModule,
    TestsModule,
    QuestionsModule,
    AttemptsModule,
    AdminModule,
    CurrentAffairsModule,
    BlogsModule,
    ResourcesModule,
    NotificationsModule,
    SearchModule,
    BookmarksModule,
    AnalyticsModule,
    CertificatesModule,
    ProgressDashboardModule,
    DoubtsModule,
    NewsletterModule,
    
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
