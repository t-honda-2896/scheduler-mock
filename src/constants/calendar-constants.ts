export enum DisplayMode {
  DAY = "day",
  WEEK = "week",
}

export const DisplayModeOptions: string[] = [DisplayMode.DAY, DisplayMode.WEEK];

export const DisplayModeLabels = {
  [DisplayMode.DAY]: "１日表示",
  [DisplayMode.WEEK]: "週表示",
};
