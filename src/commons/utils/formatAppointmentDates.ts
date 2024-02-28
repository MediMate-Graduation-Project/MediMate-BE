function formatDateTime(dateTime: Date): string {
  const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh', // Set to Vietnam Time Zone
  };
  return dateTime.toLocaleDateString('en-VN', options);
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh', // Set to Vietnam Time Zone
  };
  return date.toLocaleDateString('en-US', options);
}

// Function to format appointment dates
export function formatAppointmentDates(appointment: any): any {
  if (appointment) {
      // Format estimated
      appointment.estimatedFormatted = formatDateTime(appointment.estimated);

      // Format endTime
      appointment.endTimeFormatted = formatDateTime(appointment.endTime);

      // Format date
      appointment.dateFormatted = formatDate(appointment.date);
  }
  delete appointment.estimated;
  delete appointment.endTime;
  delete appointment.date;
  
  return appointment;
}
