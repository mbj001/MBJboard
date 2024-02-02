const express = require("express");
const routers = express.Router();
const mysql = require("mysql2");


//###############################################################################//
// ############################# mysql 테이블 정보 ###############################//

// ############################# mbj_practice01 #################################//
// ##   count           integer AUTO_INCREMENT primary key 
// ##   title           varchar(200) 
// ##   content         varchar(200) 
// ##   name            varchar(30) not null 
// ##   id              varchar(30) not null 
// ##   create_date     date default (CURRENT_TIMESTAMP) 
// ##   visit_count     integer default 0
// ###############################################################################//

// ########################## mbj_practice01_login ###############################//
// ##   name            varchar(30) not null 
// ##   id              varchar(30) not null 
// ##   pw              varchar(50) not null 
// ##   birthday        date not null 
// ##   phone           varchar(30)
// ###############################################################################//


//################################################################################//
//################################# mysql 연동 ###################################//
const mysqlConnect = mysql.createConnection({
    user: "root",
    password: "Qudwns12!",
    database: "testdb",
    host: "localhost",
    port: 3306,
    charset: "utf8mb4"
});


//################################################################################//
//####################### 메인 페이지 (index.html) ################################//
let nowUser = {
    // id: "",
    // password: "",
    // name: "",
    // phone: "",

    // id: "mbj001",
    // password: "mbj0010911",
    // name: "민병준",
    // phone: "",

    id: "root",
    password: "1234",
    name: "관리자",
    phone: ""
}

//################################################################################//
//################################## variables ###################################//
// index.html
let root_check_login = 1;
let check_login = 1;        // 0: login fail, 1: login success
let nowPage = 1;            // 현재 page 번호
let allPage = -1;           // 전체 page 번호

// viewDetail.html
let viewDetail_count;
let viewDetail_id = "";

// edit.html
let edit_count;

// findPW.html
let findPW_userid = "";

// findPW2.html
let findPW2_userid = "";


//################################################################################//
//####################### 메인 페이지 (index.html) ################################//
// SELECT
routers.get("/", (req, res) => {
    console.log("***** routers.get('/')");
    // 페이지 번호 업데이트
    const reset_count_query_1 = "set sql_safe_updates=0;";
    const reset_count_query_2 = "set @reset_count = 0;";
    const reset_count_query_3 = "update mbj_practice01 set count=@reset_count:=@reset_count + 1;";
    mysqlConnect.query(reset_count_query_1, (error1, reset_count_result_1) => {
        if(error1) throw error1;
        mysqlConnect.query(reset_count_query_2, (error2, reset_count_result_2) => {
            if(error2) throw error2;
            mysqlConnect.query(reset_count_query_3, (error3, reset_count_result_3) => {
                if(error3) throw error3;
                
                // 전체 페이지 수 구하기
                const allPage_query = "select * from mbj_practice01";
                mysqlConnect.query(allPage_query, (error, allPage_result) => {
                    if(error) throw error;
                    allPage = Math.ceil(allPage_result.length / 20);
                    // console.log("페이지 수 : " + allPage);
                    // console.log("현재 페이지: " + nowPage);
                })


                const select_query = `select *, date_format(create_date, '%Y/%m/%d. %r') as wwdate from mbj_practice01 order by count desc limit ${0 + ((nowPage - 1) * 20)}, 20`;
                mysqlConnect.query(select_query, (error, select_content) => {
                    if(error) throw error;
                    res.render("index", {title: "자유게시판", select_content, userid: nowUser.id, nowPage, allPage});
                })
            })
        })
    })

    
})

routers.get("/index/:pageNum", (req, res) => {
    console.log("***** routers.get('/index/:pageNum')");

    // 1페이지에서 이전페이지, 마지막 페이지에서 다음페이지 클릭할 경우
    if(req.params.pageNum == 0 || req.params.pageNum == allPage + 1){
        res.redirect("/");
    }
    else{
        nowPage = Number(req.params.pageNum);
        res.redirect("/");
    }
})

// 로그아웃
routers.get("/logout", (req, res) => {
    console.log("routers.get('/logout')");
    nowUser.id = "";
    nowUser.name = "";
    nowUser.password = "";
    nowUser.phone = "";
    check_login = 0;

    if(nowUser.id === "root"){
        root_check_login = 0;
    }

    // res.writeHead(302, {Location: "/"});
    // res.end();

    res.send("<script>alert('로그아웃 되었습니다.'); window.location.replace('/');</script>");
})


//################################################################################//
//####################### 수정 페이지 (viewDetail.html) ###########################//
// UPDATE
routers.get("/viewDetail/:count", (req, res) => {
    console.log("***** routers.get('/viewDetail/:count')");
    const detail_query = `select * from mbj_practice01 where count=${req.params.count}`;
    mysqlConnect.query(detail_query, (error, detail_result) => {
        if(error) throw error;
        // 조회수 증가
        const add_visit_query = `update mbj_practice01 set visit_count=${(detail_result[0].visit_count + 1)} where count=${req.params.count}`;
        mysqlConnect.query(add_visit_query, (error, add_visit_result) => {
            if(error) throw error; 
            res.render("viewDetail", {title: "상세보기", detail_content: detail_result[0]});
        })
    })
})


//################################################################################//
//############################ 글 삭제 (delete)  ##################################//
// DELETE
routers.get("/delete/:count&:userid", (req, res) => {
    console.log("***** routers.get('/delete/:id')");
    // 로그인 된 id 와 작성자의 id 가 같을 때 만 삭제
    if(nowUser.id === req.params.userid || root_check_login == 1){
        const {count} = req.params;
        // const delete_query = `delete from mbj_practice01 where count=${req.params.count};`;
        const delete_query = `delete from mbj_practice01 where count=?;`;
        mysqlConnect.query(delete_query, [count], (error, delete_content) => {
            if(error) throw error;
            // res.send("<script>alert('삭제가 완료되었습니다.'); window.location.replace('/');</script>");
            res.send("<script>alert('삭제가 완료되었습니다.'); location.href='/'; </script>");
        })
    }
    else{
        console.log(req.params.count);
        res.send(`<script>alert('삭제 권한이 없습니다.'); location.href='/viewDetail/${req.params.count}';</script>`);        
    }
})  


//################################################################################//
//############################ 글 수정 (edit.html)  ###############################//
// EDIT
// routers.get("/edit/:count", (req, res) => {
//     console.log("***** routers.get('/edit/:count')");
//     edit_count = req.params.count;

//     res.redirect("/edit");
// })

// routers.get("/edit", (req, res) => {
//     console.log("***** routers.get('/edit')");

//     const edit_select_query = `select * from mbj_practice01 where count=${edit_count}`;
//     mysqlConnect.query(edit_select_query, (error, edit_select_result) => {
//         if(error) throw error;
//         res.render("edit", {title: "글 수정", edit_info: edit_select_result[0]});
//     })    
// })

routers.get("/edit/:count&:userid", (req, res) => {
    console.log("routers.get('/edit/:count&:userid')");

    if(nowUser.id === req.params.userid || root_check_login == 1){
        const {count} = req.params;
        const edit_select_query = `select * from mbj_practice01 where count=?`;
        mysqlConnect.query(edit_select_query, [count], (error, edit_select_result) => {
            if(error) throw error;
            console.log("권한 ok");
            res.render("edit", {title: "글 수정", edit_info: edit_select_result[0]});
        })
    }
    else{
        console.log("권한 no");
        res.send(`<script>alert('수정 권한이 없습니다.'); location.href='/viewDetail/${req.params.count}';</script>`);
    }
})

routers.post("/edit_form", (req, res) => {
    console.log("***** routers.post('/edit_form')");

    req.body.count = Number(req.body.count);
    const edit_update_query = `update mbj_practice01 set ? where ?`;
    mysqlConnect.query(edit_update_query,[{title: req.body.title, content: req.body.content}, {count: req.body.count}], (error, edit_update_result) => {
        if(error) throw error;
        console.log("mysql 완료");
        res.send(`<script>alert('수정이 완료되었습니다.'); location.href='/viewDetail/${req.body.count}';</script>`);
    }) 
})


//################################################################################//
//############################ 글쓰기 (write.html) ###############################//
//##### insert
routers.get("/write", (req, res) => {
    if(check_login == 0){
        res.send("<script>alert('로그인이 필요합니다.\\n로그인페이지로 이동합니다.'); window.location.replace('/login');</script>");
    }
    else{
        console.log("***** routers.get('/write')");
        res.render("write", {title: "게시글 작성", userid: nowUser.id, username: nowUser.name});
    }
})

// insert 쿼리
routers.get("/newWrite", (req, res) => {
    console.log("***** routers.get('/newWrite')");
    const insert_query = `insert into mbj_practice01(title, content, name, id) values (?, ?, ?, ?);`;
    mysqlConnect.query(insert_query,[req.query.title, req.query.content, req.query.name, req.query.id], (error, insert_content) => {
        if(error) throw error;
        res.redirect("/");
    })
})


//################################################################################//
//######################### 비밀번호 찾기 (findPW.html) ###########################//
routers.get("/findPw", (req, res) => {
    console.log("***** routers.get('/findPw')");
    res.render("findPW", {title: "NEVER"});
})

routers.post("/findPwForm", (req, res) => {
    console.log("***** routers.post('findPwForm')");
    
    const findPw_query = `select * from mbj_practice01_login where id="${req.body.userid}"`;
    mysqlConnect.query(findPw_query, (error, findPw_id_check) => {
        if(error) throw error;
        if(findPw_id_check.length == 0){
            res.send("<script>alert('아이디를 정확하게 입력해 주세요.'); window.location.replace('/findPW');</script>");
        }
        else {
            findPW_userid = req.body.userid;

            console.log('res.render("findPW2", {userid: req.body.userid})');
            res.render("findPW2", {findPW_userid});
        }
    })
})


//################################################################################//
//######################### 비밀번호 찾기2 (findPW2.html) #########################//
routers.get("/findPW2", (req, res) => {
    console.log("routers.get('/findPW2')");
    res.render("findPW2", {findPW_userid});
})

routers.post("/changePW", (req, res) => {
    console.log("***** routers.post('/findpw_input_phone')");
    console.log(req.body.findpw_id);
    const findPw_id_phone_query = `select * from mbj_practice01_login where name="${req.body.findpw_name}" and phone="${req.body.findpw_phone}" and id="${req.body.findpw_id}"`;
    mysqlConnect.query(findPw_id_phone_query, (error, findPw_id_phone_result) => {
        if(error) throw error;
        // select한 이름 정보가 없을 때
        if(findPw_id_phone_result.length == 0){
            res.send("<script>alert('정확한 이름과 번호를 입력해주세요.'); window.location.replace('/findPW2');</script>");
            // res.send("<script>alert('정확한 이름과 번호를 입력해주세요.'); window.location.reload();</script>");
        }
        else{
            console.log("이름, 전화번호 정보 찾음");
            findPW2_userid = findPw_id_phone_result[0].id;
            res.render("changePW", {title: "비밀번호 바꾸기", findPW2_userid});
        }
    })
})


//################################################################################//
//####################### 비밀번호 바꾸기 (changePW.html) #########################//
routers.get("/changePW", (req, res) => {
    console.log("routers.get('/changePW')");
    res.render("changePW", {findPW2_userid});
})

routers.post("/changePW_form", (req, res) => {
    console.log("routers.post('/changePW_form')");
    if(req.body.newpassword == req.body.newpassword_check){
        
        const changePW_query = `update mbj_practice01_login set pw="${req.body.newpassword}" where id="${req.body.userid}"`;
        mysqlConnect.query(changePW_query, (error, changePW_result) => {
            if(error) throw error;
            res.send("<script>alert('비밀번호 변경이 완료되었습니다. 바뀐 비밀번호로 로그인해 주세요.'); window.location.replace('/login');</script>")
        }) 
    }
    else{
        console.log("check FAIL");
        res.send("<script>alert('비밀번호가 동일하지 않습니다. 비밀번호를 확인해주세요.'); window.location.replace('/changePW');</script>");
    }
})


//################################################################################//
//################ 아이디 찾기 (findID.html, findIDResult.html) ###################//
routers.get("/findID", (req, res) => {
    console.log("routers.get('/findID')");
    res.render("findID");
})

routers.get("/findIDResult", (req, res) => {
    res.render("findIDResult");
})

routers.post("/findID_form", (req, res) => {
    console.log("routers.post('findID_form')");

    const findid_query = `select * from mbj_practice01_login where name="${req.body.findid_name}" and phone="${req.body.findid_phone}"`;
    mysqlConnect.query(findid_query, (error, findid_result) => {
        if (error) throw error;
        // 이름과 휴대전화에 대한 정보가 없을 때
        if(findid_result.length == 0 ){
            res.send("<script>alert('이름, 휴대전화에 대한 로그인 정보가 없습니다. 다시 입력해주세요.'); window.location.replace('/findID');</script>");
        }
        else{
            res.render("findIDResult", {userid: findid_result[0].id});
        }
    })
})




//################################################################################//
//####################### 로그인 정보 확인 (login.html) ###########################//
routers.get("/login", (req, res) => {
    console.log("***** routers.get('/login')");
    res.render("login", {title: "NEVER"});
})

routers.post("/checkId", (req, res) => {
    console.log("로그인 정보 확인중");

    const login_id_query = `select * from mbj_practice01_login where id="${req.body.userid}"`;
    const login_pw_query = `select * from mbj_practice01_login where pw="${req.body.userpass}"`;
    
    // id check
    mysqlConnect.query(login_id_query, (error, check_id_result) => {
        if(error) throw error;

        // selece id = NULL
        if(check_id_result.length == 0){
            console.log('로그인 실패: 아이디 틀림');
            res.render("login", {title: "NEVER", e_message: "아이디(로그인 전용 아이디)또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요."});
        }
        
        // selece id = not NULL
        else{
            // password check
            mysqlConnect.query(login_pw_query, (error, check_pw_result) => {
                if(error) throw error;
                if(check_pw_result.length == 0){
                    console.log("로그인 실패: 비밀번호 틀림");
                    res.render("login", {title: "NEVER", e_message: "아이디(로그인 전용 아이디)또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요."});
                }
                // 아이디는 유일하지만 비밀번호 같은 사람은 많다. 반복문으로 에러 체크
                for(let i=0; i<check_pw_result.length; i++){
                    if(check_pw_result[i].pw === check_id_result[0].pw){
                        console.log("로그인 성공");
                        check_login = 1;
                        nowUser.id =  check_id_result[0].id;
                        nowUser.password =  check_id_result[0].pw;
                        nowUser.name =  check_id_result[0].name;
                        nowUser.phone =  check_id_result[0].phone;
                        // 관리자 root 체크
                        if(nowUser.id === "root"){
                            console.log("LOGIN root!!!");
                            root_check_login = 1
                        }
                        res.redirect("/");
                        break;
                    }
                    // 반복문을 다 돌았는데 로그인 성공이 아닐경우 
                    // => 아이디는 맞지만 비밀번호는 다른사람의 것 => 로그인 실패
                    if(i == (check_pw_result.length - 1)){
                        console.log("로그인 실패: id, password 매칭오류");
                        res.render("login", {title: "NEVER", e_message: "아이디(로그인 전용 아이디)또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요."});
                    }
                }
            })
        }
        
    })
})


//################################################################################//
//######################### 회원가입 (signup.html)  ###############################//
routers.get("/signup", (req, res) => {
    console.log("회원가입 페이지 이동");
    res.render("signup", {title: "회원 가입"});
})

routers.post("/newSignup", (req, res) => {
    console.log("***** routers.post('/newSignup')");

    const signup_query = `insert into mbj_practice01_login(name, id, pw, birthday, phone) values ("${req.body.username}", "${req.body.userid}", "${req.body.userpw}", "${req.body.userbirth}", "${req.body.userphone}")`;
    mysqlConnect.query(signup_query, (error, signup_result) => {
        if(error) throw error;
        console.log("회원가입 완료");
        res.send("<script>alert('회원가입 성공!!! 가입하신 아이디, 비밀번호로 로그인해 주세요.'); window.location.replace('/');</script>");
        // res.redirect("/");
    })
})


//################################################################################//
//######################### 내정보 (userInfo.html) ################################//
routers.get("/userInfo", (req, res) => {
    res.render("userInfo", {title: "내 정보"});
})


//################################################################################//
//################################### 새로고침 ####################################//
// routers.get("/reset_count", (req, res) => {
//     console.log("routers.get('/reset_count')");

//     const reset_count_query_1 = "set sql_safe_updates=0;";
//     const reset_count_query_2 = "set @reset_count = 0;";
//     const reset_count_query_3 = "update mbj_practice01 set count=@reset_count:=@reset_count + 1;";
//     mysqlConnect.query(reset_count_query_1, (error1, reset_count_result_1) => {
//         if(error1) throw error1;
//         mysqlConnect.query(reset_count_query_2, (error2, reset_count_result_2) => {
//             if(error2) throw error2
//             mysqlConnect.query(reset_count_query_3, (error3, reset_count_result_3) => {
//                 if(error3) throw error3
//                 console.log("리셋 성공");
//                 res.redirect("/");
//             })
//         })
//     })
// })


//################################################################################//
//################################### Client ####################################//
routers.get("/client/get", (req, res) => {
    console.log("routers.get('/client/get')");

    const test_query = "select * from mbj_practice01";
    mysqlConnect.query(test_query, (err, test_result) => {
        if(err) throw err;
        res.send(test_result);
    })
})


//##################################### END ######################################//
//################################################################################//
//################################################################################//
module.exports = routers;














