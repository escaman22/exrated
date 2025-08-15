import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-create-profile',
  imports: [
    CommonModule,
    AvatarModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    FormsModule,
    FileUploadModule,
    HttpClientModule,
  ],
  templateUrl: './create-profile.html',
  styleUrl: './create-profile.css',
})
export class CreateProfile {
  username = '';
  name = '';
  bio = '';

  avatarUrl: string | undefined;

  onAvatarSelect(event: any) {
    const file = event.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height); // square side length
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;

        // Create a square canvas for cropping
        const canvas = document.createElement('canvas');
        canvas.width = 200; // final avatar size
        canvas.height = 200;
        const ctx = canvas.getContext('2d');

        // Draw cropped square area
        ctx?.drawImage(
          img,
          offsetX,
          offsetY,
          size,
          size, // crop source
          0,
          0,
          200,
          200 // fit into final canvas
        );

        // Save base64 for preview
        this.avatarUrl = canvas.toDataURL('image/png');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  createProfile() {
    // Handle profile creation logic here
    console.log({
      avatarUrl: this.avatarUrl,
      username: this.username,
      name: this.name,
      bio: this.bio,
    });
  }
}
