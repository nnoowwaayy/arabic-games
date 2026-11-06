declare namespace Cloudflare {
  interface Env {
    DATABASE_URL?: string;
    ADMIN_EMAIL?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
