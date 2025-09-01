# FridgeChef 🍳

A smart recipe generator that analyzes your fridge contents and suggests personalized recipes based on available ingredients and dietary preferences.

## Features

- **Smart Image Analysis**: Upload photos of your fridge and let AI detect available ingredients
- **Dietary Preferences**: Support for vegetarian, vegan, gluten-free, and dairy-free options
- **Recipe Generation**: Get 3-5 personalized recipes with detailed instructions
- **Save Favorites**: Keep track of your favorite recipes with local storage
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Mock Mode**: Try the app without API keys using realistic mock data

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with custom design system
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4o-mini (Vision & Chat)
- **Storage**: Browser localStorage
- **Deployment**: Ready for Vercel/Netlify

## Quick Start

### Prerequisites

- Node.js 18+ (recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fridgechef-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env .env.local
   ```
   
   Edit `.env.local` and configure:
   ```bash
   # For demo/workshop mode (default)
   VITE_MOCK=true
   
   # For production with OpenAI (optional)
   VITE_MOCK=false
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Usage

### Demo Mode (Default)
- The app works out of the box with realistic mock data
- Perfect for testing, workshops, and demonstrations
- No API keys required

### Production Mode
1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Set `VITE_MOCK=false` in your `.env.local`
3. Add your API key: `VITE_OPENAI_API_KEY=your_key_here`
4. Restart the development server

## Project Structure

```
src/
├── components/           # React components
│   ├── UploadBox.tsx    # Image upload with drag & drop
│   ├── DietaryPrefs.tsx # Dietary preference selector
│   ├── RecipeCard.tsx   # Individual recipe display
│   └── SavedRecipesDrawer.tsx # Saved recipes sidebar
├── lib/                 # Utility libraries
│   ├── ai.ts           # OpenAI integration & mock data
│   └── storage.ts      # localStorage utilities
├── App.tsx             # Main application component
├── main.tsx            # React entry point
└── index.css           # Global styles & TailwindCSS
```

## Key Components

### UploadBox
- Drag & drop image upload
- File validation (type, size)
- Loading states with accessibility
- Click-to-upload fallback

### DietaryPrefs
- Toggle-based preference selection
- Visual indicators for active preferences
- Keyboard navigation support
- Clear labeling for accessibility

### RecipeCard
- Expandable recipe details
- Save/unsave functionality
- Difficulty and time indicators
- Dietary restriction badges

### SavedRecipesDrawer
- Slide-out drawer for saved recipes
- Remove recipes functionality
- Recipe summary view
- Empty state handling

## API Integration

### OpenAI GPT-4o-mini API
- **Vision**: Analyzes uploaded fridge images and extracts ingredient lists
- **Chat**: Generates personalized recipes based on ingredients and dietary preferences
- **Error Handling**: Graceful fallback to mock data on API errors
- **Validation**: Input validation and response parsing with proper error messages

## Styling Guide

### Colors
- **Primary**: `#4CAF50` (Fresh Green)
- **Secondary**: `#FF9800` (Warm Orange)  
- **Background**: `#FAFAFA` (Light Gray)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Component Classes
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.card` - Recipe and content cards

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload `dist/` folder to Netlify
3. Set environment variables in site settings

### Environment Variables for Production
```bash
VITE_MOCK=false
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding Features
1. Create components in `src/components/`
2. Add utilities in `src/lib/`
3. Update types in existing files
4. Test in both mock and production modes

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and live regions
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant
- **Responsive Design**: Mobile-first approach

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test in both mock and production modes
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.

## Support

For questions or issues:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Ensure OpenAI API key has sufficient credits
4. Try mock mode to isolate API issues

---

Built with ❤️ for better cooking experiences
