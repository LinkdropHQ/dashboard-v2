type TLinkDecrypted = {
  link_id: string
  claim_link: string
  claim_code: string | null
  token_address?: string | null
  token_amount?: string | null
  token_id?: string | null
}

export default TLinkDecrypted
