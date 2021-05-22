import crypto from 'crypto'
import { ec as EC } from 'elliptic'
import { v1 as uuidV1 } from 'uuid'

const ec = new EC('secp256k1')

export type Signature = EC.Signature

class Util {
  static genKeyPair(): EC.KeyPair {
    return ec.genKeyPair()
  }

  static id() {
    return uuidV1()
  }

  static genHash(...inputs: Array<unknown>): string {
    const hash = crypto.createHash('sha256')

    hash.update(
      inputs
        .map((input) => JSON.stringify(input))
        .sort()
        .join(' ')
    )

    return hash.digest('hex')
  }

  static verifySignature({
    publicKey,
    signature,
    data,
  }: {
    publicKey: string
    signature: Signature
    data: any
  }): boolean {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex')
    return keyFromPublic.verify(Util.genHash(data), signature)
  }
}

export default Util
