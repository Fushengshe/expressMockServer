let express = require('express')
let path = require('path')
let cors = require('cors')
let favicon = require('serve-favicon')
let logger = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')

let index = require('./routes/index')
let users = require('./routes/users')

let app = express()
// 解析req.body
let multer = require('multer')
let upload = multer() // 解析 multipart/form-data 类型数据
app.use(bodyParser.json()) // 解析 application/json 类型数据
app.use(bodyParser.urlencoded({extended: true})) // 解析 application/x-www-form-urlencoded 类型数据

/*--------------- add something start ----------------------------*/
// routes setup
let apiRoutes = express.Router()
apiRoutes.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  res.header('Allow', 'GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH')
  res.header('Content-Type', 'application/json;charset=utf-8')
  if (req.type === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})
apiRoutes.post('/login', function (req, res) {
  res.status(200).json(
    {
      'code': 0,
      'data': {
        'user': {
          'userId': 21,
          'mobile': '17732900750',
          'sex': 'female'
        },
        'token': '9b6020276b244645a9a0adb130a694fd'
      }
    }
  )
})
apiRoutes.post('/register', function (req, res) {
  console.log(req.body)
  let ok = req.body.mobile && req.body.password
  if (ok) {
    res.status(200).json({
      'code': 0,
      'data': {
        'msg': 'login successful',
        'mobile': req.body.mobile || '15033332222',
        'password': req.body.password || '123456'
      }
    })
  } else {
    res.status(200).json({
      'code': 10001,
      'data': {
        'msg': 'login error,please check your data'
      }
    })
  }
})
apiRoutes.post('/forget', function (req, res) {
  console.log(req.body)
  let ok = req.body.mobile && req.body.newpassword
  if (ok) {
    res.status(200).json({
      'code': 0,
      'data': {
        'msg': 'reset password successful',
        'mobile': req.body.mobile,
        'newPassword': req.body.newpassword
      }
    })
  } else {
    res.status(200).json({
      'code': 10001,
      'data': {
        'msg': 'reset password error,please check your data'
      }
    })
  }
})
apiRoutes.post('/password', function (req, res) {
  console.log(req.body)
  let ok = req.body.mobile && req.body.oldpassword && req.body.newpassword
  if (ok) {
    res.status(200).json({
      'code': 0,
      'data': {
        'msg': 'change password successful',
        'mobile': req.body.mobile,
        'oldPassword': req.body.oldpassword,
        'newPassword': req.body.newpassword
      }
    })
  } else {
    res.status(200).json({
      'code': 10001,
      'data': {
        'msg': 'change password error,please check your data'
      }
    })
  }
})
apiRoutes.post('/changeMobile', function (req, res, next) {
  res.json({
    'code': 0,
    'data': {
      'successful': 'your need set the oldMobile newMobile password and code in the request body'
    }
  })
})
apiRoutes.post('/change', function (req, res, next) {
  res.json({
    'code': 0,
    'data': {
      'mobile': '15433613546',
      'male': 1
    }
  })
})
apiRoutes.post('/verify', function (req, res, next) {
  res.json(
    {
      'code': 0,
      'data': {
        'code': '1234'
      }
    }
  )
})
// strings type
apiRoutes.get('/book', function (req, res, next) {
  res.send('book')
})
// string model
apiRoutes.get('/usr/*man', function (req, res, next) {
  res.send('usr')
})
// reg type
apiRoutes.get(/animals?$/, function (req, res, next) {
  res.send('animals')
})
// args
apiRoutes.get('/employee/:uid/:age', function (req, res, next) {
  res.json(req.params)
})
// 500 middleware
apiRoutes.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({
    'code': 500
  })
})
// 404 middleware
apiRoutes.use(function (req, res) {
  res.status(404).json(
    {'code': 404}
  )
})

app.use('/api', apiRoutes)
/*--------------- add something end ----------------------------*/
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use('/', index)
app.use('/users', users)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
