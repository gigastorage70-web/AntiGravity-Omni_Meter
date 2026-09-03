import { getSupabaseClient, getSupabaseAdminClient, isSupabaseConfigured } from "../supabase/client";
import { Database, UserRecord, DeviceSessionRecord, UserQuotaRecord } from "./index";

export class SupabaseAdapter {
  private static instance: SupabaseAdapter;

  public static getInstance(): SupabaseAdapter {
    if (!SupabaseAdapter.instance) {
      SupabaseAdapter.instance = new SupabaseAdapter();
    }
    return SupabaseAdapter.instance;
  }

  public async getUsers(): Promise<UserRecord[]> {
    if (!isSupabaseConfigured()) {
      return Database.getInstance().getUsers();
    }

    try {
      const supabase = getSupabaseAdminClient() || getSupabaseClient();
      if (!supabase) return Database.getInstance().getUsers();

      const { data, error } = await supabase.from("users").select("*");
      if (error || !data) {
        console.warn("[SupabaseAdapter] Query fallback to local DB:", error?.message);
        return Database.getInstance().getUsers();
      }

      return data.map((u: any) => ({
        id: u.id,
        email: u.email,
        password_hash: "",
        name: u.name,
        tier: u.tier,
        role: u.role,
        storage_limit_gb: Number(u.storage_limit_gb),
        storage_used_gb: Number(u.storage_used_gb),
        storage_breakdown: {
          driveGb: Number(u.drive_gb || 0),
          mailGb: Number(u.mail_gb || 0),
          photosGb: Number(u.photos_gb || 0),
          vaultGb: Number(u.vault_gb || 0),
        },
        created_at: u.created_at,
        last_login_at: u.last_login_at,
      }));
    } catch (e) {
      return Database.getInstance().getUsers();
    }
  }

  public async syncUserToSupabase(user: UserRecord): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const supabase = getSupabaseAdminClient() || getSupabaseClient();
      if (!supabase) return false;

      const { error } = await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier,
        role: user.role,
        storage_limit_gb: user.storage_limit_gb,
        storage_used_gb: user.storage_used_gb,
        drive_gb: user.storage_breakdown.driveGb,
        mail_gb: user.storage_breakdown.mailGb,
        photos_gb: user.storage_breakdown.photosGb,
        vault_gb: user.storage_breakdown.vaultGb,
        created_at: user.created_at,
        last_login_at: user.last_login_at,
      });

      return !error;
    } catch {
      return false;
    }
  }
}

export const supabaseAdapter = SupabaseAdapter.getInstance();
