# Gourav Chaudhary - Portfolio

A minimalist, high-performance portfolio website built with Next.js, Tailwind CSS, and TypeScript.

## 🚀 Features

- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **MDX Blog** support with syntax highlighting
- **GitHub Calendar** integration
- **Command Menu** (Cmd+K) interface
- **SEO Optimized** with metadata and Open Graph support
- **PWA Ready**
- **Dark Mode** support

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Font**: [Geist](https://vercel.com/font)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)
- **Linting**: [Biome](https://biomejs.dev/)
- **Package Manager**: Bun / pnpm / npm

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or pnpm/npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/GouravSittam/portfolio.git
   cd portfolio
   ```

2. Install dependencies:

   ```bash
   bun install
   # or
   pnpm install
   ```

3. Run the development server:

   ```bash
   bun run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Configuration

You can customize the portfolio by updating the configuration file at `app/config/config.ts`. This file controls:

- Profile information
- Social links
- Navigation menu items
- Company/Work experience URLs

## ☁️ Deployment

For a production deployment on AWS EC2, follow the step-by-step guide in `DEPLOY_EC2.md`.

### One-command deploy on EC2

Use the deployment helper script:

```bash
bash scripts/deploy-ec2.sh
```

Optional environment variables:

```bash
APP_DIR=/home/ubuntu/app BRANCH=main bash scripts/deploy-ec2.sh
```

### Auto-deploy with GitHub Actions

This repo includes a workflow at `.github/workflows/deploy-ec2.yml` that deploys on every push to `main` (and can also be run manually).

Add these GitHub repository secrets before enabling it:

- `EC2_HOST` (example: 13.52.10.1)
- `EC2_USER` (example: ubuntu)
- `EC2_SSH_KEY` (private SSH key content)
- `EC2_PORT` (optional, defaults to 22)
- `EC2_APP_DIR` (optional, default `/home/ubuntu/app`)
- `EC2_BRANCH` (optional, default `main`)

## 📝 Blog

Blog posts are located in the `content/` directory as `.mdx` files. Simply add a new MDX file to publish a new post.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source.
