interface ICreateRentalDTO {
  id?: string;
  expected_return_date: Date;
  car_id: string;
  user_id: string;
  end_date?: Date;
  total?: number;
}

export { ICreateRentalDTO };
