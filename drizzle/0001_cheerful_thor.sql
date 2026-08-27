CREATE TABLE `businesses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerUserId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`monthlyGoalCents` int NOT NULL DEFAULT 0,
	`reserveGoalCents` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `businesses_id` PRIMARY KEY(`id`),
	CONSTRAINT `businesses_owner_user_unique` UNIQUE(`ownerUserId`)
);
--> statement-breakpoint
CREATE TABLE `financial_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`userId` int NOT NULL,
	`type` enum('cost','expense','withdrawal','capital','reserve') NOT NULL,
	`amountCents` int NOT NULL,
	`description` varchar(280) NOT NULL,
	`occurredAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `financial_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lesson_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`userId` int NOT NULL,
	`lessonKey` varchar(80) NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lesson_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `lesson_progress_unique` UNIQUE(`businessId`,`userId`,`lessonKey`)
);
--> statement-breakpoint
CREATE TABLE `product_exit_modes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`productId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`priceCents` int NOT NULL,
	`stockUnits` int NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_exit_modes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`category` varchar(80) NOT NULL DEFAULT 'Galões de água',
	`defaultPriceCents` int NOT NULL,
	`unitCostCents` int NOT NULL,
	`stockUnits` int NOT NULL DEFAULT 0,
	`minimumStockUnits` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sale_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`saleId` int NOT NULL,
	`productId` int NOT NULL,
	`productNameSnapshot` varchar(120) NOT NULL,
	`quantity` int NOT NULL,
	`priceCents` int NOT NULL,
	`unitCostCents` int NOT NULL,
	`subtotalCents` int NOT NULL,
	`exitModeId` int NOT NULL,
	`exitModeNameSnapshot` varchar(120) NOT NULL,
	`stockUnits` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sale_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`userId` int NOT NULL,
	`totalCents` int NOT NULL,
	`paymentMethod` enum('cash','pix','card','credit') NOT NULL,
	`note` varchar(280),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sales_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `financial_entries_business_date_idx` ON `financial_entries` (`businessId`,`occurredAt`);--> statement-breakpoint
CREATE INDEX `exit_modes_product_idx` ON `product_exit_modes` (`productId`);--> statement-breakpoint
CREATE INDEX `exit_modes_business_idx` ON `product_exit_modes` (`businessId`);--> statement-breakpoint
CREATE INDEX `products_business_idx` ON `products` (`businessId`);--> statement-breakpoint
CREATE INDEX `sale_items_sale_idx` ON `sale_items` (`saleId`);--> statement-breakpoint
CREATE INDEX `sale_items_product_idx` ON `sale_items` (`productId`);--> statement-breakpoint
CREATE INDEX `sales_business_created_idx` ON `sales` (`businessId`,`createdAt`);