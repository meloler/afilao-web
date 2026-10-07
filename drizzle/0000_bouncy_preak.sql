CREATE TABLE `claims` (
	`scope` text NOT NULL,
	`date` text NOT NULL,
	`table_id` integer NOT NULL,
	`minute` integer NOT NULL,
	`reservation_id` text NOT NULL,
	PRIMARY KEY(`scope`, `date`, `table_id`, `minute`),
	FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_claims_reservation` ON `claims` (`reservation_id`);--> statement-breakpoint
CREATE TABLE `reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`scope` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`service` text NOT NULL,
	`people` integer NOT NULL,
	`name` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'confirmada' NOT NULL,
	`tables` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`idempotency_key` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reservations_scope_date` ON `reservations` (`scope`,`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_reservations_scope_key` ON `reservations` (`scope`,`idempotency_key`);