import { TimestampedEntity } from '../../../src/entity/entity.module';
import { Timestamp } from 'foundation';
import { PostId } from './../values/post-id';

export class Post extends TimestampedEntity {

    private _content: string;
    
    constructor(id: PostId, content: string, created: Timestamp = Timestamp.Now(), updated: Timestamp = Timestamp.Now(), deleted: Timestamp|null = null) {
        super(id, created, updated, deleted);
        this._content = content;
    }

    public id(): PostId {
        return super.id() as PostId;
    }

    public equals(suspect: any): boolean {
        let isEqual = false;

        if (suspect instanceof Post) {
            const other = suspect as Post;
            isEqual = this.id().equals(other.id());
        }

        return isEqual;
    }

}