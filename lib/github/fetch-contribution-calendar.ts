import { githubGraphql } from "@/lib/github/graphql-client";
import type { ContributionDay } from "@/types/dashboard";

type ContributionCalendarResult = {
  viewer: {
    contributionsCollection: {
      contributionCalendar: {
        weeks: Array<{
          contributionDays: Array<{
            date: string;
            contributionCount: number;
          }>;
        }>;
      };
    };
  };
};

const CONTRIBUTION_CALENDAR_QUERY = `
  query ContributionCalendar($from: DateTime!, $to: DateTime!) {
    viewer {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

function toIsoDate(date: Date): string {
  return date.toISOString();
}

/** GitHub contribution calendar for the last 12 months (viewer = authenticated user). */
export async function fetchContributionCalendar(
  token: string,
): Promise<ContributionDay[]> {
  const to = new Date();
  const from = new Date(to);
  from.setUTCFullYear(from.getUTCFullYear() - 1);
  from.setUTCDate(from.getUTCDate() + 1);

  const data = await githubGraphql<ContributionCalendarResult>(
    CONTRIBUTION_CALENDAR_QUERY,
    { from: toIsoDate(from), to: toIsoDate(to) },
    token,
  );

  const weeks =
    data.viewer.contributionsCollection.contributionCalendar.weeks;

  const days: ContributionDay[] = [];
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      days.push({
        date: day.date,
        count: day.contributionCount,
      });
    }
  }

  days.sort((a, b) => a.date.localeCompare(b.date));
  return days;
}
