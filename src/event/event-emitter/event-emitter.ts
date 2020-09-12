import { EventEmitterInterface } from "./event-emitter.interface";
import { SubscriberInterface } from "../subscriber/subscriber.interface";
import { Subscriber } from "../subscriber/subscriber";
import { DomainEvent } from "../domain-event/domain-event";
import { PriorityQueue } from "foundation";
import { EventAggregate } from "./event-aggregate..type";


export class EventEmitter implements EventEmitterInterface{

    private subscribers: Array<Subscriber>;
    private maxRetries: number;

    constructor(maxRetries: number = 3) {
        this.subscribers = new Array<Subscriber>();
        this.maxRetries = maxRetries;
    }

    /**
     * add()
     * 
     * add() attempts to add a subscription to the publisher list.
     * 
     * NOTE: Duplicate subscriptions will not be added.
     * @param subscriber The subscription to be added.
     */

    public addSubscriber(subscriber: Subscriber): void {
        if (subscriber && (!this.subscriberExists(subscriber))) {
            this.subscribers.push(subscriber);
        }
    }

    /**
     * emit()
     * 
     * emit() emits an event.
     * @param event The event to emit.
     */

    public async emit(event: DomainEvent): Promise<void> {

        const queue = new PriorityQueue<Subscriber>();

        // get the relevant subscribers.
        const eventName = event.eventName();
        this.subscribers.forEach(sub => {
            if (
                // The subscriber is registered to the specific event.
                (sub.eventName() === eventName) ||

                // The subscriber is listening to all events.
                (sub.eventName() === EventAggregate.Any.toString()) ||
                
                // The subscriber is listening to framework events.
                ((event.isInternal()) && (sub.eventName() === EventAggregate.Internal.toString())) || 

                // The subscriber is listening to an error event.
                ((event.isError()) && (sub.eventName() === EventAggregate.Error.toString()))
            ) {
                // add the subscriber to the queue.
                queue.enqueue(sub, sub.priority());
            }
        });

        // handle the events.
        await Promise.all(queue.toArray().map(async sub => {
            try {
                // execute the subscriber handler.
                await sub.handleEvent(event);
            }
            catch(error) {
                // An error occured.
                // publish the error event.
            }
        }));
    }

    /**
     * removeSubscriber()
     * 
     * remove() removes a subscription.
     * @param suspect The subscription to be removed.
     */

    public removeSubscriber(suspect: Subscriber): void {
        this.subscribers = this.subscribers.filter(subscriber => !subscriber.equals(suspect));
    }


    // HELPERS

    /**
     * subscriberExists()
     * 
     * subscriberExists() determines whether or not a subscription exists already.
     * @param suspect The suscpect to be found.
     */

    private subscriberExists(suspect: Subscriber): boolean {
        const foundSubscribers = this.subscribers.filter(subscription => suspect.equals(subscription));
        return foundSubscribers.length !== 0;
    }
 }