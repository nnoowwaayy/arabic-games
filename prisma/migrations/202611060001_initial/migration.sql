-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'MA',
    "created_at" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" BIGINT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "runs" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "user_id" TEXT,
    "guest_id" TEXT NOT NULL,
    "deck" TEXT NOT NULL,
    "snapshot" TEXT,
    "turn" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "lives" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'playing',
    "daily" TEXT,
    "created_at" TEXT NOT NULL,
    "finished_at" TEXT,

    CONSTRAINT "runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_attempts" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "reset_at" BIGINT NOT NULL,

    CONSTRAINT "auth_attempts_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "datasets" (
    "game_id" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TEXT NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "datasets_pkey" PRIMARY KEY ("game_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "runs_leaderboard" ON "runs"("game_id", "status", "score");

-- CreateIndex
CREATE INDEX "runs_user" ON "runs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "runs_guest_daily" ON "runs"("guest_id", "daily");

-- CreateIndex
CREATE UNIQUE INDEX "runs_user_daily" ON "runs"("user_id", "daily");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "runs" ADD CONSTRAINT "runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "datasets" ADD CONSTRAINT "datasets_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

