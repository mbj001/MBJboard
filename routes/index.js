const express = require('express');
const upload = require("../upload/upload");
const fs = require("fs-extra");

const router = express.Router();
//mysql 연결
const mysqlConnObj = require('../config/mysql');
const conn = mysqlConnObj.init();
mysqlConnObj.open(conn);  //연결 출력

//기본 주소 설정
router.get('/', (req, res) => {
    console.log("router.get('/')");
    var page = 1;
    let ten_per_page = [];
    let total_pageCount; 
    let totalPage;

    if(req.query.page){
        page = req.query.page;
    }
    if(req.query.page < 0) {
        page = 1;
    }

    let pageCount = Math.floor((page-1)/10);
    const maxList = 10;
    const Perpage = 10;


    let offset = (page - 1) * maxList;

    let sql = "select count(*) as maxcount from ndboard";
    conn.query(sql, (err, row, fileds) => {
        if(err){
            console.error(err);
        }
        else{
            maxcount = row[0].maxcount;
            totalPage = Math.ceil(maxcount / Perpage);
            total_pageCount = Math.floor((totalPage -1 )/10);
            
            if((totalPage - req.query.page) < 10 && pageCount == total_pageCount){
                for(let i=1; i<=totalPage - (Math.floor(totalPage / 10) * 10); i++){
                    ten_per_page.push(i);
                }
            }
            else{
                for(let i=1; i<=10; i++){
                    ten_per_page.push(i);
                }
            }
        }
    })

    sql = `select * from ndboard order by orNum desc, grNum asc limit ${offset}, ${maxList}`;
    conn.query(sql, (err, row, fields) => {
        if(err){
            console.log(err);
        }
        else {
            let odate;
            for(let rs of row) { 
                rs.grLayer *= 30;
                odate = new Date(rs.wdate);
                rs.wdate = `${odate.getFullYear()}-${odate.getMonth()+1}-${odate.getDate()}`;
            } 
            res.render('index', { title: "게시판 목록", row, pageCount, pageNum: ten_per_page, totalPage, page});
        }
    })
    
});

router.get("/write", (req, res)=>{
    res.render("write", { title: "게시판 글쓰기"});
});

router.post("/write", (req, res)=>{
    console.log("router.post('/write')");
    console.log(req.body);
    const rs = req.body;
    req.body.content = req.body.content.replaceAll("tmp", "");

    // 그림이 있을 때
    if(req.body.img_move){
        // 그림이 2개 이상일때
        if(typeof(req.body.img_move) == "object"){
            for(let i=0; i<req.body.img_move.length; i++){
                const after_content = req.body.img_move[i].replace("tmp", "");
                fs.moveSync("./data/images/" + req.body.img_move[i], "./data/images/" + after_content);
            }
        }
        // 그림이 하나일때
        else{
            const after_content = req.body.img_move.replace("tmp", "");
            fs.moveSync("./data/images/" + req.body.img_move, "./data/images/" + after_content);
        }
    }

    let sql = "insert into ndboard (orNum, grNum, writer, userid, userpass, title, contents) values (?,?,?,?,?,?,?)";
    conn.query(sql,[0, 1, rs.writer, 'guest', rs.pass, rs.title, rs.content], (err, res, fields)=> {
        if(err) {
            console.log(err);
        }else{
            //  console.log(res.insertId);
            sql = "update ndboard set ? where num ="+res.insertId;
            conn.query(sql, { orNum: res.insertId },
            (err, res,fields)=>{
                if(err) 
                console.log(err);
                else{
                    console.log('UPDATE COMPLETE!!!');
                }
            });
        }
    });

    let files = fs.readdirSync("./data/images");
    for(let i=0; i<files.length; i++){
        if(files[i].search("tmp") !== -1){
            fs.removeSync("./data/images/" + files[i]);
        }
    }
    res.redirect('/');
});

router.post("/write/imginsert", upload.single("img"), async (req, res, next) => {
    console.log("router.post('/write/imginsert')");
    try{
        let imgurl;
        if(req.file !== undefined){
            imgurl = req.file.filename;
            // console.log(imgurl);
            res.json(imgurl);
        }
    }
    catch(err){
        console.error(err);
    }
})

router.get("/rewrite/:num", (req, res) => {
    let {num} = req.params;
    console.log("***** router.get('/rewirte')");
    const sql = `select * from ndboard where num=?`;
    conn.query(sql, num, (err, row, fields) => {
        if(err){
            console.error(err);
        }
        else{
            res.render("rewrite", {title: "게시판 답글 달기", rs: row[0]})
        }
    })
})

router.post("/rewrite", (req, res) => {
    console.log("***** router.post('/rewirte')");
    const {ornum, grnum, grlayer, writer, pass, title, content} = req.body;
    const userid = "guest";         // 추후에 회원제 만들면서 수정 예정
    
    //목록의 grNum 이 받은 grNum 보다 클 경우 하나씩 업데이트
    let sql = "update ndboard set grNum = grNum + 1 where orNum = ? and grNum > ?";
    conn.query(sql, [ornum, grnum]);

    sql = "insert into ndboard (orNum, grNum, grLayer, writer, userid, userpass, title, contents) values (?, ?, ?, ?, ?, ?, ?, ?)";
    conn.query(sql, [Number(ornum), Number(grnum)+1, Number(grlayer)+1, writer, "geust", pass, title, content], (error, row, fields) => {
        res.redirect('/');
    });
})

router.get("/search", (req, res) => {
    console.log("***** router.get('/search')");

    var page = 1;
    let ten_per_page = [];
    let total_pageCount; 
    let totalPage;

    if(req.query.page){
        page = req.query.page;
    }
    if(req.query.page < 0) {
        page = 1;
    }

    let pageCount = Math.floor((page-1)/10);
    const maxList = 10;
    const Perpage = 10;

    let offset = (page - 1) * maxList;
    let search_query = `select count(*) as maxcount from ndboard where title like "%${req.query.content}%"`
    conn.query(search_query, (err, row, fields) => {
        if(err){
            console.error(err)
        }
        else{
            maxcount = row[0].maxcount;
            totalPage = Math.ceil(maxcount / Perpage);
            total_pageCount = Math.floor((totalPage -1 )/10);
            
            if((totalPage - page) < 10 && pageCount == total_pageCount){
                for(let i=1; i<=totalPage - (Math.floor(totalPage / 10) * 10); i++){
                    ten_per_page.push(i);
                }
            }
            else{
                for(let i=1; i<=10; i++){
                    ten_per_page.push(i);
                }
            }
        }
    })

    search_query = `select * from ndboard where title like "%${req.query.content}%" order by orNum desc, grNum asc limit ${offset}, ${maxList}`
    conn.query(search_query, (err, row, fields) => {
        if(err){
            console.error(err)
        }
        else{
            let odate;
            for(let rs of row) { 
                rs.grLayer *= 30;
                odate = new Date(rs.wdate);
                rs.wdate = `${odate.getFullYear()}-${odate.getMonth()+1}-${odate.getDate()}`;
            } 

            res.render('index', { title: "게시판 목록", row, pageCount, pageNum: ten_per_page, totalPage, page, contents: req.query.content});

        }
    })
})

router.post("/search", (req, res) => {
    console.log("***** router.post('/search')");

    var page = 1;
    let ten_per_page = [];
    let total_pageCount; 
    let totalPage;

    if(req.query.page){
        page = req.query.page;
    }
    if(req.query.page < 0) {
        page = 1;
    }

    let pageCount = Math.floor((page-1)/10);
    const maxList = 10;
    const Perpage = 10;

    let offset = (page - 1) * maxList;
    let search_query = `select count(*) as maxcount from ndboard where title like "%${req.body.search}%"`
    conn.query(search_query, (err, row, fields) => {
        if(err){
            console.error(err)
        }
        else{
            maxcount = row[0].maxcount;
            totalPage = Math.ceil(maxcount / Perpage);
            total_pageCount = Math.floor((totalPage -1 )/10);
            
            if((totalPage - page) < 10 && pageCount == total_pageCount){
                for(let i=1; i<=totalPage - (Math.floor(totalPage / 10) * 10); i++){
                    ten_per_page.push(i);
                }
            }
            else{
                for(let i=1; i<=10; i++){
                    ten_per_page.push(i);
                }
            }
        }
    })

    search_query = `select * from ndboard where title like "%${req.body.search}%" order by orNum desc, grNum asc limit ${offset}, ${maxList}`
    conn.query(search_query, (err, row, fields) => {
        if(err){
            console.error(err)
        }
        else{
            let odate;
            for(let rs of row) { 
                rs.grLayer *= 30;
                odate = new Date(rs.wdate);
                rs.wdate = `${odate.getFullYear()}-${odate.getMonth()+1}-${odate.getDate()}`;
            } 

            res.render('index', { title: "게시판 목록", row, pageCount, pageNum: ten_per_page, totalPage, page, contents: req.body.search});
        }
    })

})


router.get("/view/:num", (req, res)=>{
    console.log("***** router.get('/view/:num')");
   const { num } = req.params;
   const sql = "select * from ndboard where num = ?";
   conn.query( sql, [num], (err, row, fields)=> {
     if(err) {
        console.log(err);
     }else{
        const comment_query = "select * from ndboard_comment where ndboard_num = ?";
        conn.query(comment_query, [num], (err, comment_result, fields) => {
            if(err){
                console.error(err);
            }
            else{
                res.render("view", { title: "게시판 내용보기", row, comment_result});
            }
        })
     }
   });
});

router.post("/view/comment", (req, res) => {
    console.log("***** router.post('/view/comment')");
    const comment_add_query = "insert into ndboard_comment (ndboard_num, username, userpass, userid, comment) values (?, ?, ?, ?, ?)";
    conn.query(comment_add_query, [req.body.num, req.body.username, req.body.userpass, "guest", req.body.content], (err, comment_add_result, fields) => {
        res.redirect("/view/" + req.body.num);
    })
})

router.get("/edit/:num", (req,res)=>{
    const { num } = req.params;
    const sql = "select * from ndboard where num = ?";
    conn.query( sql, [num], (err, row, fields)=> {
        if(err) {
            console.log(err);
        }else{
            res.render("edit", { title: "내용 수정", row});
        }
    });
});

router.post("/edit/:num", (req, res)=>{
    const { num } = req.params;
    const rs = req.body;
    const sql = "update ndboard set ? where num = ?";
    conn.query(sql,[{ 
            title: rs.title,
            contents: rs.content  
        }, num],
        (err, res,fields)=>{
           if(err) 
             console.log(err);
           else{
               console.log('업데이트 성공');
           }
        });
        res.redirect('/view/'+num);
});

router.post("/pwdlogin", (req, res2) => {
    console.log("***** router.post('/pwdlogin')");
    const { num, pass, title, content } = req.body;
    // console.log(req.body);
    let sql = "select * from ndboard where num = ? and userpass = ?";
    conn.query( sql, [num, pass], (err, row, fields)=> {
        if(err) {
            console.log(err);
        }else{
            if(row.length > 0) {
            sql = "update ndboard set ? where num = ?";
            conn.query(sql,[{ 
                    title: title,
                    contents: content  
            }, num],
            (err, res, fields)=>{
                if(err) 
                    console.log(err);
                else{
                    // return res2.send("1");
                    return res2.json(1);
                }
            });
            }else{
                // return res2.send("0");
                return res2.json(0);
            }
        }
    });
})

router.post("/del", (req, res) => {
    console.log("router.post('/del')");

    const {delpass, delnum} = req.body;

    const sql = `select count(*) as ct from ndboard where num=? and userpass=?`;
    conn.query(sql, [delnum, delpass], (err, row, fields) => {
        if(err){
            console.error(err);
            res.send("0");
        }
        else{
            console.log(row);
            if(row[0].ct > 0){
                //삭제
                const del_sql = `delete from ndboard where num=? and userpass=?`;
                conn.query(del_sql, [delnum, delpass], (err, del_result, feilds) => {
                    if(err){
                        console.error(err);
                    }
                    else{
                        res.send("1");
                    }
                })
            }
            else{
                res.send("0");
            }
        }
    })
})

module.exports = router;