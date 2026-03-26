export const makeId = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;
export const isImageFile = (file: File) => file.type.startsWith("image/");