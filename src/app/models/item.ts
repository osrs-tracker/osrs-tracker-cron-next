import { Exclude, Type } from 'class-transformer';

export class ItemPage {
  letter!: string;
  page!: number;
}

export enum Trend {
  Negative = 'negative',
  Neutral = 'neutral',
  Positive = 'positive',
}

export class Price {
  price!: string;
  trend!: Trend;
}

export class ItemResponse {
  id!: number;
  name!: string;
  description!: string;

  @Exclude()
  icon!: string;
  @Exclude()
  icon_large!: string;

  @Type(() => Price)
  current!: Price;
  @Type(() => Price)
  today!: Price;

  members!: boolean;

  @Exclude()
  type!: string;
  @Exclude()
  typeIcon!: string;
}
