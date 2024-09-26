declare namespace Express {
  export interface Request {
    me?: {
      name: string;
      email: string;
      id: string;
    };
  }
}
