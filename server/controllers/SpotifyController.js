const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const redirect_uri = 'http://localhost:3003/spotify-callback';
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
      res.redirect("https://accounts.spotify.com/authorize?" + params);
    } catch (error) {
      next(error)
    }
  }

  static async callback(req, res, next) {
    try {
      const code = req.query.code || null;
      const state = req.query.state || null;
      console.log(code, "<< code")
      console.log(state, "<< state")
      if (state === null) {
        res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
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
      console.log(data, "<< data")
      res.status(200).json({ spotify_access_token: data.access_token })
    } catch (error) {
      next(error)
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
      const { spotify_access_token } = req.body
      let artists = (await axios({
        method: "get",
        url: "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10",
        headers: {
          Authorization: `Bearer ${spotify_access_token}`
        }
      })).data
      // const data = req.body.data

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

      // let artistPrompt = artists.map(artist => {
      //   delete artist.images
      //   delete artist.id
      //   artist.popularity_score = artist.popularity
      //   delete artist.popularity
      //   return JSON.stringify(artist)
      //   // return artist
      // })
      // artistPrompt = artistPrompt.join("  ");

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
          total_track: el.album.total_track,
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
      await
      // let tracksPrompt = tracks.map(track => {
      //   delete track.id
      //   delete track.type
      //   delete track.album.type
      //   delete track.duration_ms
      //   delete track.track_number
      //   return JSON.stringify(track)
      //   // return track
      // })
      // tracksPrompt = tracksPrompt.join(" ")
      //
      // const openai = new OpenAI();
      // const contentStr = `
      // You are an advanced AI designed to generate creative and edgy content. Your task is to provide roasting comments for user about their taste of music artists and their tracks based on the given data. Your roasts should be harsh, direct, and infused with humor. Use colloquial language and be unapologetically blunt. Here’s what you need to know:
      // Data Structure:
      // - Artist Data: Each artist has attributes including genres, name, total followers, and popularity score.
      // - Track Data: Each track has attributes including album name, release date, artist, explicitness, name, and popularity.

      // Roasting Guidelines:
      // - Focus on the artist's popularity, music quality, and overall impact.
      // - You can also focus on the user track taste
      // - Make comparisons with other artists or tracks if it highlights the shortcomings.
      // - Use hyperbolic and sarcastic language to emphasize criticisms.
      // - Aim for humor. bit offensives are fine.
      // - You may assume the user personality from their taste
      // Output Format:
      // - Directly provide the roasting comments in paragraph form without pre-text or post-text.
      // - use bahasa indonesia, and more terms commonly used by younger generation
      // - put the roast in a one paragraph, dont use numbering
      // - set maximum output limited to 150 token
      // Given the following data, generate roasting comments:
      //  ${artistPrompt} and ${tracksPrompt}
      // `
      // const completion = await openai.chat.completions.create({
      //   messages: [{ role: "system", content: contentStr }],
      //   model: "gpt-4o-mini-2024-07-18",
      //   temperature: 0.9,
      //   max_tokens: 150,
      // });

      // console.log(completion.choices[0]);
      // console.log(tracks)
      const { userId } = req
      // await RoastHistory.create({ UserId: userId, roastType: "spotify_account", roastData: completion.choices[0].message.content })
      // res.status(200).json({ output: completion.choices[0] })
      res.status(200).json({ tracks, artists })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

module.exports = SpotifyController