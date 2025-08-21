import { Routes } from '@angular/router';
<<<<<<< Updated upstream
import { Profile } from './profile/profile';

export const routes: Routes = [{ path: '', component: Profile }];
=======
import { ProfileComponent } from './profile/profile';
import { Home } from './home/home';
import { CreateProfile } from './create-profile/create-profile';
import { PrivacyPolicyComponent } from './privacy-policy-component/privacy-policy-component';
import { TermsComponent } from './terms-component/terms-component';
import { SupportComponent } from './support-component/support-component';

export const routes: Routes = [
  { path: 'profile/:id', component: ProfileComponent },
  { path: '', component: Home },
  { path: 'create-profile', component: CreateProfile },
  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'support', component: SupportComponent },
];
>>>>>>> Stashed changes
