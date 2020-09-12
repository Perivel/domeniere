import { Timestamp } from "foundation";
import { DomainEventIdInterface } from "./domain-event-id.interface";



export interface DomainEventInterface {

    /**
     * eventClassification()
     * 
     * eventClassification() gets the event classification.
     */
    
    eventClassification(): string;

    /**
     * eventId()
     *
     * eventId() gets the event id. The event id is the unique identifier for a specific
     * event instance that took place at a given moment in time.
     */

    eventId(): DomainEventIdInterface;

    /**
     * eventName()
     *
     * eventName() gets the name of the event.
     */

    eventName(): string;

    /**
     * isError()
     * 
     * isError() indicates if the event is an error event.
     */
    
    isError(): boolean;

    /**
     * isInternal()
     * 
     * isInternal() determines if the event is an internal framework event.
     */
    isInternal(): boolean;

    /**
     * occuredOn()
     * 
     * occuredOn() gets the timestamp the event occured on.
     */

    occuredOn(): Timestamp;

    /**
     * version()
     * 
     * version() gets the version number of the event.
     */

    eventVersion(): number;
}