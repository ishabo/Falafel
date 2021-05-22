import redis from 'redis'
import { PubSubService, CHANNELS, ChannelMessage } from './pubSubService'

export default class PubSub implements PubSubService {
  public publisher: redis.RedisClient
  public subscriber: redis.RedisClient

  constructor({ redisUrl }: { redisUrl: string }) {
    this.publisher = redis.createClient(redisUrl)
    this.subscriber = redis.createClient(redisUrl)

    this.subscribeToChannels()
  }

  public onMessageReceived(handleMessageReceived: ({ channel, message }: ChannelMessage) => void) {
    this.subscriber.on('message', (channel: CHANNELS, message: string) =>
      handleMessageReceived({ channel, message })
    )
  }

  public publish({ channel, message }: ChannelMessage): void {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel)
      })
    })
  }

  private subscribeToChannels(): void {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber.subscribe(channel)
    })
  }
}
