import React from 'react';
import type {PartialDeep} from 'type-fest';
import type {Video as VideoType} from '../../storefront-api-types';
import {ImageSizeOptions, useImageUrl} from '../../utilities';

export type VideoProps = JSX.IntrinsicElements['video'] & {
  /** An object with fields that correspond to the Storefront API's [Video object](/api/storefront/latest/objects/video). */
  data: PartialDeep<VideoType>;
  /** An object of image size options for the video's `previewImage`. */
  options?: ImageSizeOptions;
};

/**
 * The `Video` component renders a `video` for the Storefront API's [Video object](/api/storefront/reference/products/video).
 */
export function Video({
  data,
  options,
  id = data.id,
  playsInline = true,
  controls = true,
  ...passthroughProps
}: VideoProps) {
  const posterUrl = useImageUrl(
    data.previewImage?.url as string | undefined,
    options
  );

  if (!data.sources) {
    throw new Error(`<Video/> requires a 'data.sources' array`);
  }

  return (
    <video
      {...passthroughProps}
      id={id}
      playsInline={playsInline}
      controls={controls}
      poster={posterUrl}
    >
      {data.sources.map((source) => {
        if (!(source?.url && source?.mimeType)) {
          throw new Error(`<Video/> needs 'source.url' and 'source.mimeType'`);
        }
        return (
          <source key={source.url} src={source.url} type={source.mimeType} />
        );
      })}
    </video>
  );
}
