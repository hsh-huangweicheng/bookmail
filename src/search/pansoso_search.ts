import { Search, SearchResult, SerachRequest } from './search';
import { default as fetch } from 'node-fetch';
import * as cheerio from 'cheerio';
import * as querystring from 'querystring';

const PROP_MAPPING = {
    name: '文件名',
    size: '文件大小',
    sharedPerson: '分享者',
    sharedDate: '分享时间',
    downloadCount: '下载次数'
};

export class PansosoSearch implements Search {

    public search(req: SerachRequest): Promise<SearchResult> {

        const searchUrl = `http://www.pansoso.com/zh/${querystring.escape(req.keyword)}`;

        const requestOptions = {
            'headers': {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,tr;q=0.4',
                'Connection': 'keep-alive',
                'Host': 'www.pansoso.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36',
            }
        };

        return fetch(searchUrl, requestOptions).then((res) => {
            return res.text().then((html) => {
                return this.parseHtml(html);
            })
        });
    }

    private parseHtml(html: string) {
        const $ = cheerio.load(html);
        const list: any[] = [];
        $('#content .pss').each((index: number, itemElement: CheerioElement) => {
            const itemStr = $(itemElement).find('.des').text();
            const itemJson: any = this.parseItem(itemStr);
            itemJson.name = itemJson.name || $(itemElement).find('h2').text();
            list.push(itemJson);
        });

        return { list: list, total: list.length };
    }

    private parseItem(item: string) {
        const json = {};
        Object.keys(PROP_MAPPING).forEach((key) => {
            const reg = new RegExp(`${PROP_MAPPING[key]}:(.*) `);
            const matchs = reg.exec(item);
            if (matchs) {
                json[key] = matchs[1];
            }
        });
        return json;
    }

}