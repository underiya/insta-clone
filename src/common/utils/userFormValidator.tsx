import { validateOrReject } from 'class-validator';

export async function validateOrRejectUser(input) {
  try {
    await validateOrReject(input);
    console.log('validation successful');
  } catch (errors) {
    console.log(
      'Caught promise rejection (validation failed). Errors: ',
      errors,
    );
  }
}
