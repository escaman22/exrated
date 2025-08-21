import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  currentCity: string | null = null;
  cities: City[] | undefined;

  selectedCity: City | undefined;

  constructor(private locationService: LocationService) {}

  async ngOnInit() {
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

  openProfile(user: UserProfile) {
    console.log('Opening profile for', user.name);
    // Navigate or open modal here
  }

  users: UserProfile[] = [
    {
      id: 1,
      name: 'Alice Johnson',
      avatarUrl: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
      previewComment: 'This is such a great idea! I love it.',
      flag: 'green',
      timeAgo: '2h ago',
      likes: 12,
    },
    {
      id: 2,
      name: 'David Park',
      avatarUrl: '',
      previewComment: 'Not sure about this one. Could use improvements.',
      flag: 'red',
      timeAgo: '5h ago',
      likes: 3,
    },
    {
      id: 3,
      name: 'Sofia Lee',
      avatarUrl: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png',
      previewComment: 'Wow! This changed my perspective completely.',
      flag: 'green',
      timeAgo: '1d ago',
      likes: 18,
    },
  ];
}
