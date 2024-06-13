import { TLink, TLinkDecrypted }  from 'types'
import { decrypt } from 'lib/crypto'
import { defineClaimAppURL, defineUrlSchema } from 'helpers'

type TDecryptLink = ({
  links,
  dashboardKey,
  tokenAddress,
  userAddress,
  chainId,
  wallet,
  availableWallets
} : {
  links: TLink[],
  dashboardKey: string,
  tokenAddress: string,
  userAddress: string,
  chainId: number,
  wallet: string,
  availableWallets: string[]
}
) => TLinkDecrypted[]

const decryptLinks: TDecryptLink = ({
  links,
  dashboardKey,
  tokenAddress,
  userAddress,
  chainId,
  wallet,
  availableWallets
}) => {
  const decryptedLinks = []
  const start = +new Date()
  const claimAppURL = defineClaimAppURL(userAddress)
  for (let i = 0; i < links.length; i++) {
    const encryptedLink = links[i].encrypted_claim_link
    if (encryptedLink && encryptedLink !== 'NO_DATA') {
      decryptedLinks.push({
        link_id: links[i].link_id,
        claim_link: decrypt(encryptedLink, dashboardKey)
      })
    } else {
      const encryptedClaimCode = links[i].encrypted_claim_code
      if (encryptedClaimCode) {
        const decryptedClaimCode = decrypt(encryptedClaimCode, dashboardKey)
        const claimUrl = defineUrlSchema(
          decryptedClaimCode,
          claimAppURL
        )
        decryptedLinks.push({
          link_id: links[i].link_id,
          token_id: links[i].token_id !== '0' ? links[i].token_id : '0',
          token_amount: links[i].token_amount !== '0' ? links[i].token_amount : undefined,
          token_address: tokenAddress,
          claim_code: decryptedClaimCode,
          claim_link: claimUrl
        })
      }
    }
  }
  console.log(+ new Date() - start)
  return decryptedLinks
}

export default decryptLinks
