# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout 

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRouter
- POST /request/send/:status/:userId

- POST /request/review/:status/:userId

## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed

Status: interested, ignored, accepted, rejected