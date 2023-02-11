// import ALLOWED_ORIGINS from './allowedOrigins'

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://teuxdeux-clone.up.railway.app',
  credentials: true,
}

export default corsOptions
