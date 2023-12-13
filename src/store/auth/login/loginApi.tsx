import { gql, useMutation } from "@apollo/client";

const LOGIN_MUTATION=gql `
mutation UpdateCategory($input: AdminLoginInput!) {
  loginAdmin(input: $input) {
    _id
    token
  }
}

`
const [loginAdmin] = useMutation(LOGIN_MUTATION);

export const loginApi = async (user:any) => {
  
  
  // Perform the mutation
  const response = await loginAdmin({
    variables: {
      input: {
        email: user.email,
        password: user.password,
      },
    },
  });

  return response;
};
