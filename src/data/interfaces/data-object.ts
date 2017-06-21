export interface IDataObject {
  id: string;
  name: string;
  icon: string;
  description: string;
  data_type: string;
  tags: string[];

  toDTO(): any;
  toDBO(): any;
}
