"use client";

import useNowPlaying from "../hooks/useNowPlaying";

const NowPlaying = () => {
  const { currentTrack, loading } = useNowPlaying();

  console.log({loading})
  // if (loading) return <p>Loading...</p>;

  console.log({currentTrack})

  // if (!currentTrack.isPlaying) return <p>User is offline...</p>;

  return (
    <>
      <div className="w-full flex items-center gap-4 mx-auto max-w-[564px] border border-gray-200 rounded-lg p-2">
        <img
          src={currentTrack.albumArt}
          alt={currentTrack.title}
          className="size-20 lg:size-[120px] rounded-md object-cover"
        />
        <div className="space-y-1">
          <h6 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {currentTrack.title}
          </h6>
          <p className="text-gray-700 text-base font-medium">
            {currentTrack.artist}
          </p>
          <p className="text-gray-500 text-sm font-medium italic">
            {currentTrack.album}
          </p>
        </div>
      </div>
    </>
  );
};

export default NowPlaying;
