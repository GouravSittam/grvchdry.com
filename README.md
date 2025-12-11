<div align="center">
  
# 🌐 grvchdry.com

### Personal Portfolio & Blog

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0-f472b6?style=for-the-badge&logo=bun)](https://bun.sh/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## ✨ Features

- 🎨 **Modern Design** - Clean, minimal, and responsive UI
- 📝 **MDX Blog** - Write blog posts with MDX support
- 🌙 **Dark Mode** - Seamless dark/light theme switching
- 📱 **Fully Responsive** - Works perfectly on all devices
- ⚡ **Fast Performance** - Built with Next.js 14 and optimized for speed
- 🔍 **SEO Optimized** - Meta tags, OpenGraph, and sitemap included
- 🎯 **Command Palette** - Quick navigation with CMD+K
- 📊 **GitHub Contributions** - Display your GitHub activity
- 🚀 **Docker Ready** - Easy deployment with Docker

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with Phosphor Icons
- **Content:** MDX with syntax highlighting (sugar-high)

### Backend & Tools

- **Runtime:** Bun
- **Package Manager:** Bun
- **Code Quality:** Biome (formatting & linting)
- **Deployment:** Docker + Docker Compose
- **Fonts:** Geist Sans & Geist Mono

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- Node.js 18+ (for compatibility)

### Installation

```bash
# Clone the repository
git clone https://github.com/GouravSittam/grvchdry.com.git

# Navigate to the project directory
cd grvchdry.com

# Install dependencies
bun install

# Run the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📝 Available Scripts

```bash
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server
bun format       # Format code with Biome
bun lint         # Lint code with Biome
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# The app will be available at http://localhost:3001
```

## 📁 Project Structure

```
grvchdry.com/
├── app/                      # Next.js app directory
│   ├── blog/                # Blog pages
│   ├── components/          # React components
│   ├── contact/             # Contact page
│   ├── projects/            # Projects page
│   ├── resume/              # Resume page
│   └── utils/               # Utility functions
├── content/                 # MDX blog posts
├── public/                  # Static assets
│   ├── favicon/            # Favicon files
│   ├── fonts/              # Custom fonts
│   └── logos/              # Logo assets
├── docker-compose.yml       # Docker compose configuration
├── Dockerfile               # Docker configuration
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

## ✍️ Adding Blog Posts

Create a new `.mdx` file in the `content/` directory:

```mdx
---
title: "Your Post Title"
publishedAt: "2025-12-11"
summary: "A brief summary of your post"
coverImage: "https://your-cdn.com/image.png"
---

Your content here...
```

## 🎨 Customization

### Personal Information

Update your personal details in:

- `app/layout.tsx` - Site metadata
- `app/page.tsx` - Homepage content
- `app/resume/page.tsx` - Resume data
- `app/components/footer.tsx` - Social links

### Styling

- Modify `tailwind.config.ts` for theme customization
- Edit `app/global.css` for global styles

## 🌐 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/GouravSittam/grvchdry.com)

### Other Platforms

- **Railway:** Connect your GitHub repo
- **AWS:** Use the Docker image
- **Docker:** Use the included Dockerfile

## 📄 License

This project is open source. You are free to use this code for your own portfolio.

**Please remember to:**

- Remove all personal content (blog posts, images, etc.)
- Update personal information with your own
- Customize the design to make it your own

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

**Gourav Chaudhary**

- Website: [grvchdry.com](https://grvchdry.com)
- GitHub: [@GouravSittam](https://github.com/GouravSittam)
- LinkedIn: [gouravsittam](https://www.linkedin.com/in/gouravsittam/)
- Twitter: [@Gouravv_c](https://x.com/Gouravv_c)

---

<div align="center">

### ⭐ Star this repo if you find it useful!

Made with ❤️ by [Gourav Chaudhary](https://grvchdry.com)

</div>
