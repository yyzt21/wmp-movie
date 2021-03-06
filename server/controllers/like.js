const DB = require('../utils/db')

module.exports = {
  list: async ctx => {
    const movieId = +ctx.request.query.movieId;
    const user = ctx.state.$wxInfo.userinfo.openId;
    if (!isNaN(movieId)) {
      ctx.state.data = await DB.query('select comment_id as `commentId` from comment_like where movie_id=? and user=?', [movieId, user]);
    } else {
      ctx.state.code = -1;
    }
  },
  toggleLike: async ctx => {
    const commentId = +ctx.request.body.commentId;
    const movieId = +ctx.request.body.movieId;
    const user = ctx.state.$wxInfo.userinfo.openId;
    if (!isNaN(commentId)) {
      const list = await DB.query('select * from comment_like where comment_like.user = ? AND comment_like.comment_id = ?', [user, commentId]);

      if (!list.length) {
        // 点赞
        await DB.query('insert into comment_like(movie_id, comment_id, user) values (?, ?, ?)', [movieId, commentId, user]);
      } else {
        // 取消点赞
        await DB.query('delete from comment_like where user=? and comment_id=?', [user, commentId]);
      }
    } else {
      ctx.state.code = -1
    }
    ctx.state.data = {}

  },

  like: async ctx => {
    const commentId = +ctx.params.commentId;
    const user = ctx.state.$wxInfo.userinfo.openId;
    if (!isNaN(commentId)) {
      ctx.state.data = (await DB.query('select * from comment_like where comment_like.user = ? AND comment_like.comment_id = ?', [user, commentId]))[0] || null;
    } else {
      ctx.state.code = -1;
    }
  }
}