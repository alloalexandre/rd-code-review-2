import type { PrivateGlobals } from "../globals/server/globals";

/**
 * This module allows you to create a singleton that contains the application's globals.
 * The client receives these globals via a Meteor method.
 *
 * - See `imports/globals/server/exposeGlobals`
 * - See `imports/globals/server/globals`
 */
export let GLOBALS: PrivateGlobals | null = null;

/**
 * Returns the global variables of the application.
 * These variables are set by the server and sent to the client
 * via a Meteor method.
 */
export function getGlobals(): PrivateGlobals | null {
	return GLOBALS;
}

/**
 * Set the global variables of the application.
 * This function is used to update the global variables when
 * the server sends new values.
 */
export function setGlobals(value: PrivateGlobals): void {
	GLOBALS = value;
}

type GlobalArray = Array<{ id: string; label: string }>;

/**
 * Creates an array of input options from a GLOBAL_ARRAY.
 * The GLOBAL_ARRAY should be an array of objects with 'id' and 'label' properties.
 * Each object in the array is transformed into an input option object with 'id' and 'label' properties.
 * The resulting array is suitable for use in SelectInput and MultiSelectInput.
 * 
 * @example
 * const GLOBAL_ARRAY = [
  { id: 'option1', label: 'Option 1', checked: true },
  { id: 'option2', label: 'Option 2', checked: false },
  { id: 'option3', label: 'Option 3', checked: true }
 ]

 const inputOptions = createInputOptionsFromGlobalArray(GLOBAL_ARRAY);
 console.log(inputOptions);

 // Output:
 // [
 //   { id: 'option1', label: 'Option 1' },
 //   { id: 'option2', label: 'Option 2' },
 //   { id: 'option3', label: 'Option 3' }
 // ]
 */
export function createInputOptionsFromGlobalArray(
	GLOBAL_ARRAY: GlobalArray,
): GlobalArray {
	return GLOBAL_ARRAY.map((item) => ({
		id: item.id,
		label: item.label,
	}));
}
