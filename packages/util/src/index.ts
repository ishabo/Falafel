import { SHA256 } from 'crypto-js'
import { ec as EC } from 'elliptic'
import { v1 as uuidV1 } from 'uuid'

const ec = new EC('secp256k1')

class Util {
  static genKeyPair(): EC.KeyPair {
    return ec.genKeyPair()
  }

  static id() {
    return uuidV1()
  }

  static genHash(data: string | object): string {
    return SHA256(JSON.stringify(data)).toString()
  }

  static verifySignature(publicKey: string, signature: EC.Signature, dataHash: string): boolean {
    return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature)
  }
}


export default Util
