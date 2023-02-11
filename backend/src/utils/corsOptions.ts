// import ALLOWED_ORIGINS from './allowedOrigins'

const corsOptions = {
  // origin: (origin: any, callback: any) => {
  //   if (!origin || ALLOWED_ORIGINS.indexOf(origin) !== -1) {
  //     callback(null, true)
  //   } else {
  //     callback(new Error('Not allowed by CORS'))
  //   }
  // },
  // exposedHeaders: ['set-cookie'],
  // credentials: true,
  origin:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://teuxdeux-clone.up.railway.app',
  credentials: true,
}

export default corsOptions
