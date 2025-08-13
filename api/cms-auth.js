// Simple password-based authentication for CMS
// Set your password in Vercel environment variables: CMS_PASSWORD

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get password from environment variable (set in Vercel dashboard)
  const CMS_PASSWORD = process.env.CMS_PASSWORD || 'admin123'; // Default for local dev

  if (req.method === 'POST') {
    const { password } = req.body || {};

    if (password === CMS_PASSWORD) {
      // Generate a simple token (in production, use proper JWT)
      const token = Buffer.from(`authenticated:${Date.now()}`).toString('base64');
      
      return res.status(200).json({
        success: true,
        token: token,
        user: {
          email: 'admin@angelsfloor.bj',
          name: 'Admin'
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }
  }

  // GET request - verify token
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = Buffer.from(token, 'base64').toString();
        if (decoded.startsWith('authenticated:')) {
          return res.status(200).json({
            success: true,
            user: {
              email: 'admin@angelsfloor.bj',
              name: 'Admin'
            }
          });
        }
      } catch (e) {
        // Invalid token
      }
    }
    
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}