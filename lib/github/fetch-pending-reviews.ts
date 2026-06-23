import { githubGraphql } from "@/lib/github/graphql-client";

type PendingReviewsResult = {
  search: {
    issueCount: number;
  };
};

const PENDING_REVIEWS_QUERY = `
  query PendingReviews {
    search(query: "is:pr is:open review-requested:@me", type: ISSUE, first: 1) {
      issueCount
    }
  }
`;

/** Count of open PRs where the authenticated user is requested as a reviewer. */
export async function fetchPendingReviewCount(token: string): Promise<number> {
  const data = await githubGraphql<PendingReviewsResult>(
    PENDING_REVIEWS_QUERY,
    {},
    token,
  );
  return data.search.issueCount;
}
