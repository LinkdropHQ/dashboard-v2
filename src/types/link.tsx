type TLink = {
  link_id?: string,
  token_id?: string | null
  token_amount?: string | null
  sender_signature?: string
  encrypted_claim_code?: string,
  encrypted_claim_link?: string,
  expiration_time: string,
  wei_amount?: string
}

export default TLink
