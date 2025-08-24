import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  documentId,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { Profile } from './models/profile-model';
import { profileConverter } from './profile/profile.converter';
import { ProfileComment } from './models/profile-comment-model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private firestore: Firestore) {}

  getProfile(id: string): Observable<Profile | undefined> {
    const profileRef = doc(this.firestore, `profiles/${id}`).withConverter(profileConverter);
    return docData(profileRef, { idField: 'id' }) as Observable<Profile | undefined>;
  }

  getComments(profileId: string): Observable<ProfileComment[]> {
    const commentsRef = collection(this.firestore, `profiles/${profileId}/comments`);
    const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));
    return collectionData(commentsQuery, { idField: 'id' }) as Observable<ProfileComment[]>;
  }

  getProfiles(profileIds: string[]): Observable<Profile[]> {
    if (!profileIds || profileIds.length === 0) {
      return from([[]]); // return empty array observable
    }

    const profilesRef = collection(this.firestore, 'profiles').withConverter(profileConverter);

    // Firestore where(documentId(), "in", [...]) supports max 10 IDs per query
    const chunks = this.chunkArray(profileIds, 10);

    const queries = chunks.map((chunk) =>
      getDocs(query(profilesRef, where(documentId(), 'in', chunk)))
    );

    return from(Promise.all(queries)).pipe(
      map((snapshots) =>
        snapshots.flatMap((snapshot) =>
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Profile))
        )
      )
    );
  }

  private chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  async addComment(
    profileId: string,
    text: string,
    flagType: string,
    user: { uid: string; displayName?: string }
  ) {
    const commentsRef = collection(this.firestore, `profiles/${profileId}/comments`);
    return await addDoc(commentsRef, {
      // authorId: user.uid,
      authorName: user.displayName || 'Anonymous',
      text: text,
      createdAt: serverTimestamp(),
      flagType: flagType,
    });
  }
}
