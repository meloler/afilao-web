declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    RESEND_API_KEY?: string;
    RESERVATIONS_EMAIL_FROM?: string;
    RESERVATIONS_EMAIL_TO?: string;
  }
}
