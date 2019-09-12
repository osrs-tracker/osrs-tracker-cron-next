import { Type } from 'class-transformer';

export class ToxMqResponse<T> {
  _id!: string;
  payload!: T;
  attempts!: number;
  @Type(() => Date)
  expiryDate!: Date;
}
