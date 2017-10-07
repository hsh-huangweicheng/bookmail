from src.searcher.pansoso_searcher import PansosoSearcher


class TestPansosoSearcher:
    def test_search(self):
        """
        测试Pansoso的搜索结果
        """
        searcher = PansosoSearcher();
        items = searcher.search("python")
        
        assert len(items) == 10
        assert items[0].name.find('python');
