import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface City {
  city: string;
  state: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {} // Inject HttpClient

  getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }

  async getCityFromCoordinates(latitude: number, longitude: number): Promise<City | null> {
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your API key
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    try {
      const response: any = await this.http.get(url).toPromise();
      if (response && response.address) {
        const location = <City>{
          city: response.address.city,
          state: response.address.state,
        };

        return location;
      }
      return null;
    } catch (error) {
      console.error('Error during reverse geocoding:', error);
      return null;
    }
  }
}
