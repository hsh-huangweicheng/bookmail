class SearchItem:
    name: str
    description: str
    href: str

    def __init__(self, tr):
        a_element = tr.select_one('a')
        self.name = a_element.text
        self.href = a_element['href']
        self.description = tr.select_one('.des').text
