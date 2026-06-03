import { VISIT_DETECTION_CONFIG } from '@/constants/wanderlog';
import type { VisitDraft } from '@/types/domain';
import { haversineDistanceMeters } from '@/utils/geo';
import { inferCategoryFromAddress } from '@/utils/place';

type DetectionPoint = {
  latitude: number;
  longitude: number;
  timestamp: string;
  userId: string;
  placeName: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
};

type CandidateVisit = {
  anchorLat: number;
  anchorLon: number;
  startedAt: string;
  latestAt: string;
  userId: string;
  placeName: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
};

export class VisitDetectorService {
  private candidate: CandidateVisit | null = null;

  ingest(point: DetectionPoint): VisitDraft | null {
    if (!this.candidate) {
      this.candidate = {
        anchorLat: point.latitude,
        anchorLon: point.longitude,
        startedAt: point.timestamp,
        latestAt: point.timestamp,
        userId: point.userId,
        placeName: point.placeName,
        address: point.address,
        city: point.city,
        state: point.state,
        country: point.country,
      };
      return null;
    }

    const distance = haversineDistanceMeters(
      this.candidate.anchorLat,
      this.candidate.anchorLon,
      point.latitude,
      point.longitude,
    );

    const startDate = new Date(this.candidate.startedAt);
    const latestDate = new Date(point.timestamp);
    const minutes = Math.round((latestDate.getTime() - startDate.getTime()) / 60000);

    if (distance <= VISIT_DETECTION_CONFIG.radiusMeters) {
      this.candidate.latestAt = point.timestamp;
      this.candidate.placeName = point.placeName;
      this.candidate.address = point.address;
      this.candidate.city = point.city;
      this.candidate.state = point.state;
      this.candidate.country = point.country;

      if (minutes >= VISIT_DETECTION_CONFIG.minimumDurationMinutes) {
        const completed: VisitDraft = {
          userId: this.candidate.userId,
          latitude: this.candidate.anchorLat,
          longitude: this.candidate.anchorLon,
          placeName: this.candidate.placeName,
          address: this.candidate.address,
          category: inferCategoryFromAddress(this.candidate.placeName, this.candidate.address),
          city: this.candidate.city,
          state: this.candidate.state,
          country: this.candidate.country,
          arrivedAt: this.candidate.startedAt,
          departedAt: this.candidate.latestAt,
          durationMinutes: minutes,
        };

        this.candidate = null;
        return completed;
      }

      return null;
    }

    this.candidate = {
      anchorLat: point.latitude,
      anchorLon: point.longitude,
      startedAt: point.timestamp,
      latestAt: point.timestamp,
      userId: point.userId,
      placeName: point.placeName,
      address: point.address,
      city: point.city,
      state: point.state,
      country: point.country,
    };

    return null;
  }

  reset() {
    this.candidate = null;
  }
}
