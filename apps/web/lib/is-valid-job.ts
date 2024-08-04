import { JobsModule } from "@/container/modules/jobs";

export const isValidJob = (job: string): job is keyof JobsModule => {
  return Object.getOwnPropertyNames(JobsModule.prototype).includes(job);
};
