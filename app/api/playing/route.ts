import querystring from "querystring";

const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTTLY_PLAYED_ENDPOINT='https://api.spotify.com/v1/me/player/recently-played'
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

// console.log({CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN})

const getAccessToken = async () => {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  });

  return await response.json();
};

const getNowPlaying = async () => {
  const { access_token } = await getAccessToken();

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const getRecentlyPlayed = async () => {
  const { access_token } = await getAccessToken();

  return fetch(RECENTTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export async function GET() {
  try {
    const response = await getNowPlaying();
    const lastPlayed = await getRecentlyPlayed()
     //console.log({response})


    //  const nowPlayingData = await response.json();
    //  const lastPlayedData = await lastPlayed.json();
   
    // return an error if the user is currently not playing any song
   // const error = { isPlaying: false };
    if (response.status === 204 || response.status > 400) {
      const lastPlayedData = await lastPlayed.json();
      const lastPlayedSong = lastPlayedData.items[0]
      //console.log(lastPlayedSong.context)

      const title = lastPlayedSong.track.name;
      const artist = (lastPlayedSong.track.artists as { name: string }[])
        .map((_artist) => _artist.name)
        .join(", ");
      const album = lastPlayedSong.track.album.name;
      const albumArt = lastPlayedSong.track.album.images[0]?.url;
      const url = lastPlayedSong.track.context?.external_urls?.spotify;
      const playedAt = lastPlayedSong.track.playedAt;
  
      return new Response(
        JSON.stringify({title, artist, album, albumArt, url, playedAt })
      );

      // return new Response(JSON.stringify(error), {
      //   status: 204,
      //   statusText: "User is rejuvenating",
      // });
    }

    const song = await response.json();
    if (!song.item) {
      return new Response(
        JSON.stringify({ error: "Unable to find song" }),
        { status: 404 }
      );
  
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = (song.item.artists as { name: string }[])
      .map((_artist) => _artist.name)
      .join(", ");
    const album = song.item.album.name;
    const albumArt = song.item.album.images[0]?.url;

    return new Response(
      JSON.stringify({ isPlaying, title, artist, album, albumArt })
    );
  } catch (error) {
    //console.log({error})
    return new Response(JSON.stringify(error), {
      status: 500,
      statusText: "Error fetching currently playing",
    });
  }
}
