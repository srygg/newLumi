var apis = require('../apis');

var Posts = {

  createPost: function(id, params){
    return apis.asyncFetch(apis.BASE_URL + '/posts/createPost/' + id, Object.assign({
      method: 'POST'
    }, params));
  },

  getPosts: function(params){
    return apis.asyncFetch(apis.BASE_URL + '/posts/getPosts', Object.assign({
      method: 'GET'
    }, params));
  },

}

module.exports = Posts;