interface ISendMailDTO {
  to: string;
  subject: string;
  variables: object;
  path: string;
}

export { ISendMailDTO };
