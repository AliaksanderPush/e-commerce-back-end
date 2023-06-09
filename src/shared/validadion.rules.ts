import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class CustomPasswordValidate implements ValidatorConstraintInterface {
	validate(text: string, args: ValidationArguments) {
		return !text.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^_&.*-]).{1,}$/);
	}

	defaultMessage(args: ValidationArguments) {
		return 'The password must contain characters, including letters, numbers, special characters, no spaces!';
	}
}
