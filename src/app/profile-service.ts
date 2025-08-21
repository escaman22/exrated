import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  orderBy,
  query,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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
