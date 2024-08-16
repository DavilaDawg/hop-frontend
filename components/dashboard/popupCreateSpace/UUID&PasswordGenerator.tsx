import { v4 as uuidv4 } from "uuid";

// generate a UUIDv4
export const generateUUID = (): string => {
	return uuidv4();
};

//  4-digit password
export const generatePassword = (): string => {
	return Math.floor(1000 + Math.random() * 9000).toString();
};
