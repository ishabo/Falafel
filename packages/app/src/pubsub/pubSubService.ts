export enum CHANNELS  {
  TEST = 'TEST',
  BLOCKCHAIN = 'BLOCKCHAIN',
  TRANSACTION = 'TRANSACTION'
};

export interface ChannelMessage {
  channel: CHANNELS; message: string 
}

export class PubSubService {

  public publish(_: ChannelMessage): void {
    console.log(`To implement publsh function`)
  }

  public onMessageReceived(_: (_: ChannelMessage) => void) {} 
}
