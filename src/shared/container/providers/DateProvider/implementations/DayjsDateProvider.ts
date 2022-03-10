import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IDateProvider } from '../IDateProvider';

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  currentDate(): Date {
    const currentDate = dayjs().toDate();

    return currentDate;
  }

  compareInHours(startDate: Date, endDate: Date): number {
    const parsedStartDate = this.convertToUTC(startDate);
    const parsedEndDate = this.convertToUTC(endDate);

    const difference = dayjs(parsedEndDate).diff(parsedStartDate, 'hours');

    return difference;
  }

  convertToUTC(date?: Date): string {
    const parsedDate = dayjs(date).utc().local().format();

    return parsedDate;
  }
}

export { DayjsDateProvider };
