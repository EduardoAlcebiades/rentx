interface IDateProvider {
  currentDate(): Date;
  isBefore(
    startDate: Date | string | number,
    endDate: Date | string | number,
  ): boolean;
  compareInMinutes(
    startDate: Date | string | number,
    endDate: Date | string | number,
  ): number;
  compareInHours(
    startDate: Date | string | number,
    endDate: Date | string | number,
  ): number;
  compareInDays(
    startDate: Date | string | number,
    endDate: Date | string | number,
  ): number;
  convertToUTC(date?: Date | string | number): string;
  addHours(hoursNth: number, date?: Date | string | number): Date;
  addDays(daysNth: number, date?: Date | string | number): Date;
}

export { IDateProvider };
