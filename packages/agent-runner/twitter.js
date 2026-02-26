/**
 * Twitter/X API adapter for Marketing Agent.
 * Uses twitter-api-v2. Set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET.
 * MARKETING_AUTO_POST=true to actually post; otherwise drafts are queued for review.
 */

import { TwitterApi } from "twitter-api-v2";

let client = null;

function getClient() {
  const key = process.env.TWITTER_API_KEY;
  const secret = process.env.TWITTER_API_SECRET;
  const token = process.env.TWITTER_ACCESS_TOKEN;
  const tokenSecret = process.env.TWITTER_ACCESS_SECRET;
  if (!key || !secret || !token || !tokenSecret) return null;
  if (!client) {
    client = new TwitterApi({
      appKey: key,
      appSecret: secret,
      accessToken: token,
      accessSecret: tokenSecret,
    });
  }
  return client;
}

export function isTwitterConfigured() {
  return !!getClient();
}

export function isAutoPostEnabled() {
  return process.env.MARKETING_AUTO_POST === "true" || process.env.MARKETING_AUTO_POST === "1";
}

export async function postTweet(text) {
  const c = getClient();
  if (!c) return { ok: false, error: "Twitter not configured" };
  if (!isAutoPostEnabled()) return { ok: false, draft: text };

  const rwClient = c.readWrite;
  const tweet = await rwClient.v2.tweet(text);
  return { ok: true, id: tweet.data?.id };
}

export async function searchTweets(query, maxResults = 10) {
  const c = getClient();
  if (!c) return { ok: false, tweets: [], error: "Twitter not configured" };

  try {
    const roClient = c.readOnly;
    const result = await roClient.v2.search(query, {
      "tweet.fields": ["created_at", "public_metrics", "author_id"],
      max_results: Math.min(maxResults, 100),
    });
    const tweets = result.tweets ?? [];
    return { ok: true, tweets };
  } catch (e) {
    return {
      ok: false,
      tweets: [],
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function replyToTweet(tweetId, text) {
  const c = getClient();
  if (!c) return { ok: false, error: "Twitter not configured" };
  if (!isAutoPostEnabled()) return { ok: false, draft: { tweetId, text } };

  const rwClient = c.readWrite;
  const reply = await rwClient.v2.tweet(text, { reply: { in_reply_to_tweet_id: tweetId } });
  return { ok: true, id: reply.data?.id };
}
