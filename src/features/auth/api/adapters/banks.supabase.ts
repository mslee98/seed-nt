import { ApiError, API_ERROR_CODES } from '../../../../shared/api/errors'
import { getSupabaseClient } from '../../../../shared/lib/supabase'
import type { Institution } from '../../data/institutions'
import { mapBankRowToInstitution } from '../../mappers/bank.mapper'
import type { BankRow } from '../../types/banks'

const BANK_SELECT =
  'id, code, name, icon_key, svg_filename, daily_maintenance_start, daily_maintenance_end, regular_maintenance_rule, regular_maintenance_start, regular_maintenance_end, maintenance_note, sort_order, is_active'

export async function fetchActiveBanksFromSupabase(): Promise<Institution[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('banks')
    .select(BANK_SELECT)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    throw new ApiError(API_ERROR_CODES.BANKS_FETCH_FAILED, error.message)
  }

  return ((data ?? []) as BankRow[]).map(mapBankRowToInstitution)
}
