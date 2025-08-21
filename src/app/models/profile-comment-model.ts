export interface ProfileComment {
  id?: string;
  text: string;
  likes?: number;
  timeAgo?: string;
  authorProfileUrl?: string;
  flagType?: string;
  authorName?: string;
}
