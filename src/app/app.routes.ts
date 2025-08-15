import { Routes } from '@angular/router';
import { Profile } from './profile/profile';
import { Home } from './home/home';
import { CreateProfile } from './create-profile/create-profile';

export const routes: Routes = [
  { path: 'profile', component: Profile },
  { path: '', component: Home },
  { path: 'create-profile', component: CreateProfile },
];
