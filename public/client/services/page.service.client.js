(function () {
    angular
        .module("WebAppMaker")
        .factory("PageService", pageService);

    function pageService() {
        var pages = [
                { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
                { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
                { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
            ];

        var api ={
            "createPage" : createPage,
            "findPageByWebsiteId" : findPageByWebsiteId,
            "findPageById" : findPageById,
            "updatePage" : updatePage,
            "deletePage" : deletePage,
        };
        return api;

        function createPage(websiteId, page) {
            page.websiteId = websiteId;
            page._id = (new Date()).getTime();
            pages.push(page);
        }

        function findPageByWebsiteId(websiteId) {
            var pagelist = [];
            for(var p in pages){
                if(pages[p].websiteId == websiteId){
                    pagelist.push(pages[p]);
                }
            }
            return angular.copy(pagelist);
        }

        function findPageById(pageId) {
            for(var p in pages){
                var page = pages[p];
                if(page._id == pageId){
                    return angular.copy(page);
                }
            }
            return null;
        }

        function updatePage(pageId, page) {
            for(var p in pages){
                if(pages[p]._id == pageId){
                    pages[p].name = page.name;
                    pages[p].description = page.description;
                    return pages[p];
                }
            }
            return null;
        }

        function deletePage(pageId) {
            for(var p in pages){
                if(pages[p]._id == pageId){
                    pages.splice(p, 1);
                }
            }
        }
    }

})();