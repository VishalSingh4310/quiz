export interface Quiz {
  _id: string;
  name: string;
  description?: string;
  instructions?: string[];
  totalPoints: number;
  questions?: any;
  questionIds?: string[];
}
