import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Profile } from '../models/profile-model';
import { ProfileService } from '../profile-service';
import { Observable } from 'rxjs';
import { ProfileComment } from '../models/profile-comment-model';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ButtonModule,
    ImageModule,
    CardModule,
    AvatarModule,
    DialogModule,
    FormsModule,
  ],
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

  isEditingName = false;
  commenterName = ''; // stores the name

  comments: ProfileComment[] = [];
  greenCount = 0;
  redCount = 0;
  shareCount = 0;
  totalComments = 0;
  viewCount = 0;

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.profileId = params.get('id');
      if (this.profileId) {
        this.profile$ = this.profileService.getProfile(this.profileId);

        this.profileService.getComments(this.profileId).subscribe((comments) => {
          this.comments = comments;

          this.updateCounts();
        });
      }
    });
  }

  private updateCounts() {
    if (this.comments) {
      this.greenCount = this.comments.filter((c) => c.flagType === 'green').length;
      this.redCount = this.comments.filter((c) => c.flagType === 'red').length;
      this.totalComments = this.greenCount + this.redCount;
      const max = (this.greenCount + this.redCount) * 2;
      const min = this.greenCount + this.redCount;
      this.shareCount = Math.floor(Math.random() * (max - min + 1)) + min;
      this.viewCount = (Math.floor(Math.random() * (max - min + 1)) + min + 3) * 3;
    } else {
      this.greenCount = 0;
      this.redCount = 0;
    }
  }

  toggleNameEdit() {
    this.isEditingName = !this.isEditingName;
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
      displayName: this.commenterName || 'Anonymous',
    });
  }
}
