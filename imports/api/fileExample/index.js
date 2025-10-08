import { FilesCollection } from "meteor/ostrio:files";

const FILE_MAX_SIZE = 10485760; // 10MB
const FILE_EXT = ["png", "jpg", "jpeg"];
const FILE_EXT_REGEX = new RegExp(`(${FILE_EXT.join("|")})$`, "i");

/**
 * Example file collection to demonstrate file upload and management.
 * This collection only allows image files (png, jpg, jpeg) up to 10MB in size.
 *
 * It uses the `ostrio:files` package for file handling.
 * Every client code to remove files is disallowed for security reasons.
 *
 * You can use hooks such as `onBeforeUpload` to validate files before upload.
 *
 * @see https://github.com/veliovgroup/Meteor-Files
 */
export const exampleFileCollection = new FilesCollection({
	collectionName: "fileExample",
	allowClientCode: false, // Disallow remove files from Client
	onBeforeUpload(file) {
		// Allow upload files under 10MB, and only in png/jpg/jpeg formats
		if (file.size <= FILE_MAX_SIZE && FILE_EXT_REGEX.test(file.extension)) {
			return true;
		}

		return "Please upload image, with size equal or less than 10MB";
	},
});
