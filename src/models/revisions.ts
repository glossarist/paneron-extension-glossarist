import * as crypto from 'crypto';

export const getNewRevisionID = () => crypto.randomBytes(3).toString('hex');

export interface Revision<T> {
  object: T

  /** parent revision IDs */
  parents: string[]

  timeCreated: Date

  changeRequestID?: string

  author?: {
    name: string
    email: string
  }
}

/** @deprecated RegistryKit covers this now. */
export type WithRevisions<T> = T & {
  _revisions: {
    /** Points to existing revision ID from the tree */
    current: string

    /** revision ID is 6 hexadecimal characters */
    /** When new version is saved,
        new revision is created with current object data and current revision ID as parent;
        new revision is assigned a randomly generated ID and added to the tree;
        current revision pointer is updated with that ID. */
    tree: { [revisionID: string]: Revision<T> }
  }
}
