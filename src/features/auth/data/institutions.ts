export type FinanceCategory = 'bank' | 'securities' | 'insurance'

export interface Institution {
  id: string
  code: string
  name: string
  category: FinanceCategory
  iconKey: string
  /** Supabase Storage 등 원격 아이콘. 있으면 로컬 iconKey 맵보다 우선 */
  iconUrl?: string
  disabled?: boolean
  /** 그리드에 노출할 주요 기관 여부 */
  featured?: boolean
  maintenanceNote?: string
}

export const FINANCE_CATEGORY_LABELS: Record<FinanceCategory, string> = {
  bank: '은행',
  securities: '증권',
  insurance: '보험',
}

export const INSTITUTIONS: Institution[] = [
  // 은행
  { id: 'bank-shinhan', code: '088', name: '신한은행', category: 'bank', iconKey: 'shinhan-bank', featured: true },
  { id: 'bank-kb', code: '004', name: 'KB국민은행', category: 'bank', iconKey: 'kb-bank', featured: true },
  { id: 'bank-woori', code: '020', name: '우리은행', category: 'bank', iconKey: 'woori-bank', featured: true },
  { id: 'bank-hana', code: '081', name: '하나은행', category: 'bank', iconKey: 'hana-bank', featured: true },
  { id: 'bank-nh', code: '011', name: 'NH농협은행', category: 'bank', iconKey: 'nh-bank', featured: true },
  { id: 'bank-kakao', code: '090', name: '카카오뱅크', category: 'bank', iconKey: 'kakao-bank', featured: true },
  { id: 'bank-toss', code: '092', name: '토스뱅크', category: 'bank', iconKey: 'toss-bank', featured: true },
  { id: 'bank-kbank', code: '089', name: '케이뱅크', category: 'bank', iconKey: 'kbank-bank', featured: true },
  { id: 'bank-ibk', code: '003', name: 'IBK기업은행', category: 'bank', iconKey: 'ibk-bank', featured: true },
  { id: 'bank-dgb', code: '031', name: 'DGB대구은행', category: 'bank', iconKey: 'dgb-bank', featured: true },
  { id: 'bank-busan', code: '032', name: '부산은행', category: 'bank', iconKey: 'bnk-busan-bank', featured: true },
  { id: 'bank-gyeongnam', code: '039', name: '경남은행', category: 'bank', iconKey: 'bnk-gyeongnam-bank', featured: true },
  { id: 'bank-kwangju', code: '034', name: '광주은행', category: 'bank', iconKey: 'kwangju-bank', featured: true },
  { id: 'bank-jeju', code: '035', name: '제주은행', category: 'bank', iconKey: 'jeju-bank', featured: true },
  { id: 'bank-kdb', code: '002', name: 'KDB산업은행', category: 'bank', iconKey: 'kdb-bank', featured: true },
  { id: 'bank-sc', code: '023', name: 'SC제일은행', category: 'bank', iconKey: 'sc-bank', featured: true },
  { id: 'bank-citi', code: '027', name: '한국씨티은행', category: 'bank', iconKey: 'citi-bank', featured: true },
  { id: 'bank-mg', code: '045', name: '새마을금고', category: 'bank', iconKey: 'mg-bank' },
  { id: 'bank-cu', code: '048', name: '신협', category: 'bank', iconKey: 'cu-bank' },
  { id: 'bank-suhyup', code: '007', name: '수협은행', category: 'bank', iconKey: 'suhyup-bank' },
  { id: 'bank-post', code: '071', name: '우체국', category: 'bank', iconKey: 'postoffice-bank' },
  { id: 'bank-sb', code: '050', name: '저축은행', category: 'bank', iconKey: 'sb-bank' },
  { id: 'bank-junbuk', code: '037', name: '전북은행', category: 'bank', iconKey: 'junbuk-bank' },
  { id: 'bank-sbi', code: '103', name: 'SBI저축은행', category: 'bank', iconKey: 'sbi-bank' },
  { id: 'bank-deutsche', code: '055', name: '도이치은행', category: 'bank', iconKey: 'deutsche-bank' },
  { id: 'bank-boa', code: '060', name: 'BOA은행', category: 'bank', iconKey: 'boa-bank' },
  { id: 'bank-hsbc', code: '054', name: 'HSBC은행', category: 'bank', iconKey: 'hsbc-bank' },
  { id: 'bank-bankofchina', code: '056', name: '중국은행', category: 'bank', iconKey: 'bankofchina-bank' },
  { id: 'bank-jpmorgan', code: '057', name: 'JP모건체이스은행', category: 'bank', iconKey: 'jpmorgan-bank' },
  { id: 'bank-nfcf', code: '064', name: '산림조합중앙회', category: 'bank', iconKey: 'nfcf-bank' },
  { id: 'bank-chinaconstruction', code: '067', name: '중국건설은행', category: 'bank', iconKey: 'chinaconstruction-bank' },
  { id: 'bank-bnp', code: '061', name: 'BNP파리바은행', category: 'bank', iconKey: 'bnp-bank' },

  // 증권
  {
    id: 'sec-koreainvestment',
    code: '243',
    name: '한국투자증권',
    category: 'securities',
    iconKey: 'koreainvestment-sec',
    featured: true,
  },
  {
    id: 'sec-miraeasset',
    code: '238',
    name: '미래에셋증권',
    category: 'securities',
    iconKey: 'miraeasset-sec',
    featured: true,
  },
  {
    id: 'sec-samsung',
    code: '240',
    name: '삼성증권',
    category: 'securities',
    iconKey: 'samsung-sec',
    featured: true,
  },
  { id: 'sec-kb', code: '218', name: 'KB증권', category: 'securities', iconKey: 'kb-sec', featured: true },
  { id: 'sec-nh', code: '247', name: 'NH투자증권', category: 'securities', iconKey: 'nhqv-sec', featured: true },
  { id: 'sec-daishin', code: '267', name: '대신증권', category: 'securities', iconKey: 'daishin-sec', featured: true },
  { id: 'sec-meritz', code: '287', name: '메리츠증권', category: 'securities', iconKey: 'meritz-sec', featured: true },
  { id: 'sec-sk', code: '266', name: 'SK증권', category: 'securities', iconKey: 'sk-sec', featured: true },
  { id: 'sec-kium', code: '264', name: '키움증권', category: 'securities', iconKey: 'kium-sec', featured: true },
  { id: 'sec-shinyoung', code: '291', name: '신영증권', category: 'securities', iconKey: 'shinyoung-sec', featured: true },
  { id: 'sec-eugene', code: '280', name: '유진투자증권', category: 'securities', iconKey: 'eugene-sec', featured: true },
  { id: 'sec-hanhwa', code: '269', name: '한화투자증권', category: 'securities', iconKey: 'hanhwa-sec', featured: true },
  { id: 'sec-ls', code: '268', name: 'LS증권', category: 'securities', iconKey: 'ls-sec' },
  { id: 'sec-db', code: '279', name: 'DB금융투자', category: 'securities', iconKey: 'db-sec' },
  { id: 'sec-shinhan', code: '278', name: '신한투자증권', category: 'securities', iconKey: 'shinhan-sec' },
  { id: 'sec-hana', code: '270', name: '하나증권', category: 'securities', iconKey: 'hana-sec' },
  { id: 'sec-toss', code: '271', name: '토스증권', category: 'securities', iconKey: 'toss-sec' },
  { id: 'sec-woori', code: '294', name: '우리투자증권', category: 'securities', iconKey: 'woori-sec' },
  { id: 'sec-hyundai', code: '263', name: '현대차증권', category: 'securities', iconKey: 'hyundai-sec' },
  { id: 'sec-yuanta', code: '209', name: '유안타증권', category: 'securities', iconKey: 'yuanta-sec' },
  { id: 'sec-kyobo', code: '261', name: '교보증권', category: 'securities', iconKey: 'kyobo-sec' },
  { id: 'sec-bnk', code: '290', name: 'BNK투자증권', category: 'securities', iconKey: 'bnk-sec' },
  { id: 'sec-ibk', code: '225', name: 'IBK투자증권', category: 'securities', iconKey: 'ibk-sec' },
  { id: 'sec-kakaopay', code: '288', name: '카카오페이증권', category: 'securities', iconKey: 'kakaopay-sec' },
  { id: 'sec-daol', code: '227', name: '다올투자증권', category: 'securities', iconKey: 'daol-sec' },
  { id: 'sec-bookook', code: '290', name: '부국증권', category: 'securities', iconKey: 'bookook-sec' },
  { id: 'sec-sangsangin', code: '221', name: '상상인증권', category: 'securities', iconKey: 'sangsangin-sec' },
  { id: 'sec-hanyang', code: '222', name: '한양증권', category: 'securities', iconKey: 'hanyang-sec' },
  { id: 'sec-dgb', code: '279', name: 'DGB금융투자', category: 'securities', iconKey: 'dgb-sec' },
  { id: 'sec-namuh', code: '247', name: '나무증권', category: 'securities', iconKey: 'namuh-sec' },
  { id: 'sec-cape', code: '292', name: '케이프투자증권', category: 'securities', iconKey: 'cape-sec' },
  { id: 'sec-fosskorea', code: '293', name: '한국포스증권', category: 'securities', iconKey: 'fosskorea-sec' },

  // 보험 (손해)
  { id: 'ins-samsung-fire', code: 'S01', name: '삼성화재', category: 'insurance', iconKey: 'samsung-fire', featured: true },
  { id: 'ins-db-fire', code: 'I01', name: 'DB손해보험', category: 'insurance', iconKey: 'db-fire', featured: true },
  { id: 'ins-hanhwa-fire', code: 'I02', name: '한화손해보험', category: 'insurance', iconKey: 'hanhwa-fire', featured: true },
  { id: 'ins-meritz-fire', code: 'I03', name: '메리츠화재', category: 'insurance', iconKey: 'meritz-fire', featured: true },
  { id: 'ins-kb-fire', code: 'I05', name: 'KB손해보험', category: 'insurance', iconKey: 'kb-fire', featured: true },
  { id: 'ins-hyundai-fire', code: 'I06', name: '현대해상', category: 'insurance', iconKey: 'hyundai-fire', featured: true },
  { id: 'ins-lotte-fire', code: 'I07', name: '롯데손해보험', category: 'insurance', iconKey: 'lotte-fire', featured: true },
  { id: 'ins-nh-fire', code: 'I08', name: 'NH농협손해보험', category: 'insurance', iconKey: 'nh-fire', featured: true },
  { id: 'ins-heungkuk-fire', code: 'I09', name: '흥국화재', category: 'insurance', iconKey: 'heungkuk-fire' },
  { id: 'ins-axa-fire', code: 'I10', name: 'AXA손해보험', category: 'insurance', iconKey: 'axa-fire' },
  { id: 'ins-ace-american-fire', code: 'I11', name: '에이스아메리칸손해보험', category: 'insurance', iconKey: 'ace-american-fire' },
  // 보험 (생명)
  { id: 'ins-kyobo-life', code: 'I04', name: '교보생명', category: 'insurance', iconKey: 'kyobo-life', featured: true },
  { id: 'ins-samsung-life', code: 'I12', name: '삼성생명', category: 'insurance', iconKey: 'samsung-life' },
  { id: 'ins-shinhan-life', code: 'I13', name: '신한생명', category: 'insurance', iconKey: 'shinhan-life' },
  { id: 'ins-hanhwa-life', code: 'I14', name: '한화생명', category: 'insurance', iconKey: 'hanhwa-life' },
  { id: 'ins-kb-life', code: 'I15', name: 'KB생명', category: 'insurance', iconKey: 'kb-life' },
  { id: 'ins-nh-life', code: 'I16', name: 'NH농협생명', category: 'insurance', iconKey: 'nh-life' },
  { id: 'ins-db-life', code: 'I17', name: 'DB생명', category: 'insurance', iconKey: 'db-life' },
  { id: 'ins-hyundai-life', code: 'I18', name: '푸본현대생명', category: 'insurance', iconKey: 'hyundai-life' },
  { id: 'ins-heungkuk-life', code: 'I19', name: '흥국생명', category: 'insurance', iconKey: 'heungkuk-life' },
  { id: 'ins-miraeasset-life', code: 'I20', name: '미래에셋생명', category: 'insurance', iconKey: 'miraeasset-life' },
  { id: 'ins-prudential-life', code: 'I21', name: '푸르덴셜생명', category: 'insurance', iconKey: 'prudential-life' },
  { id: 'ins-aia-life', code: 'I22', name: 'AIA생명', category: 'insurance', iconKey: 'aia-life' },
  { id: 'ins-lina-life', code: 'I23', name: '라이나생명', category: 'insurance', iconKey: 'lina-life' },
  { id: 'ins-dongyang-life', code: 'I24', name: '동양생명', category: 'insurance', iconKey: 'dongyang-life' },
  { id: 'ins-abl-life', code: 'I25', name: 'ABL생명', category: 'insurance', iconKey: 'abl-life' },
  { id: 'ins-chubb-life', code: 'I26', name: '처브라이프생명', category: 'insurance', iconKey: 'chubb-life' },
  { id: 'ins-orange-life', code: 'I27', name: '오렌지라이프생명', category: 'insurance', iconKey: 'orange-life' },
  { id: 'ins-kyobo-lifeplanet-life', code: 'I28', name: '교보라이프플래닛', category: 'insurance', iconKey: 'kyobo-lifeplanet-life' },
  { id: 'ins-kdb-life', code: 'I29', name: 'KDB생명', category: 'insurance', iconKey: 'kdb-life' },
  { id: 'ins-dgb-life', code: 'I30', name: 'DGB생명', category: 'insurance', iconKey: 'dgb-life' },
  { id: 'ins-ibk-pension', code: 'I31', name: 'IBK연금보험', category: 'insurance', iconKey: 'ibk-pension' },
]

export function getFeaturedInstitutions(category: FinanceCategory): Institution[] {
  return INSTITUTIONS.filter((item) => item.category === category && item.featured && !item.disabled)
}

export function searchInstitutions(query: string, category?: FinanceCategory): Institution[] {
  const normalized = query.trim().toLowerCase()
  return INSTITUTIONS.filter((item) => {
    if (item.disabled) return false
    if (category && item.category !== category) return false
    if (!normalized) return true
    return item.name.toLowerCase().includes(normalized)
  })
}
