interface IDateProvider {
  compareInHours(startDate: Date, endDate: Date): number;
  convertToUTC(date?: Date): string;
  currentDate(): Date;
}

export { IDateProvider };
