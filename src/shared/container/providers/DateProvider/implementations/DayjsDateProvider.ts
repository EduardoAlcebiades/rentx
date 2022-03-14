import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IDateProvider } from '../IDateProvider';

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  currentDate(): Date {
    const currentDate = dayjs().toDate();

    return currentDate;
  }

  isBefore(
    startDate: string | number | Date,
    endDate: string | number | Date,
  ): boolean {
    const parsedStartDate = this.convertToUTC(startDate);
    const parsedEndDate = this.convertToUTC(endDate);

    return dayjs(parsedStartDate).isBefore(parsedEndDate);
  }

  compareInMinutes(
    startDate: string | number | Date,
    endDate: string | number | Date,
  ): number {
    const parsedStartDate = this.convertToUTC(startDate);
    const parsedEndDate = this.convertToUTC(endDate);

    const difference = dayjs(parsedEndDate).diff(parsedStartDate, 'minutes');

    return difference;
  }

  compareInHours(
    startDate: Date | string | number,
    endDate: Date | string | number,
  ): number {
    const parsedStartDate = this.convertToUTC(startDate);
    const parsedEndDate = this.convertToUTC(endDate);

    const difference = dayjs(parsedEndDate).diff(parsedStartDate, 'hours');

    return difference;
  }

  compareInDays(
    startDate: Date | string | number,
    endDate: Date | string | number,
  ): number {
    const parsedStartDate = this.convertToUTC(startDate);
    const parsedEndDate = this.convertToUTC(endDate);

    const difference = dayjs(parsedEndDate).diff(parsedStartDate, 'days');

    return difference;
  }

  convertToUTC(date?: Date | string | number): string {
    const parsedDate = dayjs(date).utc().local().format();

    return parsedDate;
  }

  addHours(hoursNth: number, date?: string | number | Date): Date {
    const parsedDate = dayjs(date).add(hoursNth, 'hours').toDate();

    return parsedDate;
  }

  addDays(daysNth: number, date?: Date | string | number): Date {
    const parsedDate = dayjs(date).add(daysNth, 'days').toDate();

    return parsedDate;
  }
}

export { DayjsDateProvider };
