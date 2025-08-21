import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DocumentReference, Firestore, doc, getDoc, getFirestore } from 'firebase/firestore';
import { Profile } from '../models/profile-model';
import { ProfileService } from '../profile-service';
import { Observable } from 'rxjs';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment.prod';
import { ProfileComment } from '../models/profile-comment-model';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ButtonModule, ImageModule, CardModule, AvatarModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  providers: [],
})
export class ProfileComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private profileService: ProfileService = inject(ProfileService);

  flagType: 'green' | 'red' = 'green';
  profileId!: string | null;
  profile$!: Observable<Profile | undefined>;

  comments: ProfileComment[] = [];

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.profileId = params.get('id');
      if (this.profileId) {
        this.profile$ = this.profileService.getProfile(this.profileId);

        this.profileService.getComments(this.profileId).subscribe((comments) => {
          this.comments = comments;
        });
      }
    });
  }

  // comments = [
  //   {
  //     text: 'Great experience!',
  //     timeAgo: '32m',
  //     likes: 5,
  //     authorName: 'Alice',
  //     authorProfileUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
  //     flag: 'red',
  //   },
  //   {
  //     text: 'Could be better.',
  //     timeAgo: '1h',
  //     likes: 2,
  //     authorName: 'Bob',
  //     authorProfileUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
  //     flag: 'green',
  //   },
  //   {
  //     text: 'Would not recommend.',
  //     timeAgo: '2h',
  //     likes: 0,
  //     authorName: 'Charlie',
  //     authorProfileUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
  //     flag: 'red',
  //   },
  //   {
  //     text: 'Great experience!',
  //     timeAgo: '32m',
  //     likes: 5,
  //     authorName: 'Dana',
  //     authorProfileUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
  //     flag: 'green',
  //   },
  //   {
  //     text: 'Could be better.',
  //     timeAgo: '1h',
  //     likes: 2,
  //     authorName: 'Eve',
  //     authorProfileUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
  //     flag: 'red',
  //   },
  //   {
  //     text: 'Would not recommend.',
  //     timeAgo: '2h',
  //     likes: 0,
  //     authorName: 'Frank',
  //     authorProfileUrl: 'https://randomuser.me/api/portraits/men/86.jpg',
  //     flag: 'green',
  //   },
  // ];

  async submitComment(commentText: string, flagType: 'green' | 'red') {
    if (!commentText.trim()) return;

    this.profileService.addComment(this.profileId!, commentText, flagType, {
      uid: 'string',
      displayName: 'string',
    });
  }
}
