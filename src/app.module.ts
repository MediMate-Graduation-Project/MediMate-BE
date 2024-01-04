import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { HospitalsModule } from './modules/hospitals/hospitals.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { MessagesModule } from './modules/messages/messages.module';
import { SpecializationModule } from './modules/specialization/specialization.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { HealthInsurancesModule } from './modules/health-insurances/health-insurances.module';
import { DiagnosticModule } from './modules/diagnostic/diagnostic.module';
import { MedicalRecordModule } from './modules/medical-record/medical-record.module';



@Module({
  imports: [AuthModule, UsersModule, RolesModule, HospitalsModule, PaymentsModule, MessagesModule, SpecializationModule, ReviewsModule, AppointmentsModule, HealthInsurancesModule, DiagnosticModule, MedicalRecordModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
