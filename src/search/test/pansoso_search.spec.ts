import { PansosoSearch } from './../pansoso_search';
import { Search, SearchResult } from './../search';
import { expect } from 'chai';
import 'mocha';

describe('PansosoSearch', () => {

    let search: Search;

    beforeEach(() => {
        search = new PansosoSearch();
    });

    it('search', () => {
        return search.search({
            keyword: '解忧杂货店'
        }).then((result: SearchResult) => {
            expect(1).is.null;
        });
    });

});