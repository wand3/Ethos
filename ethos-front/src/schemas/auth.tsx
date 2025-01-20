
export interface RegisterUserInputSchema {
  username: string;
  email: string;
  password: string;
}

export interface RegisterUserOutputSchema {
  email: string
  username: string
  disabled?: boolean
  profile_pic?: string
}