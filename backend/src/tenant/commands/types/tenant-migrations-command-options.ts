import { TenantAllMigrationsCommandOptions } from "./tenant-all-migrations-command-options.interface";

export interface TenantMigrationsCommandOptions extends TenantAllMigrationsCommandOptions {
    tenant: string;
}