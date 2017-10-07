import abc


class SearcherBase(abc.ABC):
    """网站搜索基类"""

    @abc.abstractmethod
    def search(self, keyword, offset=0, count=10):
        """
        根据输入的参数搜索
        """
