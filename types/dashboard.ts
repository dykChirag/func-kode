export type DashboardNextEvent = {
  title: string;
  date: string;
};

export type DashboardSummaryResponse = {
  newContributors: number;
  pendingReviews: number;
  nextEvent: DashboardNextEvent | null;
};

export type ContributionDay = {
  date: string;
  count: number;
};

export type DashboardContributorsResponse = {
  newContributors: number;
  projects: Array<{
    name: string;
    contributors: number;
  }>;
};

export type ConnectedProject = {
  projectId: string;
  title: string;
  githubUrl: string;
  fullName: string;
};
