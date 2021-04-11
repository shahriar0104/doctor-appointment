export interface DoctorChoose {
  id: number;
  name: string;
  image: string;
  org: string;
  availability?: {};
  schedule?: {}[];
  visitDurationInMin?: number;
}
