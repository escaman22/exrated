import {
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';
import { Profile } from '../models/profile-model';

export const profileConverter: FirestoreDataConverter<Profile> = {
  toFirestore(profile: Profile): DocumentData {
    return {
      name: profile.name,
      age: profile.age,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Profile {
    const data = snapshot.data(options)!;
    return {
      id: snapshot.id,
      name: data['name'],
      age: data['age'],
      bio: data['bio'],
      avatarUrl: data['avatarUrl'] || '', // Ensure avatarUrl is always a string
    } as Profile;
  },
};
