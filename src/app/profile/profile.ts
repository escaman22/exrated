import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ButtonModule, ImageModule, CardModule, AvatarModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  flagType: 'green' | 'red' = 'green';

  comments = [
    {
      text: 'Great experience!',
      timeAgo: '32m',
      likes: 5,
      authorName: 'Alice',
      authorProfileUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
      flag: 'red',
    },
    {
      text: 'Could be better.',
      timeAgo: '1h',
      likes: 2,
      authorName: 'Bob',
      authorProfileUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
      flag: 'green',
    },
    {
      text: 'Would not recommend.',
      timeAgo: '2h',
      likes: 0,
      authorName: 'Charlie',
      authorProfileUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
      flag: 'red',
    },
    {
      text: 'Great experience!',
      timeAgo: '32m',
      likes: 5,
      authorName: 'Dana',
      authorProfileUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
      flag: 'green',
    },
    {
      text: 'Could be better.',
      timeAgo: '1h',
      likes: 2,
      authorName: 'Eve',
      authorProfileUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
      flag: 'red',
    },
    {
      text: 'Would not recommend.',
      timeAgo: '2h',
      likes: 0,
      authorName: 'Frank',
      authorProfileUrl: 'https://randomuser.me/api/portraits/men/86.jpg',
      flag: 'green',
    },
  ];

  submitComment(commentText: string, flagType: 'green' | 'red') {
    if (!commentText.trim()) return;
    this.comments.unshift({
      text: commentText,
      timeAgo: 'now',
      likes: 0,
      authorName: 'You',
      authorProfileUrl: '',
      flag: flagType,
    });
  }
}
