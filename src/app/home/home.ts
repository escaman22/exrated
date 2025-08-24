import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

import { LocationService } from '../location-service';
import { Profile } from '../models/profile-model';
import { ProfileService } from '../profile-service';
import { Observable } from 'rxjs';

interface City {
  name: string;
}
interface UserProfile {
  id: number;
  name: string;
  avatarUrl?: string;
  previewComment: string;
  flag: 'red' | 'green';
  timeAgo: string;
  likes: number;
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ImageModule,
    CardModule,
    AvatarModule,
    TagModule,
    RippleModule,
    RouterLink,
    SelectModule,
    FormsModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private profileService: ProfileService = inject(ProfileService);

  currentCity: string | null = null;
  cities: City[] | undefined;

  selectedCity: City | undefined;
  profiles$: Observable<Profile[] | undefined> | undefined;

  constructor(private locationService: LocationService) {}

  async ngOnInit() {
    this.loadProfiles();

    this.cities = [
      { name: 'New York, New York' },
      { name: 'Los Angeles, California' },
      { name: 'Chicago, Illinois' },
      { name: 'Houston, Texas' },
      { name: 'Philadelphia, Pennsylvania' },
      { name: 'Phoenix, Arizona' },
      { name: 'San Antonio, Texas' },
      { name: 'San Diego, California' },
      { name: 'Dallas, Texas' },
      { name: 'San Jose, California' },
      { name: 'Austin, Texas' },
      { name: 'Indianapolis, Indiana' },
      { name: 'Jacksonville, Florida' },
      { name: 'San Francisco, California' },
      { name: 'Columbus, Ohio' },
      { name: 'Charlotte, North Carolina' },
      { name: 'Fort Worth, Texas' },
      { name: 'Detroit, Michigan' },
      { name: 'El Paso, Texas' },
      { name: 'Memphis, Tennessee' },
      { name: 'Seattle, Washington' },
      { name: 'Denver, Colorado' },
      { name: 'Washington, District of Columbia' },
      { name: 'Boston, Massachusetts' },
      { name: 'Nashville-Davidson, Tennessee' },
      { name: 'Baltimore, Maryland' },
      { name: 'Oklahoma City, Oklahoma' },
      { name: 'Louisville/Jefferson County, Kentucky' },
      { name: 'Portland, Oregon' },
      { name: 'Las Vegas, Nevada' },
      { name: 'Milwaukee, Wisconsin' },
      { name: 'Albuquerque, New Mexico' },
      { name: 'Tucson, Arizona' },
      { name: 'Fresno, California' },
      { name: 'Sacramento, California' },
      { name: 'Long Beach, California' },
      { name: 'Kansas City, Missouri' },
      { name: 'Mesa, Arizona' },
      { name: 'Virginia Beach, Virginia' },
      { name: 'Atlanta, Georgia' },
    ];

    try {
      const { latitude, longitude } = await this.locationService.getCurrentLocation();
      const cityAndState = await this.locationService.getCityFromCoordinates(latitude, longitude);
      this.currentCity = cityAndState ? `${cityAndState.city}, ${cityAndState.state}` : 'Unknown';

      const defaultCity: City = {
        name: 'Bob',
      };

      this.selectedCity = defaultCity;
    } catch (error) {
      console.error('Error getting location or city:', error);
    }
  }

  loadProfiles() {
    const ids = [
      '0AwydcoR9vBqxgGEqSC4',
      '0hYBmO1E9zWchTG10HYu',
      '4zabANw6u84SlvkuVR39',
      'JDSRwMa6zvtlMBV4R6w0',
      'JxZm1sqnlanWEWqmu8VZ',
      'd15bPmPQh5fYGZnM184J',
      'dEbY90JHKHliLuardpjE',
      'gMSmrb4hauDflm8wxszH',
      'kS7JQJUvXHcSLsEmOAAH',
      'nbAm2E4B3Q6Xa2xjDv98',
      'pX4bZkLx1Yc1b0e3vY8W',
      'puHls5z4UUziwW8R19dC',
      'u4K0PQg6NnUJtGmegfjf',
      'wF3cqveUETHQ0JfS33aR',
    ];

    this.profiles$ = this.profileService.getProfiles(this.shuffle(ids).slice(0, 5));
  }

  openProfile(user: Profile) {
    console.log('Opening profile for', user.name);
    // Navigate or open modal here
  }

  shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
