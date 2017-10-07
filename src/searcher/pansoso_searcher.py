import requests
from bs4 import BeautifulSoup
from typing import List

from searcher.search_item import SearchItem
from searcher.searcher_base import SearcherBase


class PansosoSearcher(SearcherBase):
    """盘搜搜 http://www.pansoso.com/"""

    def search(self, keyword, offset=0, count=10) -> List[SearchItem]:
        """
        :keyword: string
        :rtype: list[{name}]
        """
        headers = {'Referer': '',
                   'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'}

        request = requests.get(url='http://www.pansoso.com/zh/%s' % (keyword), headers=headers)

        return [SearchItem(tr) for tr in BeautifulSoup(request.text, 'html.parser').select('#content .pss')]
