interface ICreateRentalDTO {
  id?: string;
  expected_return_date: Date;
  car_id: string;
  user_id: string;
}

export { ICreateRentalDTO };
