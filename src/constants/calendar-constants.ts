export enum DisplayMode {
  ONE_DAY = "one_day",
  TWO_DAYS = "two_days",
  THREE_DAYS = "three_days",
}

export const DisplayModeOptions: string[] = [
  DisplayMode.ONE_DAY,
  DisplayMode.TWO_DAYS,
  DisplayMode.THREE_DAYS,
];

export const DisplayModeLabels = {
  [DisplayMode.ONE_DAY]: "１日表示",
  [DisplayMode.TWO_DAYS]: "２日表示",
  [DisplayMode.THREE_DAYS]: "３日表示",
};

export const DisplayModeCorrect = {
  [DisplayMode.ONE_DAY]: 1,
  [DisplayMode.TWO_DAYS]: 2,
  [DisplayMode.THREE_DAYS]: 3,
};
