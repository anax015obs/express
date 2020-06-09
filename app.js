var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var flash = require("flash");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// 로깅
app.use(logger("dev"));
// express 기본 정적 리소스 디렉토리에서 정적 리소스를 가져옵니다.
// 정적 리소스 경로가 존재하지 않는다면 static은 next()하지 않으므로, 로거 다음으로 경유하도록 순서를 설정할 경우, 빠른 차단을 구현할 수 있습니다.
app.use(express.static(path.join(__dirname, "public")));
// 응답 본문을 json으로 변환
app.use(express.json());
// 응답 본문을 utf-8로 인코딩
app.use(express.urlencoded({ extended: false }));
// 쿠키를 활성화합니다. 매개 변수로 secret code를 전달하여 서버가 요청 헤더에서 쿠키를 가져올 시, 해당 서버에서 발급한 쿠키인지 판별하는 용도로 사용합니다.
app.use(cookieParser(`secretCode`));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    // cookieParser()에 매개 변수로 전달한 secret code를 사용하여 쿠키를 가져와야 하므로, secret 프로퍼티에 해당 매개변수로 전달한 secret code를 입력합니다.
    secret: `secretCode`,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
