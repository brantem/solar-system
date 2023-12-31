import { Prediction } from '../types';

export abstract class Model {
  abstract start(): Promise<void>;
  abstract predict(data: unknown): Promise<Prediction | null>;
}
