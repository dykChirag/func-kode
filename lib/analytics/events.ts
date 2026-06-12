export const ANALYTICS_EVENTS = {
  PAGE_VIEWED: "page_viewed",

  LANDING_CTA_CLICKED: "landing_cta_clicked",
  LANDING_SECTION_VIEWED: "landing_section_viewed",
  GITHUB_FORK_CLICKED: "github_fork_clicked",
  DISCORD_LINK_CLICKED: "discord_link_clicked",
  ANNOUNCEMENT_POPUP_SHOWN: "announcement_popup_shown",
  ANNOUNCEMENT_CTA_CLICKED: "announcement_cta_clicked",
  ANNOUNCEMENT_DISMISSED: "announcement_dismissed",

  LOGIN_ATTEMPTED: "login_attempted",
  LOGIN_SUCCEEDED: "login_succeeded",
  LOGIN_FAILED: "login_failed",
  SIGNUP_ATTEMPTED: "signup_attempted",
  SIGNUP_FAILED: "signup_failed",
  LOGOUT: "logout",
  ONBOARDING_STARTED: "onboarding_started",
  ONBOARDING_COMPLETED: "onboarding_completed",
  ONBOARDING_FAILED: "onboarding_failed",
  ONBOARDING_ERROR: "onboarding_error",
  ONBOARDING_SKIPPED: "onboarding_skipped",

  PROJECT_SUBMIT_STARTED: "project_submit_started",
  PROJECT_SUBMITTED: "project_submitted",
  PROJECT_VIEWED: "project_viewed",

  EVENT_VIEWED: "event_viewed",
  RSVP_STARTED: "rsvp_started",
  RSVP_SUBMITTED: "rsvp_submitted",

  BLOG_POST_VIEWED: "blog_post_viewed",
  BLOG_LIKED: "blog_liked",
  BLOG_COMMENTED: "blog_commented",

  DASHBOARD_VIEWED: "dashboard_viewed",
  DASHBOARD_ACTION_CLICKED: "dashboard_action_clicked",
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
