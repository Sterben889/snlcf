/* eslint-disable @typescript-eslint/no-unsafe-argument */
import "server-only";

import { unstable_cache } from "next/cache";

import { env } from "~/env";

const youtubeApiBaseUrl = "https://www.googleapis.com/youtube/v3";

export const youtubeStreamsUrl = "https://www.youtube.com/@SNLCFLive/streams";

const channelHandle = "@SNLCFLive";

type YouTubeChannelResponse = {
  items?: Array<{
    id: string;
  }>;
};

type YouTubeSearchResponse = {
  items?: Array<{
    id?: {
      videoId?: string;
    };
  }>;
};

type YouTubeVideo = {
  id: string;

  snippet?: {
    title?: string;
    publishedAt?: string;
  };

  status?: {
    embeddable?: boolean;
  };

  liveStreamingDetails?: {
    actualStartTime?: string;
    actualEndTime?: string;
    scheduledStartTime?: string;
  };
};

type YouTubeVideosResponse = {
  items?: YouTubeVideo[];
};

export type LatestYouTubeStream = {
  videoId: string;
  title: string;
  isLive: boolean;
  watchUrl: string;
  embedUrl: string;
};

async function youtubeRequest<T>(
  endpoint: string,
  parameters: Record<string, string>,
): Promise<T> {
  const url = new URL(`${youtubeApiBaseUrl}/${endpoint}`);

  for (const [name, value] of Object.entries(parameters)) {
    url.searchParams.set(name, value);
  }

  url.searchParams.set("key", env.YOUTUBE_API_KEY);

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `YouTube request failed with status ${response.status}: ${errorBody}`,
    );
  }

  return (await response.json()) as T;
}

function getStreamTime(video: YouTubeVideo): number {
  const timestamp =
    video.liveStreamingDetails?.actualStartTime ??
    video.liveStreamingDetails?.scheduledStartTime ??
    video.snippet?.publishedAt;

  if (!timestamp) {
    return 0;
  }

  const parsedTime = Date.parse(timestamp);

  return Number.isNaN(parsedTime) ? 0 : parsedTime;
}

async function fetchLatestYouTubeStream(): Promise<LatestYouTubeStream | null> {
  /*
   * Convert @SNLCFLive into the permanent UC... channel ID.
   */
  const channelResponse = await youtubeRequest<YouTubeChannelResponse>(
    "channels",
    {
      part: "id",
      forHandle: channelHandle,
    },
  );

  const channelId = channelResponse.items?.[0]?.id;

  if (!channelId) {
    throw new Error(`YouTube channel ${channelHandle} could not be found.`);
  }

  /*
   * Retrieve the channel's newest videos.
   */
  const searchResponse = await youtubeRequest<YouTubeSearchResponse>("search", {
    part: "snippet",
    channelId,
    type: "video",
    order: "date",
    maxResults: "25",
  });

  const videoIds = (searchResponse.items ?? [])
    .map((item) => item.id?.videoId)
    .filter((videoId): videoId is string => Boolean(videoId));

  if (videoIds.length === 0) {
    return null;
  }

  /*
   * Retrieve livestream information for the returned videos.
   */
  const videosResponse = await youtubeRequest<YouTubeVideosResponse>("videos", {
    part: "snippet,status,liveStreamingDetails",
    id: videoIds.join(","),
  });

  const streams = (videosResponse.items ?? []).filter(
    (video) =>
      video.status?.embeddable !== false && Boolean(video.liveStreamingDetails),
  );

  /*
   * Prioritize:
   * 1. A stream that is currently live
   * 2. The most recently completed stream
   * 3. The nearest upcoming stream
   */
  const activeStream = streams
    .filter(
      (video) =>
        Boolean(video.liveStreamingDetails?.actualStartTime) &&
        !video.liveStreamingDetails?.actualEndTime,
    )
    .sort((first, second) => {
      return getStreamTime(second) - getStreamTime(first);
    })[0];

  const completedStream = streams
    .filter(
      (video) =>
        Boolean(video.liveStreamingDetails?.actualStartTime) &&
        Boolean(video.liveStreamingDetails?.actualEndTime),
    )
    .sort((first, second) => {
      return getStreamTime(second) - getStreamTime(first);
    })[0];

  const upcomingStream = streams
    .filter(
      (video) =>
        !video.liveStreamingDetails?.actualStartTime &&
        Boolean(video.liveStreamingDetails?.scheduledStartTime),
    )
    .sort((first, second) => {
      return getStreamTime(first) - getStreamTime(second);
    })[0];

  const selectedStream = activeStream ?? completedStream ?? upcomingStream;

  if (!selectedStream) {
    return null;
  }

  const isLive =
    Boolean(selectedStream.liveStreamingDetails?.actualStartTime) &&
    !selectedStream.liveStreamingDetails?.actualEndTime;

  return {
    videoId: selectedStream.id,
    title: selectedStream.snippet?.title ?? "SNLCF Livestream",
    isLive,
    watchUrl: `https://www.youtube.com/watch?v=${selectedStream.id}`,
    embedUrl: `https://www.youtube.com/embed/${selectedStream.id}`,
  };
}

/*
 * Avoid using the YouTube API every time someone loads the homepage.
 * The result is refreshed automatically every 30 minutes.
 */
export const getLatestYouTubeStream = unstable_cache(
  fetchLatestYouTubeStream,
  ["snlcf-latest-youtube-stream"],
  {
    revalidate: 60 * 60 * 24 * 7,
  },
);
