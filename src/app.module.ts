import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import * as path from 'path';
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
  imports: [
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('PG_HOST'),
    //     port: configService.get('PG_PORT'),
    //     username: configService.get('PG_USER'),
    //     password: configService.get('PG_PASSWORD'),
    //     database: configService.get('PG_DB'),

    //     entities:  [path.join(__dirname, '**', '*.entity{.ts,.js}')],
    //     synchronize: true,
    //     isGlobal: true,
    //   }),
    //   inject: [ConfigService], 
    // }),
  AuthModule, UsersModule, RolesModule, HospitalsModule, PaymentsModule, MessagesModule, SpecializationModule, ReviewsModule, AppointmentsModule, HealthInsurancesModule, DiagnosticModule, MedicalRecordModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
