import ALLOWED_ORIGINS from './allowedOrigins'

const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin || ALLOWED_ORIGINS.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  exposedHeaders: ['set-cookie'],
  credentials: true,
}

export default corsOptions
