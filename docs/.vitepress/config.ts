import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Auralis AI',
  description: 'Environmental Intelligence Platform documentation',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' }
    ],

    sidebar: {
      '/guide/': [
        { text: 'Introduction', link: '/guide/' },
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Configuration', link: '/guide/configuration' }
      ],
      '/api/': [
        { text: 'Introduction', link: '/api/' },
        { text: 'Weather Service', link: '/api/weather-service' },
        { text: 'AI Service', link: '/api/ai-service' }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/balajigoduguluru/auralis-ai' }
    ]
  }
})