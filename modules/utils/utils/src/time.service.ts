export type TimeService = () => number;

export const nowTimeService: TimeService = () => Date.now();

export const fixedTimeService = (time: number): TimeService => () => time;