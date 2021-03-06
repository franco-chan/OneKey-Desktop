import axios from 'axios';
import { Post } from './types';
import parser from 'fast-xml-parser';
import { MEDIUM_FEED_URL, MEDIUM_CDN_BASE, ONEKEY_CDN_BASE } from './config';
import cheerio from 'cheerio';

const replaceCDNLink = (onekeyLink?: string) => {
    if (!onekeyLink) return undefined;
    return onekeyLink.replace(MEDIUM_CDN_BASE, ONEKEY_CDN_BASE);
};

const getPosts = (data: any, limit = 5) => {
    const posts = data.rss.channel.item;
    const result: Post[] = [];

    if (data.length < 1) {
        return null;
    }

    for (let i = 0; i < posts.length; i++) {
        if (result.length >= limit) break;

        const { title, pubDate, link } = posts[i];
        const $ = cheerio.load(posts[i]['content:encoded']);
        const thumbnail = replaceCDNLink($('img').first().attr('src'));

        if (link.includes('blog.onekey.io')) {
            result.push({
                title,
                description: $('p').first().text(),
                thumbnail,
                pubDate,
                link,
            });
        }
    }

    return result;
};

const fetcher = (
    limit: number,
    callback: (statusCode: number, data: string | null, errMessage?: string) => void,
) => {
    axios
        .get(MEDIUM_FEED_URL)
        .then(response => {
            try {
                const data = parser.parse(response.data, {}, true);
                const posts = getPosts(data, limit);
                callback(200, JSON.stringify(posts));
            } catch (err) {
                callback(500, null, err.message);
            }
        })
        .catch(error => callback(500, null, error.message));
};

export default fetcher;
