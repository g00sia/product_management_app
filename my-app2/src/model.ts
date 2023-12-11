export interface Comment {
    id: number;
    content: string;
  }

export interface Product{
    id:number;
    product:string;
    description:string;
    image_url:string;
    comments:Comment[];
}