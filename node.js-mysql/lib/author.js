var db = require('./db');
var template = require('./template');
var qs = require('querystring');
var url = require('url');

exports.home = function (request, response){
    db.query('select * from topic', function (err,topics){
        db.query('select * from author', function (err2,authors){
            var title = 'author';
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `
                ${template.authorTable(authors)}
                <style>
                    table{
                        border-collapse : collapase;
                    }
                    td{
                        border : 1px solid black;
                    }
                </style>
                <form action="/author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
                ``
            );
            response.writeHead(200);
            response.end(html);
        })
    })
}

exports.create_process = function (request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query('insert into author (name, profile) value (?, ?)', 
          [post.name, post.profile], function (err, result) {
            if(err){
              throw err;
            }
            response.writeHead(302, {Location: `/author`});
            response.end();
          })
      });
}

exports.update = function (request, response){
    db.query('select * from topic', function (err,topics){
        db.query('select * from author', function (err2,authors){
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query('select * from author where id=?', [queryData.id], function (err3, author){
                var title = 'author';
                var list = template.list(topics);
                var html = template.HTML(title, list,
                    `
                    ${template.authorTable(authors)}
                    <style>
                        table{
                            border-collapse : collapase;
                        }
                        td{
                            border : 1px solid black;
                        }
                    </style>
                    <form action="/author/update_process" method="post">
                        <p>
                            <input type="hidden" name="id" value="${queryData.id}">
                        </p>
                        <p>
                            <input type="text" name="name" value="${author[0].name}" placeholder="name">
                        </p>
                        <p>
                            <textarea name="profile">${author[0].profile}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
                    ``
                );
                response.writeHead(200);
                response.end(html);
            })
        })
    })
}

exports.update_process = function (request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query('update author set name=?, profile=? where id=?', 
          [post.name, post.profile, post.id], function (err, result) {
            if(err){
              throw err;
            }
            response.writeHead(302, {Location: `/author`});
            response.end();
          })
      });
}

exports.delete_process = function (request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`delete from topic where author_id=?`, [post.id], function (err1, result1){
            if(err1){
                throw err1;
            }  
            db.query('delete from author where id=?', [post.id], function (err2, result2) {
                if(err2){
                  throw err2;
                }
                response.writeHead(302, {Location: `/author`});
                response.end();
              })
          })
      });
}