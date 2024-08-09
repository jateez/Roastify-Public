const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
// const redirect_uri = `http://localhost:${process.env.PORT}/spotify-callback`;
const redirect_uri = 'https://roastify-api.aryajati.my.id/spotify-callback';
const querystring = require("querystring");
const generateRandomString = require("../helpers/randomStrGenerator");
const axios = require("axios");
const OpenAI = require("openai");
const { User, RoastHistory } = require("../models/index");

class SpotifyController {

  static async login(req, res, next) {
    try {
      const state = generateRandomString(16);
      const scope = "user-read-private user-read-email user-read-recently-played user-top-read user-library-read playlist-read-private"
      const params = querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      })
      const loginUrl = "https://accounts.spotify.com/authorize?" + params;
      res.status(200).json({ loginUrl });
    } catch (error) {
      next(error)
    }
  }
  static async callback(req, res, next) {
    try {
      const { code, state } = req.query;
      if (!code || !state) {
        return res.status(400).json({ error: 'Missing code or state' });
      }

      const authOptions = {
        method: "post",
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
          code: code,
          redirect_uri,
          grant_type: "authorization_code"
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
      }

      const { data } = await axios(authOptions);
      res.redirect(`${process.env.CLIENT_BASE_URL}/callback?spotify_access_token=${data.access_token}`)
    } catch (error) {
      next(error);
    }
  }
  static async getUserProfile(req, res, next) {
    try {
      const { spotify_access_token } = req.body
      const { userId } = req
      const { data } = axios({
        method: "get",
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: `Bearer ${spotify_access_token}`
        }
      }
      )

      await User.update({ spotifyId: data.id }, { where: { id: userId } })
      res.status(200).json({ data })
    } catch (error) {
      next(error)
    }
  }


  static async getUserRoast(req, res, next) {
    try {
      const { spotify_access_token } = req.query
      let artists = (await axios({
        method: "get",
        url: "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10",
        headers: {
          Authorization: `Bearer ${spotify_access_token}`
        }
      })).data


      artists = artists.items.map(el => {
        delete el.external_urls;
        if (el.genres.length !== 0) {
          el.genres = el.genres.join(", ")
        }
        delete el.href
        delete el.uri
        delete el.type
        el.total_followers = el.followers.total
        delete el.followers
        return el
      })

      const artistData = [...artists]

      artists = artists.map(artist => {
        delete artist.images
        delete artist.id
        artist.popularity_score = artist.popularity
        delete artist.popularity
        return JSON.stringify(artist)
      })
      artists = artists.join("  ");

      let tracks = (await axios({
        method: "get",
        url: "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10",
        headers: {
          Authorization: `Bearer ${spotify_access_token}`
        }
      })).data;

      tracks = tracks.items.map(el => {
        el.album = {
          type: el.album.type,
          total_track: el.album.total_tracks,
          name: el.album.name,
          release_data: el.album.release_date,
        }
        el.artists = el.artists.map(artist => artist.name).join(", ")
        delete el.available_markets
        delete el.disc_number
        delete el.external_ids
        delete el.external_urls
        delete el.href
        delete el.is_playable
        delete el.linked_from
        delete el.restrictions
        delete el.preview_url
        delete el.uri
        delete el.is_local
        return el
      })

      const trackData = [...tracks]


      tracks = tracks.map(track => {
        delete track.id
        delete track.type
        delete track.album.type
        delete track.duration_ms
        delete track.track_number
        return JSON.stringify(track)
      })
      tracks = tracks.join(" ")

      const openai = new OpenAI();
      const contentStr = `
      You are an advanced AI designed to generate creative and edgy content. Your task is to provide roasting comments for user about their taste of music artists and their tracks based on the given data. Your roasts should be harsh, direct, and infused with humor. Use colloquial language and be unapologetically blunt. Here’s what you need to know:
      Data Structure:
      - Artist Data: Each artist has attributes including genres, name, total followers, and popularity score.
      - Track Data: Each track has attributes including album name, release date, artist, explicitness, name, and popularity.

      Roasting Guidelines:
      - Focus on the artist's popularity, music quality, and overall impact.
      - You can also focus on the user track taste
      - Make comparisons with other artists or tracks if it highlights the shortcomings.
      - Use hyperbolic and sarcastic language to emphasize criticisms.
      - Aim for humor. bit offensives are fine.
      - You may assume the user personality from their taste
      Output Format:
      - Directly provide the roasting comments in paragraph form without pre-text or post-text.
      - use bahasa indonesia, and more terms commonly used by younger generation
      - put the roast in a one paragraph, dont use numbering
      - set maximum output limited to 150 token
      Given the following data, generate roasting comments:
        ${artists} and ${tracks}
      `
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: contentStr }],
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0.9,
        max_tokens: 200,
      });

      const { userId } = req
      await User.update({ spotifyId: 1 }, {
        where: {
          id: userId
        }
      })
      const createdRoast = await RoastHistory.create({ UserId: userId, roastType: "spotify_account", roastData: completion.choices[0].message.content, tracks: trackData, artists: artistData })
      res.status(201).json({ output: createdRoast })
    } catch (error) {
      next(error)
    }
  }

  static async searchSpotify(req, res, next) {
    try {
      const { spotify_access_token } = req.body
      const { search, type } = req.query
      const results = (await axios({
        method: "get",
        url: `https://api.spotify.com/v1/search?q=${search}&type=${type}&market=ID&limit=5`,
        headers: {
          Authorization: `Bearer ${spotify_access_token}`
        }
      })).data
      res.status(200).json(results)
    } catch (error) {
      next(error)
    }
  }

  static async getCustomRoast(req, res, next) {
    try {
      const { selectedItems } = req.body;
      const { userId } = req;

      // Separate artists and tracks
      const artists = selectedItems.filter(item => item.type === 'artist');
      const tracks = selectedItems.filter(item => item.type === 'track');

      // Process artists data
      const processedArtists = artists.map(artist => ({
        name: artist.name,
        genres: artist.genres ? artist.genres.join(', ') : '',
        total_followers: artist.followers.total,
        popularity_score: artist.popularity
      }));

      // Process tracks data
      const processedTracks = tracks.map(track => ({
        name: track.name,
        artists: track.artists.map(a => a.name).join(', '),
        album: {
          name: track.album.name,
          release_date: track.album.release_date,
        },
        popularity: track.popularity,
        explicit: track.explicit
      }));

      const artistsStr = JSON.stringify(processedArtists);
      const tracksStr = JSON.stringify(processedTracks);

      const openai = new OpenAI();
      const contentStr = `
      You are an advanced AI designed to generate creative and edgy content. Your task is to provide roasting comments for user about their taste of music artists and their tracks based on the given data. Your roasts should be harsh, direct, and infused with humor. Use colloquial language and be unapologetically blunt. Here's what you need to know:
      Data Structure:
      - Artist Data: Each artist has attributes including genres, name, total followers, and popularity score.
      - Track Data: Each track has attributes including album name, release date, artist, explicitness, name, and popularity.
  
      Roasting Guidelines:
      - Focus on the artist's popularity, music quality, and overall impact.
      - You can also focus on the user track taste
      - Make comparisons with other artists or tracks if it highlights the shortcomings.
      - Use hyperbolic and sarcastic language to emphasize criticisms.
      - Aim for humor. bit offensives are fine.
      - You may assume the user personality from their taste
      Output Format:
      - Directly provide the roasting comments in paragraph form without pre-text or post-text.
      - use bahasa indonesia, and more terms commonly used by younger generation
      - put the roast in a one paragraph, dont use numbering
      - set maximum output limited to 150 token
      Given the following data, generate roasting comments:
        Artists: ${artistsStr} and Tracks: ${tracksStr}
      `;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: contentStr }],
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0.9,
        max_tokens: 200,
      });

      await User.update({ spotifyId: 1 }, {
        where: {
          id: userId
        }
      });

      const createdRoast = await RoastHistory.create({
        UserId: userId,
        roastType: "custom_spotify",
        roastData: completion.choices[0].message.content,
        tracks: processedTracks,
        artists: processedArtists
      });

      res.status(201).json({ output: createdRoast.roastData });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SpotifyController