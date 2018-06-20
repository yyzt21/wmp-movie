const DB = require('../utils/db')

module.exports = {
  /**
   * 获取指定movie id的所有评论
   */
  list: async ctx => {
    // const $wxInfo = ctx.state.$wxInfo;
    // const user = $wxInfo ? $wxInfo.userinfo.openId : ''
    const movieId = +ctx.request.query.movieId;
    let comments = []
    if (!isNaN(movieId)) {
      comments = await DB.query(
        'select id, movie_comment.movie_id as `movieId`, comment_type as `commentType`, avatar, content, rating, movie_comment.user, username, movie_comment.create_time as `createTime`, count(comment_like.user) as `likeCount` ' 
        // + '(select count(*) from comment_like where comment_like.user=? and comment_like.comment_id=movie_comment.id) as `like`, '
        // + '(select count(*) from comment_fave where comment_fave.user=? and comment_fave.comment_id=movie_comment.id) as `fave` '
        + 'from movie_comment left join comment_like on movie_comment.id = comment_like.comment_id left join comment_fave on movie_comment.id = comment_fave.comment_id where movie_comment.movie_id = ? group by movie_comment.id order by movie_comment.create_time desc', [movieId]);
    }
    ctx.state.data = comments;

  },

  /**
   * 获取指定comment id的评论详情
   */
  detail: async ctx => {
    const commentId = +ctx.params.id;
    let comment = {};
    if (!isNaN(commentId)) {
      movie = (await DB.query('select * from movie_comment where movie_comment.id = ?', [commentId]))[0] || null;
    }
    ctx.state.data = comment;
  },

  /**
   * 添加评论
   */
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId;
    let username = ctx.state.$wxInfo.userinfo.nickName;
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl;
    let content = ctx.request.body.content;
    let movieId = +ctx.request.body.movieId;
    let rating = +ctx.request.body.rating;
    let commentType = +ctx.request.body.commentType;
    
    
    if (!isNaN(movieId)) {
      await DB.query('INSERT INTO movie_comment(movie_id, comment_type, rating, user, username, avatar, content) VALUES (?, ?, ?, ?, ?, ?, ?)', [movieId, commentType, rating, user, username, avatar, content]);
    }

    ctx.state.data = {}
  },
}