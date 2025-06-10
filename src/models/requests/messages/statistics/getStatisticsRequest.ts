import {formatWithTransfer} from '../../../../lib/stringDateTrasnfer';

export type GetStatisticsRequest = {
  masterAccountId?: string;
  startDate?: string | Date;
  endDate?: string | Date;
};

export class GetStatisticsFinalizeRequest {
  startDate?: string;
  endDate?: string;
  masterAccountId?: string;

  constructor(parameter: GetStatisticsRequest) {
    if (parameter.startDate) {
      this.startDate = formatWithTransfer(parameter.startDate);
    }
    if (parameter.endDate) {
      this.endDate = formatWithTransfer(parameter.endDate);
    }
    this.masterAccountId = parameter.masterAccountId;
  }
}
