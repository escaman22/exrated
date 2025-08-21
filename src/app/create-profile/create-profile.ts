import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { inject } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { finalize, Observable } from 'rxjs';
import { Profile } from '../models/profile-model';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';

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
    ReactiveFormsModule,
  ],
  templateUrl: './create-profile.html',
  styleUrl: './create-profile.css',
})
export class CreateProfile {
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);
  private storage: AngularFireStorage = inject(AngularFireStorage);

  username = '';
  name = '';
  bio = '';

  avatarUrl: string | undefined;

  profile$!: Observable<Profile | undefined>;

  firestore = inject(Firestore);
  profileCollection = collection(this.firestore, 'profiles');

  profileForm!: any;

  async ngOnInit() {
    // const profileId = 'abc123'; // replace with actual id
    // const profileDoc: DocumentReference<Profile> = doc<Profile>(
    //   this.firestore,
    //   `profiles/${profileId}`
    // );
    // const snapshot = await getDoc(profileDoc);
    // if (snapshot.exists()) {
    //   this.profile = { id: snapshot.id, ...snapshot.data() };
    // } else {
    //   console.log('Profile not found');
    // }

    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: [null, [Validators.min(18), Validators.max(120)]],
      bio: ['', [Validators.maxLength(250)]],
      avatarUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],
    });
  }

  async onAvatarSelect(event: any) {
    const file = event.files[0];
    if (!file) return;

    // Resize & compress thumbnail
    const thumbnailBlob = await this.resizeAndCompressImage(file, 200, 200, 0.7);

    // Upload to Firebase Storage
    const filePath = `avatars/${file.name}`;
    const task = this.storage.upload(filePath, thumbnailBlob);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.storage
            .ref(filePath)
            .getDownloadURL()
            .subscribe((url) => {
              this.avatarUrl = url; // show preview
            });
        })
      )
      .subscribe();

    // const reader = new FileReader();
    // reader.onload = (e: any) => {
    //   const img = new Image();
    //   img.onload = () => {
    //     const size = Math.min(img.width, img.height); // square side length
    //     const offsetX = (img.width - size) / 2;
    //     const offsetY = (img.height - size) / 2;

    //     // Create a square canvas for cropping
    //     const canvas = document.createElement('canvas');
    //     canvas.width = 200; // final avatar size
    //     canvas.height = 200;
    //     const ctx = canvas.getContext('2d');

    //     // Draw cropped square area
    //     ctx?.drawImage(
    //       img,
    //       offsetX,
    //       offsetY,
    //       size,
    //       size, // crop source
    //       0,
    //       0,
    //       200,
    //       200 // fit into final canvas
    //     );

    //     // Save base64 for preview
    //     this.avatarUrl = canvas.toDataURL('image/png');
    //   };
    //   img.src = e.target.result;
    // };
    // reader.readAsDataURL(file);
  }

  async createProfile() {
    console.log('Creating profile with data:', this.profileForm.value);
    console.log('Avatar URL:', this.avatarUrl);
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    // ensure age is a number
    const newProfile: Profile = {
      ...this.profileForm.value,
      age: Number(this.profileForm.value.age), // convert from string -> number
      avatarUrl: this.avatarUrl || '',
    };

    try {
      const docRef = await addDoc(this.profileCollection, newProfile);
      console.log('Profile created with ID:', docRef.id);
      this.profileForm.reset(); // reset form after success

      this.router.navigate(['/profile', docRef.id]);
    } catch (error) {
      console.error('Error adding profile:', error);
    }
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // Create a compressed thumbnail
    const thumbnailBlob = await this.resizeAndCompressImage(file, 100, 100, 0.7);

    // Upload thumbnail
    const filePath = `thumbnails/${file.name}`;
    const task = this.storage.upload(filePath, thumbnailBlob);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.storage
            .ref(filePath)
            .getDownloadURL()
            .subscribe((url) => {
              console.log('Thumbnail URL:', url);
            });
        })
      )
      .subscribe();
  }

  resizeAndCompressImage(
    file: File,
    maxWidth = 150,
    maxHeight = 150,
    quality = 0.7
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const img = new Image();

      reader.onload = (e) => (img.src = e.target?.result as string);

      img.onload = () => {
        let { width, height } = img;
        const aspect = width / height;

        // Adjust width and height to fit within max dimensions
        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspect;
        }
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspect;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob with compression (JPEG/WEBP)
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('Canvas is empty'))),
          'image/jpeg', // can also use 'image/webp'
          quality // compression quality (0 to 1)
        );
      };

      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
}
