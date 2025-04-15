import * as ExifParser from 'exif-parser';

export function extractExifData(buffer: Buffer) {
  const parser = ExifParser.create(buffer);

  try {
    const result = parser.parse();
    console.log(result);

    return {
      cameraMake: result.tags.Make,
      cameraModel: result.tags.Model,
      dateTaken: result.tags.DateTimeOriginal,
      latitude: result.tags.GPSLatitude,
      longitude: result.tags.GPSLongitude,
      imageWidth: result.imageSize?.width,
      imageHeight: result.imageSize?.height,
      rawTags: result.tags,
    };
  } catch (error) {
    console.warn('Could not extract EXIF data: ', error.message);

    return null;
  }
}
